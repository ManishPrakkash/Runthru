import api from './api'; // Use the shared api instance with interceptor

// No need for manual token handling - the api interceptor auto-attaches Authorization header
export const explainCode = async (code) => {
  try {
    console.log('[explainService] Calling /api/explain');
    const response = await api.post('/api/explain', { code });
    console.log('[explainService] Explain response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[explainService] Explain code error:', error?.response?.data || error.message);
    throw error;
  }
};

export const uploadCodeFile = async (file) => {
  try {
    console.log('[explainService] Uploading file:', file.name);
    const formData = new FormData();
    formData.append('codeFile', file);
    const response = await api.post('/api/explain/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[explainService] Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[explainService] Upload code file error:', error?.response?.data || error.message);
    throw error;
  }
};

export const refactorCode = async (code) => {
  try {
    console.log('[explainService] Calling /api/explain/refactor');
    const response = await api.post('/api/explain/refactor', { code });
    console.log('[explainService] Refactor response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[explainService] Refactor code error:', error?.response?.data || error.message);
    throw error;
  }
};

export const debugCode = async (code) => {
  try {
    console.log('[explainService] Calling /api/explain/debug');
    const response = await api.post('/api/explain/debug', { code });
    console.log('[explainService] Debug response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[explainService] Debug code error:', error?.response?.data || error.message);
    throw error;
  }
};

export const dryRunCode = async () => {
  const error = new Error('Dry Run feature is temporarily disabled.');
  error.status = 503;
  throw error;
};