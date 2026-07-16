import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import {
    AddExamRequest,
    AssignQuestionsRequest,
    GetExamsParams,
    PublishExamRequest,
    UpdateExamRequest
} from "../api/requests/ExamRequests";
import { ApiResponse } from "../api/responses/ApiResponse";
import { ExamDto } from "../api/responses/exams/ExamDto";
import { RejectedEntityDto } from "../api/responses/exams/RejectedEntityDto";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";

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
    createExam: async (data: AddExamRequest, config?: any): Promise<ApiResponse<number>> => {
        const response = await api.post<ApiResponse<number>>(serviceEndpoint, data, config);
        return response.data;
    },
    updateExam: async (data: UpdateExamRequest, config?: any): Promise<ApiResponse<string>> => {
        const response = await api.put<ApiResponse<string>>(serviceEndpoint, data, config);
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
    assignQuestions: async (data: AssignQuestionsRequest): Promise<ApiResponse<RejectedEntityDto[]>> => {
        const response = await api.patch<ApiResponse<RejectedEntityDto[]>>(`${serviceEndpoint}/assign-questions`, data);
        return response.data;
    },
    unassignQuestions: async (data: AssignQuestionsRequest): Promise<ApiResponse<RejectedEntityDto[]>> => {
        const response = await api.patch<ApiResponse<RejectedEntityDto[]>>(
            `${serviceEndpoint}/unassign-questions`,
            data
        );
        return response.data;
    }
};

export default ExamService;
