import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { GetExamSubmissionsParams, GetInstructorCourseStatsParams } from "../api/requests/InstructorRequests";
import { ApiResponse } from "../api/responses/ApiResponse";
import { AttemptSummaryDto, CourseStatsDto } from "../api/responses/InstructorResponses";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";

const serviceEndpoint = ENDPOINTS.INSTRUCTOR;

const InstructorService = {
    getInstructorCourseStats: async (
        params?: GetInstructorCourseStatsParams
    ): Promise<ApiResponse<PaginatedResponse<CourseStatsDto>>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<CourseStatsDto>>>(`${serviceEndpoint}/courses`, {
            params
        });
        return response.data;
    },

    getExamSubmissions: async (
        examId: number,
        params?: GetExamSubmissionsParams
    ): Promise<ApiResponse<PaginatedResponse<AttemptSummaryDto>>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<AttemptSummaryDto>>>(
            `${serviceEndpoint}/exams/${examId}/submissions`,
            { params }
        );
        return response.data;
    }
};

export default InstructorService;
