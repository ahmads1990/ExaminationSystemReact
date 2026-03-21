import { QuestionLevel } from "./enums";

export interface Choice {
    id: number;
    body: string;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    body: string;
    score: number;
    questionLevel: QuestionLevel;
    choices: Choice[];
}
