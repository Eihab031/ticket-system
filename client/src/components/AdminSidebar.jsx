import { Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  // This function automatically checks if the URL matches the link
  // If it does (isActive is true), it makes it blue. If not, it stays gray.
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link text-primary py-3 px-4 bg-primary bg-opacity-10 fw-semibold border-start border-4 border-primary"
      : "nav-link text-secondary py-3 px-4 border-start border-4 border-white";

  return (
    <Col
      md={2}
      lg={2}
      className="bg-white border-end d-flex flex-column pt-4 vh-100"
    >
      <div className="px-4 mb-4 fw-bold fs-5 d-flex align-items-center">
        <img
          src="/admin.gif"
          width="50"
          height="50"
          className="rounded-circle "
        />
        Admin Panel
      </div>

      <Nav className="flex-column w-100">
        <NavLink to="/tickets" className={navLinkClass}>
          Tickets
        </NavLink>
        <NavLink to="/users" className={navLinkClass}>
          Users
        </NavLink>
      </Nav>
    </Col>
  );
};

export default AdminSidebar;
