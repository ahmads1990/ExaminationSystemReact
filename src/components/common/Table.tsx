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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import SkeletonTable from "./SkeletonTable";

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    totalCount: number;
    onRowClick?: (row: T) => void;
    isPending?: boolean;
    error?: string | null;
    showPaginationDetails?: boolean;
    rowSelection?: Record<string, boolean>;
    setRowSelection?: OnChangeFn<Record<string, boolean>>;
    getRowId?: (row: T) => string;
}

const GenericTable = <T,>({
    data,
    columns,
    pagination,
    setPagination,
    totalCount,
    onRowClick,
    isPending,
    error,
    showPaginationDetails = false,
    rowSelection,
    setRowSelection,
    getRowId
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
        getRowId,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination,
            rowSelection: rowSelection ?? {},
        }
    });

    if (isPending) return <SkeletonTable rows={pagination.pageSize || 5} cols={columns.length} />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const isSelect = header.column.id === 'select';
                                const isActions = header.column.id === 'actions';
                                const style = {
                                    width: header.column.columnDef.size,
                                    verticalAlign: 'middle' as const,
                                    ...(isSelect ? { paddingLeft: '6px', paddingRight: '6px', width: '36px', textAlign: 'center' as const } : {}),
                                    ...(isActions ? { textAlign: 'center' as const } : {})
                                };
                                return (
                                    <th key={header.id} style={style}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                );
                            })}
                            {onRowClick && <th>Actions</th>}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} style={{ cursor: onRowClick ? "pointer" : undefined }}>
                            {row.getVisibleCells().map((cell) => {
                                const isSelect = cell.column.id === 'select';
                                const isActions = cell.column.id === 'actions';
                                const style = {
                                    width: cell.column.columnDef.size,
                                    verticalAlign: 'middle' as const,
                                    ...(isSelect ? { paddingLeft: '6px', paddingRight: '6px', width: '36px', textAlign: 'center' as const } : {}),
                                    ...(isActions ? { textAlign: 'center' as const } : {})
                                };
                                return (
                                    <td key={cell.id} style={style}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                );
                            })}
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 px-4 py-3 border-top bg-light-subtle rounded-bottom-4">
                <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.875rem' }}>
                    <span>
                        Showing <strong>{table.getRowModel().rows.length}</strong> of{" "}
                        <strong>{totalCount.toLocaleString()}</strong> results
                    </span>
                    <span className="text-secondary-300">|</span>
                    <span>
                        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                        <strong>{table.getPageCount().toLocaleString()}</strong>
                    </span>
                    <span className="text-secondary-300">|</span>
                    <div className="d-flex align-items-center gap-2">
                        <span>Show</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="form-select form-select-sm py-1 px-2"
                            style={{ width: '80px', fontSize: '0.85rem' }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-1">
                        <button
                            className="btn btn-outline-secondary btn-sm p-0 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                            title="First Page"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm p-0 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            title="Previous Page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm p-0 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            title="Next Page"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm p-0 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                            title="Last Page"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>

                    <span className="text-secondary-300">|</span>

                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                        <span className="text-muted">Go to page:</span>
                        <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="form-control form-control-sm py-1 px-2"
                            style={{ width: '60px', textAlign: 'center', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
            </div>

            {showPaginationDetails && (
                <>
                    <div className="text-muted mb-2">
                        Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()}{" "}
                        Rows
                    </div>
                    <pre className="bg-light p-2 rounded text-xs">{JSON.stringify(table.getState().pagination, null, 2)}</pre>
                </>
            )}
        </div>
    );
};

export default GenericTable;
