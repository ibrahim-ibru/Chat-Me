// src/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import MessageInput from '../components/MessageInput';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef();
  const messagesEndRef = useRef();
  
  // Initialize socket connection
  useEffect(() => {
    // Make sure we're using the correct port for socket connection
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
    });
    
    // Join user's room
    if (currentUser && currentUser._id) {
      socketRef.current.emit('join', currentUser._id);
    
      // Listen for new messages
      socketRef.current.on('newMessage', (message) => {
        // Only add the message if it involves the current chat
        if (
          selectedUser && 
          ((message.sender === currentUser._id && message.receiver === selectedUser._id) ||
           (message.sender === selectedUser._id && message.receiver === currentUser._id))
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
      
      // Listen for user status changes
      socketRef.current.on('userStatusChanged', (updatedUser) => {
        setUsers((prevUsers) => 
          prevUsers.map(user => 
            user._id === updatedUser._id ? { ...user, isOnline: updatedUser.isOnline } : user
          )
        );
      });
    }
    
    // Cleanup socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser, selectedUser]);
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !currentUser._id) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.filter(user => user._id !== currentUser._id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [currentUser]);
  
  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUser) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/chat/messages', {
          params: { 
            sender: currentUser._id,
            receiver: selectedUser._id 
          },
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedUser, currentUser]);
  
  // Scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send message
  const handleSendMessage = async (content) => {
    if (!selectedUser || !content.trim() || !currentUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const messageData = {
        sender: currentUser._id,
        receiver: selectedUser._id,
        text: content.trim()
      };
      
      // Send message to server
      const response = await axios.post(
        'http://localhost:3000/api/chat/send',
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Emit message through socket for real-time updates
      socketRef.current.emit('sendMessage', messageData);
      
      // Add the message to the state immediately without waiting for socket
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsMobileDrawerOpen(false); // Close drawer on mobile when selecting a user
  };
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div 
        className={`md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={toggleMobileDrawer}
      ></div>
      
      {/* User list sidebar */}
      <div 
        className={`bg-white w-80 flex-shrink-0 border-r border-gray-200 z-30 transition-transform duration-300 md:translate-x-0 fixed md:static h-full ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Contacts</h2>
        </div>
        <UserList users={users} onSelectUser={handleSelectUser} selectedUser={selectedUser} />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col max-h-screen">
        <ChatHeader 
          selectedUser={selectedUser} 
          toggleMobileDrawer={toggleMobileDrawer}
        />
        
        {selectedUser ? (
          <>
            <ChatBox 
              messages={messages} 
              currentUser={currentUser} 
              selectedUser={selectedUser} 
              loading={loading} 
              messagesEndRef={messagesEndRef}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-lg">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;