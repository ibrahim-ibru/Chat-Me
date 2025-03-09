// src/components/UserList.js
import React from 'react';

const UserList = ({ users, onSelectUser, selectedUser }) => {
  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No users available
      </div>
    );
  }
  
  return (
    <div className="overflow-y-auto h-full">
      {users.map(user => (
        <div
          key={user._id}
          className={`flex items-center p-3 cursor-pointer transition hover:bg-gray-50 ${
            selectedUser && selectedUser._id === user._id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectUser(user)}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-500">
              {user.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;

