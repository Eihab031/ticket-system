import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Toast,
  ToastContainer,
  Badge,
} from "react-bootstrap";
import axios from "../api/axios.js";
import AdminSidebar from "../components/AdminSidebar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/auth/user/players");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
        setToastMsg("Failed to load users. Ensure you have Admin access.");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Container fluid className="vh-100 bg-light p-0">
      <Row className="h-100 g-0">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* ── Users list ── */}
        <Col md={10} lg={10} className="p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">User Management</h2>
          </div>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Table hover responsive className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4 border-0 text-muted fw-semibold">
                        Name
                      </th>
                      <th className="py-3 px-4 border-0 text-muted fw-semibold">
                        Email
                      </th>
                      <th className="py-3 px-4 border-0 text-muted fw-semibold">
                        Role
                      </th>
                      <th className="py-3 px-4 border-0 text-muted fw-semibold">
                        Joined Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="py-3 px-4 fw-bold">{user.fullName}</td>
                        <td className="py-3 px-4 text-secondary">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            bg={user.role === "admin" ? "danger" : "primary"}
                            className="px-3 py-2 rounded-pill"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

export default UsersPage;
