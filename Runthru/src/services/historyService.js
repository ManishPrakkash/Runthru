import api from './api'; // Use the shared api instance with interceptor

// No need for manual token handling - the api interceptor auto-attaches Authorization header
export const fetchUserHistory = async () => {
  try {
    console.log('[historyService] Fetching user history');
    const response = await api.get('/api/history');
    console.log('[historyService] History response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[historyService] Fetch history error:', error?.response?.data || error.message);
    throw error;
  }
};
