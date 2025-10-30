import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const History = ({ setCode, setExplanation, setAudioUrl, setVisualData }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        setError('Please log in to view your history.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${SERVER_URL}/api/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err.response?.data?.message || 'Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]); // Re-fetch when user context changes

  const handleReplay = (item) => {
    setCode(item.code);
    setExplanation(item.explanation);
    setAudioUrl(item.audioUrl);
    setVisualData(item.visualData);
    // Scroll to top or main explanation section if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl text-gray-600 dark:text-gray-300">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;
  }

  if (history.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
        No history found. Submit some code to see it here!
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">My History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            onClick={() => handleReplay(item)}
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Code Snippet (ID: {item._id.substring(0, 8)}...)
              </h3>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-hidden whitespace-pre-wrap max-h-24">
                {item.code.substring(0, 200)}...
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors self-end">
              Replay
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default History;
