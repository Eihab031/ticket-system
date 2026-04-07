import { useState, useEffect } from "react";
import { Form, InputGroup, Button, Card } from "react-bootstrap";
import axios from "../api/axios.js";
import Pusher from "pusher-js";
import { useAuth } from "../context/AuthContext.jsx";

// passing 'ticketId' from the Ticketdetails page
const TicketChat = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();

  // Fetch initial messages and set up Pusher
  useEffect(() => {
    // Fetch old messages database
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/tickets/${ticketId}/messages`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
    fetchMessages();

    // Set up Pusher to listen for NEW messages live

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe(`ticket-${ticketId}`);

    // Listen for 'new-message' event from  backend
    channel.bind("new-message", function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup function when the user leaves the page
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [ticketId]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/tickets/${ticketId}/messages`, { body: newMessage });
      setNewMessage(""); // Clear input field after sending
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };
  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`/tickets/${ticketId}/messages/${messageId}`);
        // Remove message from the screen
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId),
        );
      } catch (error) {
        console.error("Failed to delete message", error);
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 mt-4">
      <Card.Header className="bg-light fw-bold">Conversation</Card.Header>

      <Card.Body
        className="bg-light"
        style={{ height: "400px", overflowY: "auto" }}
      >
        {messages.length === 0 ? (
          <p className="text-center text-muted mt-5">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`d-flex flex-column mb-3 ${msg.isAdmin ? "align-items-end" : "align-items-start"}`}
            >
              <div
                className={`p-3 pe-4 rounded position-relative ${msg.isAdmin ? "bg-primary text-white" : "bg-white border"}`}
                style={{ maxWidth: "80%" }}
              >
                <div
                  className={`small fw-bold mb-1 ${msg.isAdmin ? "text-light" : "text-primary"}`}
                >
                  {msg.isAdmin ? "Support" : msg.sender?.fullName || "User"}
                </div>
                <div>{msg.body}</div>
                {/* The "X" Delete Icon */}
                {(user?.role === "admin" || user?._id === msg.sender?._id) && (
                  <Button
                    variant="link"
                    className={`p-0 position-absolute top-0 end-0 mt-1 me-2 text-decoration-none fw-bold ${msg.isAdmin ? "text-light" : "text-danger"}`}
                    style={{ fontSize: "1.2rem", lineHeight: "1" }}
                    onClick={() => handleDeleteMessage(msg._id)}
                    title="Delete Message"
                  >
                    &times;
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </Card.Body>

      <Card.Footer className="bg-white p-3">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={!newMessage.trim()}
            >
              Send
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default TicketChat;
