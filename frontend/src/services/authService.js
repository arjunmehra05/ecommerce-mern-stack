// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  }
};

export default authService;
