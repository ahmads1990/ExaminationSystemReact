import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ApiResponse } from "../api/responses/ApiResponse";
import { ChangePasswordRequest } from "../api/requests/AuthRequests";

const serviceEndpoint = ENDPOINTS.USERS;

const UserService = {
    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<string>> => {
        const response = await api.put(`${serviceEndpoint}/me/change-password`, data);
        return response.data;
    }
};

export default UserService;
