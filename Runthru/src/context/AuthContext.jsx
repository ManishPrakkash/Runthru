import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // ✅ Correct usage without destructuring

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
        console.error('🔴 Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function
  const login = (token, username) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser({ username: username || decoded.username, id: decoded.id });
    } catch (err) {
      console.error("Login error: Failed to decode token", err);
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
