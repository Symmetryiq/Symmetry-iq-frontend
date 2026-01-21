import { getClerkInstance } from '@clerk/clerk-expo';
import axios from 'axios';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://symmetry-api.vercel.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
apiClient.interceptors.request.use(
  async (config) => {
    const clerk = getClerkInstance();

    const token = await clerk.session?.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error object for frontend consumption
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 0;

    if (error.response) {
      // Server responded with error status
      statusCode = error.response.status;
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (${statusCode})`;

      // Handle 401 Unauthorized globally if needed (e.g. redirect to login)
      // if (statusCode === 401) { ... }
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      errorMessage = error.message || 'Unknown error occurred';
    }

    // Return a standardized error object or throw a custom error
    // For now, we update the error message and reject so callsites can display it
    error.message = errorMessage;
    return Promise.reject(error);
  },
);

export default apiClient;
