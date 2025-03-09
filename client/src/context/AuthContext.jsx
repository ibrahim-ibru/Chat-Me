
// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const login = async (email, password) => {
    try {
      setError('');
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to login');
      return false;
    }
  };
  
  const register = async (username, email, password) => {
    try {
      setError('');
      await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register');
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

