import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Alert, Spinner, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios.js";

const LoginPage = () => {
  const { login } = useAuth(); // authentication
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Hook to show loading spinner
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); //stop refreshing
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/user/login", formData);
      login(data); //save to context and localStorage
      navigate("/tickets"); //redirect to Tickets page
    } catch (err) {
      setError(err.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="w-100" style={{ maxWidth: "420px" }}>
        {/* header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">welcome back</h2>
          <p className="text-muted">Login to manage your tickets</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        {/* form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
        {/* redirect to register */}
        <p className="text-center mt-3 text-muted">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
