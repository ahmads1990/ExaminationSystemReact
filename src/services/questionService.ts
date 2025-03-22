import api from "../api/api";
import { ENDPOINTS } from "../api/endpoints";
import { ListParameters, PaginatedResponse } from "../types/common";
import { Question } from "../types/entities";

const serviceEndpoint = ENDPOINTS.QUESTIONS;

const QuestionService = {
    getAllQuestions: async (params: ListParameters | object = {}): Promise<PaginatedResponse<Question>> => {
        const questions = await api.get(serviceEndpoint + "/list", {
            params,
        });

        console.log("questions");
        console.log(questions);
        return questions.data;
    },
    getQuestionById: async (id: number): Promise<Question> => {
        const response = await api.get<Question>(`${serviceEndpoint}/${id}`);

        console.log("question");
        console.log(response);
        return response.data;
    },
};

export default QuestionService;
