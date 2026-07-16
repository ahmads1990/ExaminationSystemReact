import { ArrowLeft, Edit2, Plus, Trash2, Unlink } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import ConfirmActionDialog from "../../components/common/ConfirmActionDialog";
import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";
import Table from "../../components/common/Table";
import AssignQuestionsModal from "../../components/instructor/AssignQuestionsModal";
import SaveQuestionModal from "../../components/instructor/questions/SaveQuestionModal";
import { QuestionLevelInfo } from "../../enums";
import { usePagination } from "../../hooks/usePagination";
import useQuery from "../../hooks/useQuery";
import ExamService from "../../services/examService";
import QuestionService from "../../services/questionService";

const ExamQuestionsPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const examIdNum = Number(examId);

    // Trigger for refetching data
    const [refreshTick, setRefreshTick] = useState(0);
    const refreshData = () => setRefreshTick((t) => t + 1);

    // Fetch the exam header
    const { data: examInfo, isPending: isLoadingExam } = useQuery(
        () => ExamService.getExamById(examIdNum),
        [examIdNum]
    );

    // Pagination Hook
    const { pageIndex, pageSize, totalCount, setTotalCount, setPageIndex } = usePagination({ defaultPageSize: 10 });

    // Fetch Questions
    const {
        data,
        isPending: isLoading,
        error
    } = useQuery(
        () =>
            QuestionService.getQuestions({
                ExamID: examIdNum,
                PageIndex: pageIndex,
                PageSize: pageSize
            }),
        [examIdNum, pageIndex, pageSize, refreshTick]
    );

    // Sync total count
    useEffect(() => {
        if (data) {
            setTotalCount(data.totalCount);
        }
    }, [data, setTotalCount]);

    // Format for our common Table pagination
    const handleSetPagination = useCallback(
        (updater: any) => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
            }
        },
        [pageIndex, pageSize, setPageIndex]
    );

    // Modals State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<any | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Assign / Unassign States
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showSingleUnassignDialog, setShowSingleUnassignDialog] = useState(false);
    const [questionIdToUnassign, setQuestionIdToUnassign] = useState<number | null>(null);
    const [showBulkUnassignDialog, setShowBulkUnassignDialog] = useState(false);
    const [isUnassigning, setIsUnassigning] = useState(false);

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const alreadyAssignedIds = useMemo(() => {
        return (data?.data || []).map((q: any) => q.id);
    }, [data]);

    const isExamPublished = examInfo?.data?.examStatus === "Published";

    const handleDeleteSelected = async () => {
        const idsToDelete = Object.keys(rowSelection)
            .filter((key) => rowSelection[key])
            .map(Number);

        if (idsToDelete.length === 0) return;

        setIsDeleting(true);
        try {
            await QuestionService.deleteQuestions(idsToDelete);
            toast.success("Questions deleted successfully");
            setRowSelection({});
            setShowDeleteDialog(false);
            refreshData();
        } catch (err: any) {
            console.error(err);
            setShowDeleteDialog(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUnassignSingle = async () => {
        if (questionIdToUnassign === null) return;
        setIsUnassigning(true);
        try {
            const res = await ExamService.unassignQuestions({
                examId: examIdNum,
                questionIds: [questionIdToUnassign]
            });
            if (res.success) {
                const rejected = res.data || [];
                if (rejected.length > 0) {
                    toast.error(`Could not unassign question: ${rejected[0].reason}`);
                } else {
                    toast.success("Question unassigned successfully.");
                    refreshData();
                }
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Failed to unassign question.";
            toast.error(errorMsg);
        } finally {
            setIsUnassigning(false);
            setShowSingleUnassignDialog(false);
            setQuestionIdToUnassign(null);
        }
    };

    const handleUnassignSelected = async () => {
        const idsToUnassign = Object.keys(rowSelection)
            .filter((key) => rowSelection[key])
            .map(Number);

        if (idsToUnassign.length === 0) return;
        setIsUnassigning(true);
        try {
            const res = await ExamService.unassignQuestions({
                examId: examIdNum,
                questionIds: idsToUnassign
            });
            if (res.success) {
                const rejected = res.data || [];
                if (rejected.length > 0) {
                    toast.error(`Failed to unassign ${rejected.length} question(s).`);
                } else {
                    toast.success("Questions unassigned successfully.");
                    setRowSelection({});
                    refreshData();
                }
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Failed to unassign questions.";
            toast.error(errorMsg);
        } finally {
            setIsUnassigning(false);
            setShowBulkUnassignDialog(false);
        }
    };

    const handleEditQuestion = (question: any) => {
        setQuestionToEdit(question);
        setShowSaveModal(true);
    };

    const handleAddQuestion = () => {
        setQuestionToEdit(null);
        setShowSaveModal(true);
    };

    const columns: any[] = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }: any) => (
                    <div className="d-flex align-items-center justify-content-center">
                        <input
                            type="checkbox"
                            className="form-check-input m-0"
                            checked={table.getIsAllPageRowsSelected()}
                            onChange={table.getToggleAllPageRowsSelectedHandler()}
                        />
                    </div>
                ),
                size: 36,
                cell: ({ row }: any) => (
                    <div className="d-flex align-items-center justify-content-center">
                        <input
                            type="checkbox"
                            className="form-check-input m-0"
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                        />
                    </div>
                )
            },
            {
                id: "body",
                header: "Question",
                accessorKey: "body",
                size: 550,
                cell: (info: any) => <div className="text-wrap">{info.getValue()}</div>
            },
            {
                id: "score",
                header: "Score",
                accessorKey: "score",
                size: 50,
                cell: (info: any) => <span className="fw-medium">{info.getValue()} pts</span>
            },
            {
                id: "level",
                header: "Level",
                accessorKey: "questionLevel",
                size: 25,
                cell: (info: any) => {
                    const level = info.getValue();
                    const infoDetails = QuestionLevelInfo[level] || { label: String(level), color: "secondary" };
                    return <Badge bg={infoDetails.color}>{infoDetails.label}</Badge>;
                }
            },
            {
                id: "actions",
                header: "Actions",
                size: 70,
                cell: (info: any) => (
                    <div className="d-flex justify-content-center gap-2">
                        <ActionButton
                            variant="primary"
                            onClick={() => handleEditQuestion(info.row.original)}
                            title="Edit Question"
                            fullWidth={false}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            className="d-inline-flex align-items-center justify-content-center"
                        >
                            <Edit2 size={14} />
                        </ActionButton>
                        <ActionButton
                            variant="outline-warning"
                            onClick={() => {
                                setQuestionIdToUnassign(info.row.original.id);
                                setShowSingleUnassignDialog(true);
                            }}
                            disabled={isExamPublished}
                            title={
                                isExamPublished
                                    ? "Cannot unassign questions from a published exam"
                                    : "Unassign Question"
                            }
                            fullWidth={false}
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            className="d-inline-flex align-items-center justify-content-center"
                        >
                            <Unlink size={14} />
                        </ActionButton>
                    </div>
                )
            }
        ],
        [rowSelection, isExamPublished]
    );

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    if (isNaN(examIdNum)) {
        return <Alert variant="danger">Invalid Exam ID</Alert>;
    }

    return (
        <div className="p-4">
            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <ActionButton variant="outline-secondary" onClick={() => navigate("/instructor/exams")}>
                        <ArrowLeft size={18} />
                    </ActionButton>
                    <div>
                        <h2 className="mb-1 fw-bold">Question Bank</h2>
                        <span className="text-muted">
                            {isLoadingExam ? "Loading exam info..." : examInfo?.data?.title}
                        </span>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {selectedCount > 0 && (
                        <>
                            <ActionButton
                                variant="outline-warning"
                                onClick={() => setShowBulkUnassignDialog(true)}
                                disabled={isUnassigning || isExamPublished}
                            >
                                <Unlink size={18} className="me-2" /> Unassign Selected ({selectedCount})
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={isDeleting}
                            >
                                <Trash2 size={18} className="me-2" /> Delete Selected ({selectedCount})
                            </ActionButton>
                        </>
                    )}
                    <ActionButton
                        variant="outline-primary"
                        onClick={() => setShowAssignModal(true)}
                        disabled={isExamPublished}
                        title={isExamPublished ? "Cannot assign questions to a published exam" : "Assign Questions"}
                    >
                        <Plus size={18} className="me-2" /> Assign Questions
                    </ActionButton>
                    <ActionButton variant="primary" onClick={handleAddQuestion}>
                        <Plus size={18} className="me-2" /> New Question
                    </ActionButton>
                </div>
            </div>

            {isExamPublished && (
                <Alert variant="warning" className="mb-4 py-2 border-warning">
                    <strong>Note:</strong> This exam has been published. Modifying existing questions might be locked if
                    students have already attempted them.
                </Alert>
            )}

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table
                    columns={columns}
                    data={data?.data || []}
                    totalCount={totalCount}
                    pagination={{ pageIndex, pageSize }}
                    setPagination={handleSetPagination}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    getRowId={(row) => String(row.id)}
                    isPending={isLoading}
                    error={error}
                />
            </Card>

            <SaveQuestionModal
                show={showSaveModal}
                onHide={() => setShowSaveModal(false)}
                onSuccess={refreshData}
                examId={examIdNum}
                questionToEdit={questionToEdit}
            />

            <AssignQuestionsModal
                show={showAssignModal}
                onHide={() => setShowAssignModal(false)}
                onSuccess={refreshData}
                examId={examIdNum}
                alreadyAssignedIds={alreadyAssignedIds}
            />

            <ConfirmDeleteDialog
                show={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteSelected}
                title="Delete Questions"
                description={`Are you sure you want to delete ${selectedCount} selected question(s)? This action cannot be undone.`}
            />

            <ConfirmActionDialog
                show={showSingleUnassignDialog}
                onHide={() => {
                    setShowSingleUnassignDialog(false);
                    setQuestionIdToUnassign(null);
                }}
                onConfirm={handleUnassignSingle}
                title="Unassign Question"
                description="Are you sure you want to unassign this question? It will be removed from this exam but will remain in the general question pool."
                confirmLabel="Unassign"
                confirmVariant="warning"
                icon={<Unlink size={24} style={{ color: "#d97706" }} />}
                iconBgColor="#fef3c7"
            />

            <ConfirmActionDialog
                show={showBulkUnassignDialog}
                onHide={() => setShowBulkUnassignDialog(false)}
                onConfirm={handleUnassignSelected}
                title="Unassign Questions"
                description={`Are you sure you want to unassign ${selectedCount} selected question(s)? They will be removed from this exam but will remain in the general question pool.`}
                confirmLabel="Unassign"
                confirmVariant="warning"
                icon={<Unlink size={24} style={{ color: "#d97706" }} />}
                iconBgColor="#fef3c7"
            />
        </div>
    );
};

export default ExamQuestionsPage;
