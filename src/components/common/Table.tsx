import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    PaginationState,
    OnChangeFn,
    useReactTable
} from "@tanstack/react-table";
import { Table } from "react-bootstrap";

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    totalCount: number;
    onRowClick?: (row: T) => void;
    isPending?: boolean;
    error?: string | null;
}

const GenericTable = <T,>({
    data,
    columns,
    pagination,
    setPagination,
    totalCount,
    onRowClick,
    isPending,
    error
}: TableProps<T>) => {
    const table = useReactTable({
        data: data ?? [],
        columns,
        rowCount: totalCount ?? 0,
        debugTable: true,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        state: {
            pagination
        }
    });

    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
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
                            {onRowClick && <th>Actions</th>}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} style={{ cursor: onRowClick ? "pointer" : undefined }}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                            {onRowClick && (
                                <td>
                                    <button onClick={() => onRowClick(row.original)}>Select</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="d-flex align-items-center gap-2 mb-3">
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
                <span>
                    Page{" "}
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
        </div>
    );
};

export default GenericTable;
