import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ApiResponse } from "../api/responses/ApiResponse";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import {
    AttemptResultDto,
    AvailableExamDto,
    ExamQuestionDto,
    StudentAttemptSummaryDto
} from "../api/responses/StudentExamResponses";

const serviceEndpoint = ENDPOINTS.STUDENT_EXAMS;

const StudentExamService = {
    getAvailableExams: async (): Promise<ApiResponse<AvailableExamDto[]>> => {
        const response = await api.get<ApiResponse<AvailableExamDto[]>>(`${serviceEndpoint}/available`);
        return response.data;
    },

    startExam: async (examId: number): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>(`${serviceEndpoint}/start`, { examId }, {
            _skipGlobalError: true
        } as any);
        return response.data;
    },

    getExamQuestions: async (): Promise<ApiResponse<ExamQuestionDto[]>> => {
        const response = await api.get<ApiResponse<ExamQuestionDto[]>>(`${serviceEndpoint}/questions`);
        return response.data;
    },

    submitAnswer: async (questionId: number, choiceId: number): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>(`${serviceEndpoint}/answer`, {
            questionId,
            choiceId
        });
        return response.data;
    },

    submitAttempt: async (): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>(`${serviceEndpoint}/submit-attempt`);
        return response.data;
    },

    getExamResult: async (attemptId: number): Promise<ApiResponse<AttemptResultDto>> => {
        const response = await api.get<ApiResponse<AttemptResultDto>>(`${serviceEndpoint}/result`, {
            params: { attemptId }
        });
        return response.data;
    },

    getExamHistory: async (params?: {
        PageIndex?: number;
        PageSize?: number;
    }): Promise<PaginatedResponse<StudentAttemptSummaryDto>> => {
        const response = await api.get<PaginatedResponse<StudentAttemptSummaryDto>>(`${serviceEndpoint}/history`, {
            params
        });
        return response.data;
    }
};

export default StudentExamService;
