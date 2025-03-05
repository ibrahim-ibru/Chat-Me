import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { socket, connectSocket } from "../socket";
import API from "../api/api";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return; // Wait until user is loaded

    if (!user) {
      navigate("/login"); // Redirect only if user is null after loading
      return;
    }

    connectSocket(user._id);

    API.get("/users/me")
      .then((res) => {
        setMessages(res.data.messages || []); // Ensure messages is an array
      })
      .catch((err) => console.error("Error fetching messages:", err));

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [user, navigate]);

  // 🔥 Add missing sendMessage function here
  const sendMessage = () => {
    if (message.trim()) {
      const newMsg = { sender: user._id, text: message };
      socket.emit("sendMessage", newMsg); // Emit to server
      setMessages((prev) => [...prev, newMsg]); // Update local state
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="border p-3 h-80 overflow-y-auto">
        {Array.isArray(messages) ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded ${
                msg.sender === user._id ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {msg.sender === user._id ? "You: " : `${msg.sender}: `}
              {msg.text}
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
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
