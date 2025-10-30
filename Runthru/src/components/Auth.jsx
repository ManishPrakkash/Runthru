import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 'http://localhost:5000';

const Auth = ({ type }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      console.log(`📤 Sending ${type} request to:`, `${SERVER_URL}${endpoint}`);
      console.log('📝 Data:', { username, password: '****' });
      
      const response = await axios.post(`${SERVER_URL}${endpoint}`, { username, password });

      console.log('✅ Response received:', response.data);

      if (response.data.token) {
        // ✅ Save token to localStorage
        localStorage.setItem('token', response.data.token);

        // ✅ Call login from context
        login(response.data.token, response.data.username);

        // ✅ Navigate to home/dashboard
        navigate('/');
      } else {
        setError(response.data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        statusText: err.response?.statusText
      });
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg glassmorphism"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
        {type === 'login' ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : (type === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <Link to={type === 'login' ? '/register' : '/login'} className="text-blue-600 hover:underline dark:text-blue-400">
          {type === 'login' ? 'Register here' : 'Login here'}
        </Link>
      </p>
    </motion.div>
  );
};

export default Auth;
