// frontend/src/config/api.js

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Use the environment variable set by Render
    return process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com';
  }
  
  // Development environment
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

export default API_BASE_URL;

// Export additional configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
