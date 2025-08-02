// frontend/src/config/api.js
const getAPIUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://ecommerce-mern-stack-backend-lwl0.onrender.com';
  }
  return 'http://localhost:5000';
};

const API_URL = getAPIUrl();

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_URL);
}

export default API_URL;
