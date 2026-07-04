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
