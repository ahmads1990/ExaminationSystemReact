export interface GetCoursesParams {
    Title?: string;
    PageIndex: number;
    PageSize: number;
    OrderBy?: string;
    SortDirection?: string;
}

export interface AddCourseRequest {
    title: string;
    description: string;
    creditHours: number;
    maxEnrollment: number;
}

export interface UpdateCourseRequest {
    id: number;
    title: string;
    description: string;
    creditHours: number;
    maxEnrollment: number;
}
