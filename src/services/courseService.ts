import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { GetCoursesParams, AddCourseRequest, UpdateCourseRequest } from "../api/requests/CourseRequests";
import { CourseDto } from "../api/responses/courses/CourseDto";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.COURSES;

const CourseService = {
    getCourses: async (params: GetCoursesParams): Promise<PaginatedResponse<CourseDto>> => {
        const response = await api.get(serviceEndpoint, { params });
        return response.data;
    },
    
    // Future placeholders for implementation
    createCourse: async (request: AddCourseRequest): Promise<ApiResponse<number>> => {
        const response = await api.post(serviceEndpoint, request);
        return response.data;
    },

    updateCourse: async (request: UpdateCourseRequest): Promise<ApiResponse<string>> => {
        const response = await api.put(serviceEndpoint, request);
        return response.data;
    },

    deleteCourse: async (courseId: number): Promise<ApiResponse<string>> => {
        const response = await api.delete(`${serviceEndpoint}/${courseId}`);
        return response.data;
    }
};

export default CourseService;
