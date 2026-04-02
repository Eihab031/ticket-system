import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Ticketdetails from "./pages/Ticketdetails";
import TicketsPage from "./pages/TicketsPage";
import NotfoundPage from "./pages/NotfoundPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Tickets/:id" element={<Ticketdetails />} />
        <Route path="/Tickets" element={<TicketsPage />} />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
