import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { StudentEnrollInCourseRequest } from "../api/requests/StudentCourseRequests";
import { StudentEnrollmentDto } from "../api/responses/StudentCourseResponses";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.STUDENT_COURSES;

const StudentCourseService = {
    getMyEnrollments: async (params?: { CourseTitle?: string; OnlyEnrolled?: boolean }): Promise<PaginatedResponse<StudentEnrollmentDto>> => {
        const response = await api.get<PaginatedResponse<StudentEnrollmentDto>>(`${serviceEndpoint}/me/enrollments`, { params });
        return response.data;
    },

    enrollInCourse: async (request: StudentEnrollInCourseRequest): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>(`${serviceEndpoint}/enroll`, request);
        return response.data;
    }
};

export default StudentCourseService;
