import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    // Return standard data format of TransformInterceptor from backend
    return response.data;
  },
  (error) => {
    console.error('[API Error]: ', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
