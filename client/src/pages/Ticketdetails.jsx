import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Toast,
  ToastContainer,
  Button,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import TicketChat from "../components/TicketChat.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Ticketdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // get user from context to check role
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // tracks the status dropdown value
  // starts as empty string, gets set once ticket loads
  const [selectedStatus, setSelectedStatus] = useState("");

  // tracks if status update is in progress
  // used to disable button while waiting for response
  const [statusLoading, setStatusLoading] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  // helper to show toast
  //  for both errors and success messages
  const triggerToast = (message, variant = "danger") => {
    setToastMsg(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await axios.get(`/tickets/${id}`);
        setTicket(data);
        // set the dropdown to match the ticket's current status
        setSelectedStatus(data.status);
      } catch (error) {
        triggerToast(
          error.response?.data?.message || "Failed to load ticket details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // ── Status change handler ──
  const handleStatusUpdate = async () => {
    // don't call API if same status
    if (selectedStatus === ticket.status) {
      triggerToast("Status is already set to this value", "warning");
      return;
    }

    setStatusLoading(true);

    try {
      const { data } = await axios.put(`/tickets/${id}`, {
        status: selectedStatus,
      });

      // update ticket in state with the response from backend
      setTicket(data);

      // show success toast
      triggerToast("Ticket status updated successfully", "success");
    } catch (error) {
      triggerToast(error.response?.data?.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <Badge bg="success" className="px-3 py-2 rounded-pill">
            New
          </Badge>
        );
      case "in process":
        return (
          <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
            in process
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
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* Back button */}
      <Button
        variant="link"
        className="text-decoration-none text-secondary mb-3 px-0"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Dashboard
      </Button>

      {/* ── Ticket Card ── */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <span className="text-muted small fw-bold text-uppercase">
                Ticket #{ticket._id.substring(0, 8)}
              </span>
              <h3 className="fw-bold mt-1 mb-0">{ticket.title}</h3>
            </div>
            {/* always show the current status badge */}
            <div>{getStatusBadge(ticket.status)}</div>
          </div>
        </Card.Header>

        <Card.Body className="px-4 py-4">
          {/* Ticket meta info */}
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

          {/* Ticket description */}
          <div className="bg-light p-4 rounded border mb-4">
            <h6 className="fw-bold text-secondary mb-2">Description:</h6>
            <p className="mb-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>
              {ticket.description}
            </p>
          </div>

          {/* ── Admin Status Changer ── */}
          {/* only  for admin */}
          {user?.role === "admin" && (
            <div className="bg-white border rounded p-3">
              <h6 className="fw-bold text-secondary mb-3">
                🔧 Update Ticket Status
              </h6>
              <div className="d-flex align-items-center gap-3">
                {/* dropdown shows all possible statuses */}
                <Form.Select
                  style={{ width: "200px" }}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in process">in process</option>
                  <option value="closed">Closed</option>
                </Form.Select>

                {/* button triggers the API call */}
                <Button
                  variant="primary"
                  onClick={handleStatusUpdate}
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>

              {/* helpful hint showing current status */}
              <small className="text-muted mt-2 d-block">
                Current status:{" "}
                <strong className="text-capitalize">{ticket.status}</strong>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Chat Section */}
      <TicketChat ticketId={ticket._id} />

      {/* Toast */}
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
