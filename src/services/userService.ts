import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.USERS;

const UserService = {
    changePassword: async (data: any): Promise<ApiResponse<string>> => {
        const response = await api.put(`${serviceEndpoint}/me/change-password`, data);
        return response.data;
    }
};

export default UserService;
