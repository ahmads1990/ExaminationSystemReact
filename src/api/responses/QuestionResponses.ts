import { QuestionLevel } from "../../enums";

export interface ChoiceDto {
    id: number;
    body: string;
    isCorrect: boolean;
}

export interface QuestionDto {
    id: number;
    examId: number;
    body: string;
    score: number;
    questionLevel: QuestionLevel;
    choices: ChoiceDto[];
}
