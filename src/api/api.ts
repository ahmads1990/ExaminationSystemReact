import axios from "axios";
import toast from "react-hot-toast";
import { User } from "../types/auth";
import { getErrorMessage } from "../utils/errorMessages";
import {
    clearAuth,
    getExamToken,
    getRefreshToken,
    getToken,
    getUser,
    saveRefreshToken,
    saveToken
} from "../utils/storage";
import { ENDPOINTS } from "./endpoints";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor - Add JWT token to headers
api.interceptors.request.use(
    (config) => {
        const examToken = getExamToken();
        const isExamTakingEndpoint =
            config.url?.includes("/StudentExams/questions") ||
            config.url?.includes("/StudentExams/answer") ||
            config.url?.includes("/StudentExams/submit-attempt");

        const tenantId = localStorage.getItem("tenantId") || "1";
        config.headers["X-Tenant-Id"] = tenantId;

        if (examToken && isExamTakingEndpoint) {
            config.headers.Authorization = `Bearer ${examToken}`;
        } else {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401 Unauthorized and Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshTokenStr = getRefreshToken();
            const user = getUser<User>();

            if (refreshTokenStr && user) {
                try {
                    const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.AUTH}/refresh-token`;
                    const refreshResponse = await axios.post(refreshUrl, {
                        userId: user.uid,
                        refreshToken: refreshTokenStr
                    });

                    if (refreshResponse.data && refreshResponse.data.success && refreshResponse.data.data) {
                        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

                        saveToken(accessToken);
                        saveRefreshToken(newRefreshToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }

            // Backend returns 401 for all permission issues (no 403 support yet)
            // Or if refresh token fails / missing
            clearAuth();
            window.location.href = "/login";
        }

        // Global Error Handling (skip 401s as they are handled above)
        if (error.response && error.response.status !== 401) {
            const errorCode = error.response.data?.errorCode;
            if (errorCode && !originalRequest._skipGlobalError) {
                toast.error(getErrorMessage(errorCode));
            } else if (error.response.status >= 500) {
                toast.error("A server error occurred. Please try again later.");
            } else if (error.response.data?.message && !originalRequest._skipGlobalError) {
                toast.error(error.response.data.message);
            }
        } else if (error.request && !error.response) {
            // Network error
            if (error.code !== "ECONNABORTED" && error.message !== "Network Error") {
                toast.error("Network error. Please check your connection.");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
