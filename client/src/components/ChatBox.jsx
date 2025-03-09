// src/components/ChatBox.js
import React from 'react';

const ChatBox = ({ messages, currentUser, selectedUser, loading, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map(message => {
          // Update this to use sender instead of sender._id
          const isCurrentUser = message.sender === currentUser._id;
          
          return (
            <div
              key={message._id}
              className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}
              >
                {/* Update this to use text instead of content */}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBox;

