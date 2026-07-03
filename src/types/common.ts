export interface ListParameters {
    pageIndex: number;
    pageSize: number;
    [key: string]: string | number | boolean | undefined;
}



export interface UseQueryResult<T> {
    data: T | null;
    isPending: boolean;
    error: string | null;
    refetch: () => void;
}
