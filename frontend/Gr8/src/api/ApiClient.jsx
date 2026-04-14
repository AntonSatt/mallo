import axios from 'axios';
import { notifyAuthExpired } from '../services/AuthServices';

const ApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to attach the token
ApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401
ApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token"); // remove invalid token
            notifyAuthExpired();
        }
        return Promise.reject(error);
    }
);

export default ApiClient;