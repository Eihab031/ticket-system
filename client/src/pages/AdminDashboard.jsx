import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios.js";
import AdminSidebar from "../components/AdminSidebar.jsx";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);

  // search state
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
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

  // Search Filter
  // when search is empty → filteredTickets = all tickets
  const filteredTickets = tickets.filter((ticket) => {
    // convert search to lowercase for case-insensitive comparison
    const searchLower = search.toLowerCase();

    // check if title contains the search text
    const titleMatch = ticket.title.toLowerCase().includes(searchLower);

    // check if player name contains the search text
    // we use ?. because ticket.user might be null in some cases
    const nameMatch = ticket.user.fullName?.toLowerCase().includes(searchLower);

    // return true if title OR name matches
    // true  = keep this ticket in the filtered array
    // false = remove it from the filtered array
    return titleMatch || nameMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <Badge bg="success" text="light" className="px-3 py-2 rounded-pill">
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

  return (
    <Container fluid className="vh-100 bg-light p-0">
      <Row className="h-100 g-0">
        {/* ── Sidebar ── */}
        <AdminSidebar />
        {/* ── Main Content ── */}
        <Col md={10} className="p-5">
          {/* ── Top Bar ── */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="fw-bold m-0">Support Tickets</h2>

            {/* search bar */}
            <div style={{ width: "320px" }}>
              <InputGroup>
                <Form.Control
                  placeholder="Search by title or player name..."
                  className="bg-white"
                  value={search}
                  // every keystroke updates search state
                  // filteredTickets recalculates automatically
                  onChange={(e) => setSearch(e.target.value)}
                />
                {/* only show clear button when something is typed */}
                {search && (
                  <Button
                    variant="outline-secondary"
                    // reset search → shows all tickets again
                    onClick={() => setSearch("")}
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
            </div>
          </div>

          {/* ── Results Count ── */}
          <p className="text-muted small mb-4">
            {search
              ? // search is active .show how many matched
                `${filteredTickets.length} result${filteredTickets.length !== 1 ? "s" : ""} for "${search}"`
              : // no search .show total count
                `${tickets.length} total ticket${tickets.length !== 1 ? "s" : ""}`}
          </p>

          {/* ── Table Card ── */}
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
                {filteredTickets.map((ticket) => (
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

                {/* ── Empty States ── */}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      {search
                        ? // search returned nothing
                          `No tickets found matching "${search}"`
                        : // no tickets at all in the system
                          "No tickets yet."}
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
