import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Table,
  Badge,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all tickets
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get("/tickets");
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets", error);
      }
    };
    fetchTickets();
  }, []);

  // checking backend statuses for  UI badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <Badge bg="success" text="light" className="px-3 py-2 rounded-pill">
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
    <Container fluid className="vh-100 bg-light p-0">
      <Row className="h-100 g-0">
        {/* ── Sidebar ── */}
        <Col
          md={2}
          lg={2}
          className="bg-white border-end d-flex flex-column pt-4"
        >
          <div className="px-4 mb-4 fw-bold fs-5 d-flex align-items-center">
            {/* logo placeholder */}
            <span className="bg-dark text-white rounded-circle px-2 py-1 me-2 fs-6">
              A
            </span>
            Admin Panel
          </div>

          <Nav className="flex-column w-100">
            {/* Active Link styling */}
            <Nav.Link className="text-primary py-3 px-4 bg-primary bg-opacity-10 fw-semibold border-start border-4 border-primary">
              Tickets
            </Nav.Link>
            {/* Inactive Links */}
            <Nav.Link className="text-secondary py-3 px-4 border-start border-4 border-white">
              Users
            </Nav.Link>
            <Nav.Link className="text-secondary py-3 px-4 border-start border-4 border-white">
              Reports
            </Nav.Link>
            <Nav.Link className="text-secondary py-3 px-4 border-start border-4 border-white">
              Settings
            </Nav.Link>
          </Nav>
        </Col>

        {/* ── Main Content Area ── */}
        <Col md={10} lg={10} className="p-5">
          {/* Top Bar: Title & Search */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Support Tickets</h2>
            <div style={{ width: "300px" }}>
              <InputGroup>
                <Form.Control placeholder="Search..." className="bg-white" />
                <Button variant="primary">Search</Button>
              </InputGroup>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white p-4 rounded shadow-sm">
            <Table hover responsive className="align-middle border-bottom-0">
              <thead>
                <tr>
                  <th className="text-muted fw-normal pb-3 border-0">
                    Ticket ID
                  </th>
                  <th className="text-muted fw-normal pb-3 border-0">
                    Player Name
                  </th>
                  <th className="text-muted fw-normal pb-3 border-0">
                    Subject
                  </th>
                  <th className="text-muted fw-normal pb-3 border-0">Status</th>
                  <th className="text-muted fw-normal pb-3 border-0 text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* mapping tickets and render them */}
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="py-3">#{ticket._id.substring(0, 6)}</td>

                    <td className="py-3">
                      {ticket.user?.fullName || "Unknown"}
                    </td>
                    <td className="py-3">{ticket.title}</td>
                    <td className="py-3">{getStatusBadge(ticket.status)}</td>
                    <td className="py-3 text-end">
                      <Button
                        variant="light"
                        size="sm"
                        className="rounded-pill px-3"
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}

                {tickets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
