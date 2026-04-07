import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/tickets">
          Ticket-system
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              //if user logged-in
              <>
                <div className="d-flex align-items-center gap-2 mx-3">
                  <Avatar name={user.fullName} role={user.role} size={35} />
                  <span className="text-light">
                    {user.fullName.split(" ")[0]}
                  </span>
                  {user.role === "admin" && (
                    <span className="badge bg-warning text-dark">Support</span>
                  )}
                </div>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              // if not logged-in
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  SignUp
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
