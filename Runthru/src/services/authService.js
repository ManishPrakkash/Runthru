import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const registerUser = async (username, password) => {
  try {
    console.log(`[AUTH] Registering user: ${username}`);
    console.log(`[AUTH] Request to: ${SERVER_URL}/api/auth/register`);
    const response = await axios.post(`${SERVER_URL}/api/auth/register`, { username, password });
    console.log('[AUTH] Register response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('[AUTH] Registration error:', error?.response?.status, error?.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    console.log(`[AUTH] Logging in user: ${username}`);
    console.log(`[AUTH] Request to: ${SERVER_URL}/api/auth/login`);
    const response = await axios.post(`${SERVER_URL}/api/auth/login`, { username, password });
    console.log('[AUTH] Login response:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('[AUTH] Login error:', error?.response?.status, error?.response?.data || error.message);
    throw error;
  }
};
