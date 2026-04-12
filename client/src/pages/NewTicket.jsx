import { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

const NewTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [issueType, setIssueType] = useState("General Inquiry");
  const [description, setDescription] = useState("");

  // Local Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/tickets", {
        title,
        issue_type: issueType,
        description,
      });
      // back to dashboard on success
      navigate("/tickets");
    } catch (error) {
      console.error("Failed to create ticket", error);
      setToastMsg(error.response?.data?.message || "Failed to create ticket");
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "700px" }}>
      <Button
        variant="link"
        className="text-decoration-none text-secondary mb-3 px-0"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Dashboard
      </Button>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
          <h2 className="fw-bold mb-0">Create New Ticket</h2>
          <p className="text-muted mt-2">
            Please fill out the form below to report an issue.
          </p>
        </Card.Header>

        <Card.Body className="px-4 py-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Briefly describe your issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Issue Type</Form.Label>
              <Form.Select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Billing">Billing</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                Detailed Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Please provide as much detail as possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={loading}
                className="fw-bold"
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer
        position="top-end"
        className="p-4"
        style={{ position: "fixed", zIndex: 1050 }}
      >
        <Toast
          bg="danger"
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white fw-semibold">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default NewTicket;
