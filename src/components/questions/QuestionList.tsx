import { useEffect, useState } from "react";
import api from "../../api/api";
import { ENDPOINTS } from "../../api/endpoints";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import { Button, Modal, Table } from "react-bootstrap";

export interface Choice {
    id: number;
    body: string;
}

export interface Question {
    id: number;
    body: string;
    score: number;
    questionLevel: number;
    answerOrder: number;
    choices: Choice[];
}
const columnHelper = createColumnHelper<Question>();

const columns = [
    columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("body", {
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("score", {
        cell: (info) => info.getValue(),
    }),
];

type Props = unknown;

const QuestionList = (props: Props) => {
    const [data, setData] = useState<Question[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState<number>(0);

    const table = useReactTable({
        data,
        columns,
        rowCount,
        debugTable: true,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination,
        },
    });
    const [selectedRow, setSelectedRow] = useState<Question | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleRowClick = (row: Question) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow(null);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await api.get(ENDPOINTS.QUESTIONS + "/list", {
                params: {
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                },
            });

            console.log("data fetched");
            console.log(response);

            console.log("data state");
            console.log(response.data.data);

            setData(response.data.data);
            setRowCount(response.data.totalCount);
        };

        fetchQuestions();
        return () => {};
    }, [pagination]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Questions</h2>
                <div>
                    <button className="btn btn-primary me-2">Add New</button>
                    <button className="btn btn-secondary">Export</button>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} style={{ cursor: "pointer" }}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                            <td>
                                <button onClick={() => handleRowClick(row.original)}>click me </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()}{" "}
                Rows
            </div>
            <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Question Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRow ? (
                        <>
                            <p>
                                <strong>ID:</strong> {selectedRow.id}
                            </p>
                            <p>
                                <strong>Body:</strong> {selectedRow.body}
                            </p>
                            <p>
                                <strong>Score:</strong> {selectedRow.score}
                            </p>
                        </>
                    ) : (
                        <p>No data available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default QuestionList;
