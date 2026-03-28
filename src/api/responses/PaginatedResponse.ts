export interface PaginatedResponse<T> {
    totalCount: number;
    data: T[];
}
