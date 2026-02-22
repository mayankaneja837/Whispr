import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { logger } from './logger';
import { ApiResponse } from '../types/ApiResponse';

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor (for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Success response - pass through
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle error
    handleApiError(error);
    return Promise.reject(error);
  }
);

// Error handler function
function handleApiError(error: AxiosError<ApiResponse>) {
  // Log error
  logger.error('API Error:', error);

  // Extract error message
  const errorMessage = getErrorMessage(error);

  // Show toast notification
  toast.error('Error', {
    description: errorMessage,
    duration: 5000,
  });
}

// Extract user-friendly error message
function getErrorMessage(error: AxiosError<ApiResponse>): string {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    return 'Unable to connect to server. Please try again later.';
  }

  const { status, data } = error.response;

  // Use message from API response if available
  if (data?.message) {
    return data.message;
  }

  // Fallback to status-based messages
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'You are not authorized. Please sign in.';
    case 403:
      return 'User is not accepting messages.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 422:
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return `An error occurred (${status}). Please try again.`;
  }
}

export default apiClient;