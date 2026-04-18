import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { GetExamsParams, AddExamRequest, UpdateExamRequest, PublishExamRequest } from "../api/requests/ExamRequests";
import { ExamDto } from "../api/responses/exams/ExamDto";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import { ApiResponse } from "../api/responses/ApiResponse";

const serviceEndpoint = ENDPOINTS.EXAMS;

const ExamService = {
    getExams: async (params: GetExamsParams): Promise<PaginatedResponse<ExamDto>> => {
        const response = await api.get(serviceEndpoint, { params });
        return response.data;
    },
    getExamById: async (id: number): Promise<ApiResponse<ExamDto>> => {
        const response = await api.get<ApiResponse<ExamDto>>(`${serviceEndpoint}/${id}`);
        return response.data;
    },
    createExam: async (data: AddExamRequest): Promise<ApiResponse<number>> => {
        const response = await api.post<ApiResponse<number>>(serviceEndpoint, data);
        return response.data;
    },
    updateExam: async (data: UpdateExamRequest): Promise<ApiResponse<string>> => {
        const response = await api.put<ApiResponse<string>>(serviceEndpoint, data);
        return response.data;
    },
    deleteExam: async (id: number): Promise<ApiResponse<string>> => {
        const response = await api.delete<ApiResponse<string>>(`${serviceEndpoint}/${id}`);
        return response.data;
    },
    publishExam: async (data: PublishExamRequest): Promise<ApiResponse<string>> => {
        const response = await api.patch<ApiResponse<string>>(`${serviceEndpoint}/publish`, data);
        return response.data;
    },
    unpublishExam: async (id: number): Promise<ApiResponse<string>> => {
        const response = await api.patch<ApiResponse<string>>(`${serviceEndpoint}/${id}/unpublish`);
        return response.data;
    },
};

export default ExamService;
