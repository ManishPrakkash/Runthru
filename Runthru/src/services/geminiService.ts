import api from './api';

const getEndpoint = (action) => {
  switch (action) {
    case 'Explain':
      return '/api/explain';
    case 'Refactor':
      return '/api/explain/refactor';
    case 'Debug':
      return '/api/explain/debug';
    default:
      return '/api/explain';
  }
};

export const processCode = async (code, action) => {
  try {
    const endpoint = getEndpoint(action);
    const res = await api.post(endpoint, { code });

    // Normalize response shape from server
    if (res.data && res.data.explanation) return res.data.explanation;
    if (res.data && res.data.refactoredCode) return res.data.refactoredCode;
    if (res.data && res.data.debugInfo) return res.data.debugInfo;

    // Fallback to any string-like response
    if (typeof res.data === 'string') return res.data;
    return JSON.stringify(res.data || '');
  } catch (err) {
    console.error('Error calling backend for code processing:', (err && err.response && err.response.data) || (err && err.message));
    throw new Error((err && err.response && err.response.data && err.response.data.message) || (err && err.message) || 'Failed to process code');
  }
};
 