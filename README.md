# 🎮 GameSupport — Player Ticket System

A full-stack MERN support ticket system built for gaming platforms. Players submit support tickets, and admins (support agents) respond in real-time and manage ticket statuses through a dedicated dashboard.

---

## 🌐 Live Demo

> deploy with Railway (backend) + Vercel (frontend)

---

## 📸 Screenshots

| Player Dashboard           | Admin Dashboard                 | Ticket Detail                      |
| -------------------------- | ------------------------------- | ---------------------------------- |
| Player views their tickets | Admin sees all tickets + search | Full conversation + status control |

---

## ✨ Features

### 👤 Players can:

- Register and login securely
- Create support tickets with issue type, title, and description
- View all their own tickets and their statuses
- Send and delete messages inside their ticket
- See real-time replies from support
- Get a unique auto-generated avatar based on their name

### 👑 Admins can:

- View ALL tickets from ALL players
- Search tickets by title or player name
- Open individual tickets and read the full conversation
- Reply to players in real-time
- Update ticket status (New → in process → Closed)
- Delete any message in the conversation

---

## 🛠️ Tech Stack

### Backend

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| Node.js               | Runtime environment        |
| Express.js v5         | REST API framework         |
| MongoDB               | Database                   |
| Mongoose              | ODM for MongoDB            |
| JSON Web Token (JWT)  | Authentication             |
| bcryptjs              | Password hashing           |
| express-async-handler | Async error handling       |
| dotenv                | Environment variables      |
| cors                  | Cross-origin requests      |
| Pusher (server)       | Real-time event triggering |

### Frontend

| Technology                    | Purpose                      |
| ----------------------------- | ---------------------------- |
| React (Vite)                  | UI framework                 |
| React Router DOM v7           | Client-side routing          |
| Axios                         | HTTP requests + interceptors |
| React Bootstrap + Bootstrap 5 | UI components and styling    |
| Pusher JS (client)            | Real-time message receiving  |
| Context API                   | Global auth state management |

### External APIs

| API          | Purpose                                   |
| ------------ | ----------------------------------------- |
| DiceBear API | Auto-generated avatars (players + admins) |
| Pusher       | Real-time messaging without page refresh  |

---

## 🔐 Roles & Permissions

| Action                 | Player | Admin |
| ---------------------- | ------ | ----- |
| Register / Login       | ✅     | ✅    |
| Create a ticket        | ✅     | ❌    |
| View own tickets       | ✅     | —     |
| View ALL tickets       | ❌     | ✅    |
| Send message on ticket | ✅     | ✅    |
| Delete own message     | ✅     | ✅    |
| Delete any message     | ❌     | ✅    |
| Update ticket status   | ❌     | ✅    |
| Search tickets         | ❌     | ✅    |
| View player list       | ❌     | ✅    |

---

## 🧪 Testing the WebApp

### Option 1 — Create your own accounts

**Register a player account:**

```
Go to /register
Fill in your details
Leave the "Admin Secret Key" field empty
→ You are now a player
```

**Register an admin account:**

```
Go to /register
Fill in your details
Enter the ADMIN_SECRET_KEY from  .env file "Hamburg2026"
→ You are now an admin (support agent)
```

---

### Option 2 — Use these test credentials

**Player account:**

```
Email:    james@test.com
Password: 12345678
Role:     Player
```

**Admin account:**

```
Email:    eihab@gmx.com
Password: 2514475
Role:     Admin (Support Agent)
```

> 💡 If these don't work, register fresh accounts using "Hamburg2026" as a Key

---

### Testing the full flow

```
1. Login as player
   → Create a new ticket
   → Send a message in the ticket

2. Open a second browser tab (or incognito)
   → Login as admin
   → Go to admin dashboard
   → Search for the ticket by title or player name
   → Click View
   → Reply to the player's message
   → Watch the player's tab update in real-time (Pusher)
   → Change the ticket status to "in process" or "Closed"

3. Switch back to player tab
   → The new message appears without refreshing
```

---

## 🎨 Avatar System

Avatars are automatically generated using the **DiceBear API** — no uploads needed.

---

## 💬 Real-time Messaging

Messages are delivered instantly using **Pusher** .

```
Player sends message
       ↓
Backend saves to MongoDB
       ↓
Backend triggers Pusher event on channel "ticket-{ticketId}"
       ↓
All subscribers on that channel receive the event
       ↓
React state updates → new message appears instantly ✅
```

---

## 👨‍💻 Author

**Eihab**

- GitHub: [@Eihab031](https://github.com/Eihab031)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
