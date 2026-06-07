import { QuestionLevel } from "../../enums";

export interface GetQuestionsParams {
    examId?: number;
    pageIndex?: number;
    pageSize?: number;
    [key: string]: string | number | boolean | undefined;
}

export interface ChoiceRequest {
    body: string;
    isCorrect: boolean;
}

export interface CreateQuestionRequest {
    examId: number;
    body: string;
    score: number;
    questionLevel: QuestionLevel;
    choices: ChoiceRequest[];
}

export interface UpdateQuestionRequest {
    id: number;
    examId: number;
    body: string;
    score: number;
    questionLevel: QuestionLevel;
    choices: ChoiceRequest[];
}
