import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { AvailableExamDto, ExamQuestionDto, AttemptResultDto, StudentAttemptSummaryDto } from "../api/responses/StudentExamResponses";
import { ApiResponse } from "../api/responses/ApiResponse";

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

    submitAnswer: async (questionId: number, selectedChoiceId: number): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>(`${serviceEndpoint}/answer`, {
            questionId,
            selectedChoiceId
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

    getExamHistory: async (): Promise<ApiResponse<StudentAttemptSummaryDto[]>> => {
        const response = await api.get<ApiResponse<StudentAttemptSummaryDto[]>>(`${serviceEndpoint}/history`);
        return response.data;
    }
};

export default StudentExamService;
