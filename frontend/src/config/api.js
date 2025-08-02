// src/config/api.js

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://your-production-backend-url.com';
  }
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

if (process.env.NODE_ENV === 'development') {
  console.log('API base URL:', API_URL);
}

export default API_URL;
