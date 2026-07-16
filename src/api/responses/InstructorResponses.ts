import { ExamAttemptStatus, ExamType } from "../../enums";

export interface CourseStatsDto {
    courseId: number;
    courseName: string;
    studentCount: number;
    examsCount: number;
    maxEnrollment: number;
}

export interface AttemptSummaryDto {
    studentId: number;
    studentName: string;
    courseName: string;
    examTitle: string;
    examType: ExamType;
    grade: number;
    maxGrade: number;
    status: ExamAttemptStatus;
    completionTime?: string;
    createDate: string;
}
