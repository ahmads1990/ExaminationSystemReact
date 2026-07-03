import { useState, useEffect, useMemo, useCallback } from "react";
import { Modal as BModal, Form as BForm, Button as BButton, Spinner as BSpinner, Alert as BAlert, Badge as BBadge, InputGroup as BInputGroup } from "react-bootstrap";
import { Search, X } from "lucide-react";
import Table from "../common/Table";
import QuestionService from "../../services/questionService";
import ExamService from "../../services/examService";
import { usePagination } from "../../hooks/usePagination";
import useQuery from "../../hooks/useQuery";
import { QuestionLevelInfo, RejectionReason } from "../../enums";
import { RejectedEntityDto } from "../../api/responses/exams/RejectedEntityDto";
import toast from "react-hot-toast";

interface AssignQuestionsModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    examId: number;
    alreadyAssignedIds: number[];
}

const AssignQuestionsModal = ({
    show,
    onHide,
    onSuccess,
    examId,
    alreadyAssignedIds
}: AssignQuestionsModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchVal, setSearchVal] = useState("");

    // Track selected rows (question IDs)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectedList, setRejectedList] = useState<RejectedEntityDto[]>([]);

    // Reset state on open
    useEffect(() => {
        if (show) {
            setRowSelection({});
            setSearchQuery("");
            setSearchVal("");
            setRejectedList([]);
        }
    }, [show]);

    // Pagination Hook
    const {
        pageIndex,
        pageSize,
        totalCount,
        setTotalCount,
        setPageIndex,
        setPageSize
    } = usePagination({ defaultPageSize: 10 });

    // Fetch questions from the pool (ExamID is omitted to get the general pool)
    const { data: poolData, isPending: isLoading, error, refetch } = useQuery(
        () => QuestionService.getQuestions({
            PageIndex: pageIndex,
            PageSize: pageSize,
            Body: searchQuery || undefined
        }),
        [pageIndex, pageSize, searchQuery, show]
    );

    // Sync total count
    useEffect(() => {
        if (poolData) {
            setTotalCount(poolData.totalCount);
        }
    }, [poolData, setTotalCount]);

    const handleSetPagination = useCallback((updater: any) => {
        if (typeof updater === 'function') {
            const newState = updater({ pageIndex, pageSize });
            setPageIndex(newState.pageIndex);
            if (newState.pageSize !== pageSize) {
                setPageSize(newState.pageSize);
            }
        }
    }, [pageIndex, pageSize, setPageIndex, setPageSize]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPageIndex(0);
        setSearchQuery(searchVal);
    };

    const handleClearSearch = () => {
        setSearchVal("");
        setSearchQuery("");
        setPageIndex(0);
    };

    const mapRejectionReason = (reason: RejectionReason) => {
        switch (reason) {
            case RejectionReason.NotFound:
                return "Question not found in the pool.";
            case RejectionReason.AlreadyAssigned:
                return "Question is already assigned to this exam.";
            case RejectionReason.NotAssigned:
                return "Question is not assigned to this exam.";
            default:
                return reason;
        }
    };

    const handleAssign = async () => {
        const questionIdsToAssign = Object.keys(rowSelection)
            .filter(idStr => rowSelection[idStr])
            .map(Number);

        if (questionIdsToAssign.length === 0) {
            toast.error("Please select at least one question to assign.");
            return;
        }

        setIsSubmitting(true);
        setRejectedList([]);
        try {
            const response = await ExamService.assignQuestions({
                examId,
                questionIds: questionIdsToAssign
            });

            if (response.success) {
                const rejected = response.data || [];
                if (rejected.length > 0) {
                    setRejectedList(rejected);
                    toast.error(`Partial success. Some questions could not be assigned.`);
                    refetch();
                    setRowSelection({});
                    onSuccess();
                } else {
                    toast.success("Questions assigned successfully!");
                    onSuccess();
                    onHide();
                }
            }
        } catch (err: any) {
            console.error(err);
            const errorData = err.response?.data;
            if (errorData && Array.isArray(errorData.data)) {
                setRejectedList(errorData.data);
                toast.error(errorData.message || "Failed to assign some questions.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = useMemo(() => [
        {
            id: 'select',
            header: ({ table }: any) => {
                // Only select rows that are not already assigned
                const selectableRows = table.getRowModel().rows.filter(
                    (r: any) => !alreadyAssignedIds.includes(r.original.id)
                );
                const isAllSelected = selectableRows.length > 0 && selectableRows.every((r: any) => r.getIsSelected());
                const isSomeSelected = selectableRows.some((r: any) => r.getIsSelected());

                const handleToggleAll = () => {
                    const shouldSelect = !isAllSelected;
                    const newSelection = { ...rowSelection };
                    selectableRows.forEach((r: any) => {
                        if (shouldSelect) {
                            newSelection[r.id] = true;
                        } else {
                            delete newSelection[r.id];
                        }
                    });
                    setRowSelection(newSelection);
                };

                return (
                    <div className="d-flex align-items-center justify-content-center">
                        <BForm.Check
                            type="checkbox"
                            className="m-0"
                            checked={isAllSelected}
                            ref={(el: any) => {
                                if (el) {
                                    el.indeterminate = !isAllSelected && isSomeSelected;
                                }
                            }}
                            onChange={handleToggleAll}
                            disabled={selectableRows.length === 0}
                        />
                    </div>
                );
            },
            size: 36,
            cell: ({ row }: any) => {
                const isAlreadyAssigned = alreadyAssignedIds.includes(row.original.id);
                return (
                    <div className="d-flex align-items-center justify-content-center">
                        <BForm.Check
                            type="checkbox"
                            className="m-0"
                            checked={isAlreadyAssigned || !!rowSelection[row.original.id]}
                            disabled={isAlreadyAssigned}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setRowSelection(prev => {
                                    const next = { ...prev };
                                    if (checked) {
                                        next[row.original.id] = true;
                                    } else {
                                        delete next[row.original.id];
                                    }
                                    return next;
                                });
                            }}
                        />
                    </div>
                );
            }
        },
        {
            id: 'body',
            header: 'Question Description',
            accessorKey: 'body',
            size: 500,
            cell: (info: any) => (
                <div className="text-wrap text-secondary-800 fw-normal">
                    {info.getValue()}
                </div>
            )
        },
        {
            id: 'score',
            header: 'Score',
            accessorKey: 'score',
            size: 80,
            cell: (info: any) => <span className="fw-medium text-dark">{info.getValue()} pts</span>
        },
        {
            id: 'level',
            header: 'Difficulty',
            accessorKey: 'questionLevel',
            size: 100,
            cell: (info: any) => {
                const level = info.getValue();
                const infoDetails = QuestionLevelInfo[level] || { label: String(level), color: 'secondary' };
                return <BBadge bg={infoDetails.color} className="text-capitalize">{infoDetails.label}</BBadge>;
            }
        },
        {
            id: 'status',
            header: 'Status',
            size: 100,
            cell: ({ row }: any) => {
                const isAlreadyAssigned = alreadyAssignedIds.includes(row.original.id);
                return isAlreadyAssigned ? (
                    <BBadge bg="success-subtle" className="text-success border border-success border-opacity-10 py-1">Assigned</BBadge>
                ) : (
                    <BBadge bg="light" className="text-muted border border-light-subtle py-1">Available</BBadge>
                );
            }
        }
    ], [alreadyAssignedIds, rowSelection]);

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    return (
        <BModal show={show} onHide={onHide} size="xl" backdrop="static" centered scrollable className="modal-glass">
            <BModal.Header closeButton className="border-bottom-0 pb-0">
                <BModal.Title className="fs-4 fw-bold text-dark d-flex align-items-center gap-2">
                    <span>Assign Questions to Exam</span>
                </BModal.Title>
            </BModal.Header>

            <BModal.Body className="py-4 px-4" style={{ minHeight: '400px' }}>
                {rejectedList.length > 0 && (
                    <BAlert variant="danger" onClose={() => setRejectedList([])} dismissible className="mb-4 border-danger border-opacity-20 rounded-3 shadow-sm">
                        <h6 className="fw-bold alert-heading mb-2">Some questions were rejected:</h6>
                        <ul className="mb-0 ps-3">
                            {rejectedList.map((item) => (
                                <li key={item.id} className="small">
                                    <strong>Question ID #{item.id}:</strong> {mapRejectionReason(item.reason)}
                                </li>
                            ))}
                        </ul>
                    </BAlert>
                )}

                {/* Search Bar */}
                <BForm onSubmit={handleSearchSubmit} className="mb-4">
                    <BInputGroup className="shadow-sm border rounded-3 overflow-hidden bg-white">
                        <BForm.Control
                            placeholder="Search by question text..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="border-0 shadow-none py-2 px-3"
                        />
                        {searchVal && (
                            <BButton
                                variant="link"
                                className="text-muted p-0 px-2 d-flex align-items-center border-0 bg-transparent shadow-none"
                                onClick={handleClearSearch}
                            >
                                <X size={18} />
                            </BButton>
                        )}
                        <BButton type="submit" variant="primary" className="px-4 d-flex align-items-center gap-2">
                            <Search size={16} /> Search
                        </BButton>
                    </BInputGroup>
                </BForm>

                {/* Table wrapper with custom styling */}
                <div className="border border-light-subtle rounded-4 overflow-hidden shadow-sm bg-white">
                    <Table
                        columns={columns}
                        data={poolData?.data || []}
                        totalCount={totalCount}
                        pagination={{ pageIndex, pageSize }}
                        setPagination={handleSetPagination}
                        getRowId={(row) => String(row.id)}
                        isPending={isLoading}
                        error={error}
                    />
                </div>
            </BModal.Body>

            <BModal.Footer className="border-top-0 pt-0 px-4 pb-4">
                <div className="me-auto text-muted small fw-medium">
                    {selectedCount > 0 && `${selectedCount} question(s) selected`}
                </div>
                <BButton variant="secondary" onClick={onHide} disabled={isSubmitting} className="rounded-3">
                    Cancel
                </BButton>
                <BButton
                    variant="primary"
                    onClick={handleAssign}
                    disabled={isSubmitting || selectedCount === 0}
                    className="px-4 rounded-3 d-flex align-items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <BSpinner animation="border" size="sm" /> Assigning...
                        </>
                    ) : (
                        `Assign Selected (${selectedCount})`
                    )}
                </BButton>
            </BModal.Footer>
        </BModal>
    );
};

export default AssignQuestionsModal;
