import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; 


dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);  // Make sure it is prefixed with "/api"

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (msg) => {
    const newMessage = await Message.create(msg);
    io.emit("newMessage", newMessage); // Broadcast to all users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// API route to get messages
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
