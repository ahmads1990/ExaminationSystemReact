import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { PaginatedResponse } from "../api/responses/PaginatedResponse";
import { GetQuestionsParams, CreateQuestionRequest, UpdateQuestionRequest } from "../api/requests/QuestionRequests";
import { QuestionDto } from "../api/responses/QuestionResponses";

const serviceEndpoint = ENDPOINTS.QUESTIONS;

const QuestionService = {
    getQuestions: async (params: GetQuestionsParams): Promise<PaginatedResponse<QuestionDto>> =>
    {
        const response = await api.get(serviceEndpoint, { params });
        return response.data;
    },
    
    getQuestionById: async (id: number): Promise<QuestionDto> =>
    {
        const response = await api.get<QuestionDto>(`${serviceEndpoint}/${id}`);
        return response.data;
    },
    
    createQuestion: async (data: CreateQuestionRequest): Promise<number> =>
    {
        const response = await api.post(serviceEndpoint, data);
        return response.data;
    },
    
    updateQuestion: async (data: UpdateQuestionRequest): Promise<void> =>
    {
        await api.put(serviceEndpoint, data);
    },
    
    deleteQuestions: async (ids: number[]): Promise<void> =>
    {
        await api.delete(serviceEndpoint, { data: ids });
    }
};

export default QuestionService;
