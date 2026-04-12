import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Ticketdetails from "./pages/Ticketdetails";
import TicketsPage from "./pages/TicketsPage";
import NotfoundPage from "./pages/NotfoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NewTicket from "./pages/NewTicket";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/Tickets/:id"
          element={
            <ProtectedRoute>
              <Ticketdetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/new-ticket" element={<NewTicket />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<NotfoundPage />} />

        {/* Redirect root to Tickets Page */}
        <Route path="/" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
