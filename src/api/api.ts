import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor - Add JWT token to headers
api.interceptors.request.use(
    (config) =>
    {
        const token = getToken();
        if (token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>
    {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) =>
    {
        if (error.response?.status === 401)
        {
            // Backend returns 401 for all permission issues (no 403 support yet)
            // Redirect to main page instead of logging out
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
