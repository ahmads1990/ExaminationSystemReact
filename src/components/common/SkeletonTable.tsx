import { Table } from "react-bootstrap";

interface SkeletonTableProps {
    rows?: number;
    cols?: number;
}

export const SkeletonTable = ({ rows = 5, cols = 4 }: SkeletonTableProps) => {
    return (
        <div className="skeleton-pulse">
            <Table striped bordered hover className="mb-0">
                <thead>
                    <tr>
                        {[...Array(cols)].map((_, i) => (
                            <th key={i} className="py-3 px-4 border-0">
                                <div className="skeleton-line" style={{ width: "60%", height: "1rem" }} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rows)].map((_, r) => (
                        <tr key={r}>
                            {[...Array(cols)].map((_, c) => (
                                <td key={c} className="py-3.5 px-4 border-bottom border-light">
                                    <div className="skeleton-line" style={{ width: c === 0 ? "40%" : "75%", height: "0.875rem" }} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default SkeletonTable;
