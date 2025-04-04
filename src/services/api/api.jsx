import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/cv';

export const startCVSession = async () => {
  const response = await axios.post(`${API_BASE}/start/`);
  return response.data;
};

export const sendCVMessage = async (sessionId, message) => {
  const response = await axios.post(`${API_BASE}/chat/${sessionId}/`, {
    message: message
  });
  return response.data;
};

export const generatePDF = async (sessionId) => {
  const response = await axios.get(`${API_BASE}/download/${sessionId}/`, {
    responseType: 'blob'
  });
  return response.data;
};