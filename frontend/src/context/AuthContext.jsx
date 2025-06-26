import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // We now import our central, authenticated API instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To prevent UI flicker on load

  // A single, robust function to handle setting the user state from a token
  const handleToken = useCallback((token) => {
    try {
      localStorage.setItem('careerCanvasToken', token);
      const decoded = jwtDecode(token);
      
      // Defensively checks for user data in the token payload
      const userData = {
        id: decoded.id || decoded.user?.id || '',
        name: decoded.name || decoded.user?.name || 'User',
        email: decoded.email || decoded.user?.email || '',
      };

      setUser(userData);
    } catch (error) {
      console.error('Token decoding failed:', error);
      localStorage.removeItem('careerCanvasToken');
      setUser(null);
    }
  }, []);

  // On initial application load, check for an existing token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('careerCanvasToken');
    if (token) {
      handleToken(token);
    }
    setLoading(false);
  }, [handleToken]);

  // Login function, now using the central API instance
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        handleToken(response.data.token);
        toast.success('Login successful!');
      }
    } catch (error) {
      // Re-throw the error so the UI component can catch it and display a specific message
      const message = error?.response?.data?.message || 'Login failed.';
      toast.error(message);
      throw error;
    }
  };

  // Registration function, now using the central API instance
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      if (response.data.token) {
        handleToken(response.data.token);
        toast.success('Registration successful!');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed.';
      toast.error(message);
      throw error;
    }
  };

  // Logout function remains the same, simple and effective
  const logout = () => {
    localStorage.removeItem('careerCanvasToken');
    setUser(null);
    toast.success('Logged out successfully.');
  };

  // Provide the context value to all children components
  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};