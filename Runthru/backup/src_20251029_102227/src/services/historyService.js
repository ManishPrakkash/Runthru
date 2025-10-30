import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchUserHistory = async (token) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/history`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Fetch history service error:', error);
    throw error;
  }
};
