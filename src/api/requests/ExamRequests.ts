import { ExamType, ExamStatus, SortingDirection } from "../../enums";

export interface GetExamsParams {
    Title?: string;
    ExamType?: ExamType;
    ExamStatus?: ExamStatus;
    CourseId?: number;
    InstructorId?: number;
    DeadlineFrom?: string;
    DeadlineTo?: string;
    PageIndex: number;
    PageSize: number;
    OrderBy?: string;
    SortDirection?: SortingDirection;
}

export interface AddExamRequest {
    courseID: number;
    title: string;
    examType: ExamType;
    maxDurationInMinutes: number;
    totalGrade: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showResultsImmediately: boolean;
    deadlineDate: string | null;
}

export interface UpdateExamRequest extends AddExamRequest {
    id: number;
}

export interface PublishExamRequest {
    id: number;
    publishDate?: string | null;
}
