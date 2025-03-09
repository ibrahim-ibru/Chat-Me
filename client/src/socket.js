
// /client/src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Your backend URL

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect only when needed
});

export const connectSocket = (userId) => {
  if (userId) {
    socket.auth = { userId };
    socket.connect();
  }
};



