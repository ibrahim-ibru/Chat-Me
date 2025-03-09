// src/components/ChatHeader.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChatHeader = ({ selectedUser, toggleMobileDrawer }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={toggleMobileDrawer}
          className="mr-3 md:hidden"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        {selectedUser ? (
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-800">{selectedUser.username}</p>
              <p className="text-xs text-gray-500">
                {selectedUser.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-lg font-semibold text-gray-800">Chat App</div>
        )}
      </div>

      {/* Profile Icon & Dropdown */}
      <div className="relative">
        <div 
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {currentUser?.username?.charAt(0).toUpperCase()}
        </div>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button 
              onClick={handleProfileClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;