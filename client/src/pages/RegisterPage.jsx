import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import axios from "../api/axios.js";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  //States
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // secretKey is optional — only admins fill this
    // if empty defaults to 'player' role
    secretKey: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // client-side validation before even hitting the API
    // catch obvious mistakes early, save unnecessary API calls
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/auth/user/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        // only send secretKey if the user actually typed one
        // if empty  we don't send it
        ...(formData.secretKey && { secretKey: formData.secretKey }),
      });

      // server returns user data & token just like login

      login(data);
      navigate("/tickets");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong, try again",
      );
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
        {/* ── Header with live avatar preview ── */}
        <div className="text-center mb-4">
          {/* avatar updates live as the user types their name */}
          {/* if no name typed  use "Player" as fallback  */}
          <Avatar
            name={formData.fullName || "Player"}
            role="player"
            size={80}
          />
          <h2 className="fw-bold mt-3">Create Account</h2>
        </div>

        {/* ── Error Alert ── */}
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* ── Register Form ── */}
        <Form onSubmit={handleSubmit}>
          {/* Full Name */}
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
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

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Secret Key — optional, for admin accounts */}
          <Form.Group className="mb-4">
            <Form.Label>
              Admin Secret Key{" "}
              <span className="text-muted fw-normal">(optional)</span>
            </Form.Label>
            <Form.Control
              type="password"
              name="secretKey"
              placeholder="Leave empty if you are a player"
              value={formData.secretKey}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Only fill this if you have an admin secret key
            </Form.Text>
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Form>

        {/* Redirect to Login */}
        <p className="text-center mt-3 text-muted">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </Container>
  );
};

export default RegisterPage;
