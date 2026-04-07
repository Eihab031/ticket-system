import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import PlayerDashboard from "./PlayerDashboard";

const TicketsPage = () => {
  const { user } = useAuth();

  // Route based on role
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <PlayerDashboard />;
};

export default TicketsPage;
