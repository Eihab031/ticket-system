import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Toast,
  ToastContainer,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import TicketChat from "../components/TicketChat.jsx";

const Ticketdetails = () => {
  const { id } = useParams(); // Gets the ticket ID from the URL
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/tickets/${id}`);
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket", error);
        setToastMsg(
          error.response?.data?.message || "Failed to load ticket details",
        );
        setToastVariant("danger");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <Badge bg="success" className="px-3 py-2 rounded-pill">
            New
          </Badge>
        );
      case "open":
        return (
          <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
            Open
          </Badge>
        );
      case "closed":
        return (
          <Badge bg="secondary" className="px-3 py-2 rounded-pill">
            Closed
          </Badge>
        );
      default:
        return <Badge bg="primary">{status}</Badge>;
    }
  };

  // If still loading, show a spinner
  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // If there's no ticket or Error show an error state
  if (!ticket) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger">Ticket not found or access denied.</h3>
        <Button
          variant="outline-secondary"
          className="mt-3"
          onClick={() => navigate("/tickets")}
        >
          Return to Dashboard
        </Button>
        {/* Render Toast for error message */}
        <ToastContainer
          position="top-end"
          className="p-4"
          style={{ position: "fixed", zIndex: 1050 }}
        >
          <Toast
            bg={toastVariant}
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Body className="text-white fw-semibold">
              {toastMsg}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Back to Dashboard */}
      <Button
        variant="link"
        className="text-decoration-none text-secondary mb-3 px-0"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Dashboard
      </Button>

      {/* Ticket  Card*/}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted small fw-bold text-uppercase">
              Ticket #{ticket._id.substring(0, 8)}
            </span>
            <h3 className="fw-bold mt-1 mb-0">{ticket.title}</h3>
          </div>
          <div>{getStatusBadge(ticket.status)}</div>
        </Card.Header>

        <Card.Body className="px-4 py-4">
          <div className="mb-4 d-flex gap-4 text-muted small fw-semibold">
            <div>
              <span className="text-secondary">Issue Type:</span>{" "}
              <Badge bg="info" className="text-white">
                {ticket.issue_type}
              </Badge>
            </div>
            <div>
              <span className="text-secondary">Opened:</span>{" "}
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="bg-light p-4 rounded border">
            <h6 className="fw-bold text-secondary mb-2">Description:</h6>
            <p className="mb-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>
              {ticket.description}
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Chat Section  */}
      <TicketChat ticketId={ticket._id} />

      {/* Toast Component*/}
      <ToastContainer
        position="top-end"
        className="p-4"
        style={{ position: "fixed", zIndex: 1050 }}
      >
        <Toast
          bg={toastVariant}
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

export default Ticketdetails;
