import axios from 'axios';

const ApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 
        "Content-Type": "application/json" 
    }
});

export default ApiClient;