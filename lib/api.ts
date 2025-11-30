import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/invalidity
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optional: clear other user-related localStorage items
        // window.location.href = '/login'; // Redirect to login page
        // Or use Next.js router.push if available (requires useRouter hook)
      }
    }
    return Promise.reject(error);
  }
);

export default api;