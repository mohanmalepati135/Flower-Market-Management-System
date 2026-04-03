


import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setError(null);
    } catch (error) {
      console.error('Fetch user error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setError('Session expired');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login:', email); // Debug
      
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      console.log('Login successful:', user.fullName); // Debug
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setError(null);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || 'Login failed. Please check your connection.';
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);