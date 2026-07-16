import { Pagination } from "react-bootstrap";

interface AppPaginationProps {
    pageIndex: number; // 0-indexed
    totalPages: number;
    onPageChange: (page: number) => void;
}

const AppPagination = ({ pageIndex, totalPages, onPageChange }: AppPaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-center mt-4 mb-5">
            <Pagination>
                <Pagination.Prev onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0} />
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item key={`page-${i}`} active={i === pageIndex} onClick={() => onPageChange(i)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex === totalPages - 1} />
            </Pagination>
        </div>
    );
};

export default AppPagination;
