import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { LoginRequest, RegisterInstructorRequest, RegisterStudentRequest } from "../api/requests/AuthRequests";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.AUTH;
const endpoints = {
    registerStudent: serviceEndpoint + "/RegisterStudent",
    registerInstructor: serviceEndpoint + "/RegisterInstructor",
    login: serviceEndpoint + "/login"
}

const AuthService = {
    registerStudent: async (request: RegisterStudentRequest): Promise<ApiResponse<number>> =>
    {
        const response = await api.post(endpoints.registerStudent, {
            request
        });
        console.log(response);
        debugger;
        return response.data;
    },
    registerInstructor: async (request: RegisterInstructorRequest): Promise<ApiResponse<number>> =>
    {
        const response = await api.post(endpoints.registerInstructor, {
            request
        });
        console.log(response);
        debugger;
        return response.data;
    },
    login: async (request: LoginRequest): Promise<ApiResponse<string>> =>
    {
        const response = await api.post(endpoints.login, {
            request
        });
        console.log(response);
        debugger;
        return response.data;
    }
}

export default AuthService;