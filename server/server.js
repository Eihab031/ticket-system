import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import ticketRouter from "./routes/ticket.route.js";
import messageRouter from "./routes/message.route.js";

/* dotenv.config(); */
const port = process.env.PORT || 5000;
const app = express();

//read JSON body Data
app.use(express.json());

//CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.json({ message: "API is running..." }); //server health check
});
app.use("/api/auth/user", userRouter); //User router using auth middleware
app.use("/api/tickets", ticketRouter); //ticket router using auth middleware
app.use("/api/tickets/:id/messages", messageRouter); // messages router using auth middleware

//Error handler middleware for User controller
app.use(errorHandler);
//connecting to server
app.listen(port, () => {
  connectDB();
  console.log(`server started on port :${port}`);
});
