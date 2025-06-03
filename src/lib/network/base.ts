import axios from 'axios';
import { toast } from "@/hooks/use-toast"

export const base = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Tambahkan interceptor untuk sisipkan token tiap request
base.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor Response (untuk token expired)
base.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast({
        title: "Session expired",
        description: "Please login again.",
        variant: "destructive",
      })

      localStorage.removeItem('user')
      localStorage.removeItem('token')

      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }

    return Promise.reject(error)
  }
)