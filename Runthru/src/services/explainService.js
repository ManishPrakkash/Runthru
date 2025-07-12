import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const explainCode = async (code, token) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/explain`, { code }, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Explain code service error:', error);
    throw error;
  }
};

export const uploadCodeFile = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('codeFile', file);
    const response = await axios.post(`${SERVER_URL}/api/explain/upload`, formData, {
      headers: {
        ...getAuthHeaders(token).headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload code file service error:', error);
    throw error;
  }
};

export const refactorCode = async (code, token) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/explain/refactor`, { code }, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Refactor code service error:', error);
    throw error;
  }
};

export const debugCode = async (code, token) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/explain/debug`, { code }, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    console.error('Debug code service error:', error);
    throw error;
  }
};
export const dryRunCode = async (code, token) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/explain/dryrun`, { code }, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw error;
  }
};