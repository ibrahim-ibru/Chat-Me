import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { socket, connectSocket } from "../socket";
import API from "../api/api";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      connectSocket(user._id); // Connect when user is logged in

      // Fetch previous messages
      API.get("/messages").then((res) => {
        setMessages(res.data);
      });

      // Listen for incoming messages
      socket.on("newMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off("newMessage"); // Cleanup listener on unmount
    };
  }, [user]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMsg = { sender: user._id, text: message };
      socket.emit("sendMessage", newMsg); // Emit to server
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="border p-3 h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              msg.sender === user._id ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
