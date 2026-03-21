export interface ListParameters {
    pageIndex: number;
    pageSize: number;
    [key: string]: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}

export interface UseQueryResult<T> {
    data: T | null;
    isPending: boolean;
    error: string | null;
}
