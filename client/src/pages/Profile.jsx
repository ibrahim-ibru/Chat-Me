// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData({
          username: response.data.username,
          email: response.data.email
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/users/update', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsEditing(false);
      // Add success message if needed
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleBack = () => {
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <button 
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-700"
          >
            Back to Chat
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
            {userData.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${!isEditing ? 'bg-gray-100' : ''}`}
            id="username"
            name="username"
            type="text"
            value={userData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight ${!isEditing ? 'bg-gray-100' : ''}`}
            id="email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        
        <div className="flex justify-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={toggleEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;