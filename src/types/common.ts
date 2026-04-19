export interface ListParameters {
    pageIndex: number;
    pageSize: number;
    [key: string]: any;
}



export interface UseQueryResult<T> {
    data: T | null;
    isPending: boolean;
    error: string | null;
}
