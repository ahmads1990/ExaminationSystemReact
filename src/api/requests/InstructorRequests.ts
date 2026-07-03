import { SortingDirection } from "../../enums";

export interface GetInstructorCourseStatsParams {
    CourseName?: string;
    PageIndex: number;
    PageSize: number;
    OrderBy?: string;
    SortDirection?: SortingDirection;
}
