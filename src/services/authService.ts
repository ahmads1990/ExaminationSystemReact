import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { LoginRequest, RegisterInstructorRequest, RegisterStudentRequest } from "../api/requests/AuthRequests";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.AUTH;
const endpoints = {
    registerStudent: serviceEndpoint + "/register/student",
    registerInstructor: serviceEndpoint + "/register/instructor",
    login: serviceEndpoint + "/login",
    logout: serviceEndpoint + "/logout"
}

const AuthService = {
    registerStudent: async (request: RegisterStudentRequest): Promise<ApiResponse<number>> =>
    {
        const response = await api.post(endpoints.registerStudent, request);
        return response.data;
    },
    registerInstructor: async (request: RegisterInstructorRequest): Promise<ApiResponse<number>> =>
    {
        const response = await api.post(endpoints.registerInstructor, request);
        return response.data;
    },
    login: async (request: LoginRequest): Promise<ApiResponse<any>> =>
    {
        const response = await api.post(endpoints.login, request);
        return response.data;
    },
    logout: async (): Promise<ApiResponse<string>> =>
    {
        const response = await api.post(endpoints.logout);
        return response.data;
    },
    resendVerification: async (userId: number): Promise<ApiResponse<string>> =>
    {
        const response = await api.post(`${serviceEndpoint}/resend-verification?userId=${userId}`);
        return response.data;
    },
    verifyEmail: async (email: string, otp: string): Promise<ApiResponse<string>> =>
    {
        const response = await api.post(`${serviceEndpoint}/verify-email`, { email, otp });
        return response.data;
    }
}

export default AuthService;