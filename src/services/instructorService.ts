import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ApiResponse } from "../api/responses/ApiResponse";
import { CourseStatsDto } from "../api/responses/InstructorResponses";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import { GetInstructorCourseStatsParams } from "../api/requests/InstructorRequests";

const serviceEndpoint = ENDPOINTS.INSTRUCTOR;

const InstructorService = {
    getInstructorCourseStats: async (params?: GetInstructorCourseStatsParams): Promise<ApiResponse<PaginatedResponse<CourseStatsDto>>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<CourseStatsDto>>>(`${serviceEndpoint}/courses`, { params });
        return response.data;
    }
};

export default InstructorService;
