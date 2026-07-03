import { ExamType, ExamStatus } from "../../../enums"; // ensure ExamStatus is imported

export interface ExamDto
{
    id: number;
    title: string;
    courseName: string;
    courseId?: number;
    examType: ExamType;
    examStatus: ExamStatus;
    maxDurationInMinutes: number;
    totalGrade: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions?: boolean;
    deadlineDate?: string;
    createdDate?: string;
}
