import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Button,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

const PlayerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  useEffect(() => {
    // Fetch only player's tickets
    const fetchMyTickets = async () => {
      try {
        const { data } = await axios.get("/tickets");
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets", error);
        // Trigger error toast
        setToastMsg(error.response?.data?.message || "Failed to load tickets");
        setToastVariant("danger");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

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

  return (
    <Container className="py-5" style={{ maxWidth: "1000px" }}>
      {/* Title & Create Button*/}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">My Support Tickets</h2>
        {/* new-ticket page */}
        <Button
          variant="primary"
          className="fw-semibold px-4"
          onClick={() => navigate("/new-ticket")}
        >
          + Create New Ticket
        </Button>
      </div>

      {/* Tickets Table Card */}
      <div className="bg-white p-4 rounded shadow-sm">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted fw-semibold">
              Loading your tickets...
            </p>
          </div>
        ) : (
          <Table hover responsive className="align-middle border-bottom-0 mb-0">
            <thead>
              <tr>
                <th className="text-muted fw-normal pb-3 border-0">
                  Ticket ID
                </th>
                <th className="text-muted fw-normal pb-3 border-0">Subject</th>
                <th className="text-muted fw-normal pb-3 border-0">Status</th>
                <th className="text-muted fw-normal pb-3 border-0">
                  Created On
                </th>
                <th className="text-muted fw-normal pb-3 border-0 text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="py-3 text-secondary fw-semibold">
                    #{ticket._id.substring(0, 6)}
                  </td>
                  <td className="py-3 fw-bold text-dark">{ticket.title}</td>
                  <td className="py-3">{getStatusBadge(ticket.status)}</td>
                  <td className="py-3 text-muted">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-4 fw-semibold"
                      onClick={() => navigate(`/tickets/${ticket._id}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <h5 className="text-muted mb-3">
                      You don't have any tickets yet.
                    </h5>
                    <p className="text-secondary">
                      If you are experiencing an issue, click 'Create New
                      Ticket' above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

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

export default PlayerDashboard;
