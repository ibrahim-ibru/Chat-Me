// server/server.js (updated socket.io section)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Update the Socket.IO CORS configuration to allow your frontend origin
const io = new Server(server, {
  cors: { 
    origin: ["http://localhost:5174", "http://localhost:5175","http://localhost:5173"], // Support both origins
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Also update the Express CORS middleware to allow your frontend origin
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5175","http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

// Socket connections map to track users
const connectedUsers = new Map();

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins with their ID
  socket.on("join", (userId) => {
    // Store the socket id with the user id
    connectedUsers.set(userId, socket.id);
    
    // Update user status to online
    io.emit("userStatusChanged", { _id: userId, isOnline: true });
    
    console.log(`User ${userId} is now connected with socket ${socket.id}`);
  });

  // When a message is sent
  socket.on("sendMessage", async (messageData) => {
    const { sender, receiver, text } = messageData;
    
    try {
      // Create and save the message
      const newMessage = new Message({ sender, receiver, text });
      const savedMessage = await newMessage.save();
      
      // Emit to both sender and receiver
      const receiverSocket = connectedUsers.get(receiver);
      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", savedMessage);
      }
      
      // Also emit back to sender to ensure both sides update
      socket.emit("newMessage", savedMessage);
      
      console.log(`Message from ${sender} to ${receiver} sent successfully`);
    } catch (error) {
      console.error("Error saving/emitting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Find and remove the disconnected user
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        
        // Update user status to offline
        io.emit("userStatusChanged", { _id: userId, isOnline: false });
        
        console.log(`User ${userId} is now offline`);
        break;
      }
    }
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));