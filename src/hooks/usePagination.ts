import { useCallback, useState } from "react";

interface UsePaginationOptions {
    defaultPageSize?: number;
    defaultPageIndex?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
    const { defaultPageSize = 10, defaultPageIndex = 0 } = options;
    const [pageIndex, setPageIndex] = useState(defaultPageIndex);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = useCallback(
        (newIndex: number) => {
            if (newIndex >= 0 && newIndex < totalPages) {
                setPageIndex(newIndex);
            }
        },
        [totalPages]
    );

    const resetPage = useCallback(() => {
        setPageIndex(defaultPageIndex);
    }, [defaultPageIndex]);

    return {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
        setPageIndex,
        setPageSize,
        setTotalCount,
        handlePageChange,
        resetPage
    };
};
