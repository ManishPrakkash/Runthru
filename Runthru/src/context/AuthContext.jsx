import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username: decoded.username, id: decoded.id });
        } else {
          console.warn("⏰ Token expired");
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('🔴Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);
  
  // Login function
  const login = (token, username) => {
    // Always persist the token so API calls can use it. If decoding fails,
    // still save the token and fall back to the provided username.
    try {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({ username: username || decoded.username, id: decoded.id });
    } catch (err) {
      console.warn('Login: token saved but failed to decode token:', err?.message || err);
      // Fall back to provided username if decode failed
      setUser({ username: username || null, id: null });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
