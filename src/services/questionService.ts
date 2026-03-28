import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ListParameters, PaginatedResponse } from "../types/common";
import { Question } from "../types/entities";

const serviceEndpoint = ENDPOINTS.QUESTIONS;

const QuestionService = {
    getAllQuestions: async (params: ListParameters | object = {}): Promise<PaginatedResponse<Question>> =>
    {
        const questions = await api.get(serviceEndpoint, {
            params
        });

        return questions.data;
    },
    getQuestionById: async (id: number): Promise<Question> =>
    {
        const response = await api.get<Question>(`${serviceEndpoint}/${id}`);

        return response.data;
    }
};

export default QuestionService;
