import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//protect Tickets Page and redirect to Login Page
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;
