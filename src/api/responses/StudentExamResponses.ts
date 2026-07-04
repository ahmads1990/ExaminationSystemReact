import { ExamType } from "../../enums";

export interface AvailableExamDto {
    examId: number;
    courseName: string;
    title: string;
    examType: ExamType;
    deadlineDate: string;
    maxDurationInMinutes: number;
    maxAttempts: number;
    attemptsTaken: number;
}

export interface ChoiceDto {
    choiceId: number;
    body: string;
}

export interface ExamQuestionDto {
    questionId: number;
    body: string;
    choices: ChoiceDto[];
}

export interface AttemptResultDto {
    currentGrade: number;
    maxGrade: number;
    isPassed: boolean;
    completionTime: string;
}
