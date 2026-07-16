import { ExamAttemptStatus, SortingDirection } from "../../enums";

export interface GetInstructorCourseStatsParams {
    CourseName?: string;
    PageIndex: number;
    PageSize: number;
    OrderBy?: string;
    SortDirection?: SortingDirection;
}

export interface GetExamSubmissionsParams {
    StudentName?: string;
    Status?: ExamAttemptStatus | string;
    PageIndex: number;
    PageSize: number;
    OrderBy?: string;
    SortDirection?: SortingDirection;
}
