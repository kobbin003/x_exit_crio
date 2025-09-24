import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Employee API
export const employeeAPI = {
  submitResignation: (data) => api.post('/user/resign', data),
  submitExitInterview: (responses) => api.post('/user/responses', { responses }),
};

// Admin API
export const adminAPI = {
  getAllResignations: () => api.get('/admin/resignations'),
  concludeResignation: (data) => api.put('/admin/conclude_resignation', data),
  getExitResponses: () => api.get('/admin/exit_responses'),
};

export default api;