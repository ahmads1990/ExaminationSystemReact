import { ArrowLeft, Edit2, Plus, Trash2, Unlink } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

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
            toast.success(t("instructor.exam_questions.toast_delete_success", "Questions deleted successfully"));
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
                    toast.error(t("instructor.exam_questions.toast_unassign_single_failed", { reason: rejected[0].reason }));
                } else {
                    toast.success(t("instructor.exam_questions.toast_unassign_single_success", "Question unassigned successfully."));
                    refreshData();
                }
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || t("instructor.exam_questions.toast_unassign_single_error", "Failed to unassign question.");
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
                    toast.error(t("instructor.exam_questions.toast_unassign_bulk_failed", { count: rejected.length }));
                } else {
                    toast.success(t("instructor.exam_questions.toast_unassign_bulk_success", "Questions unassigned successfully."));
                    setRowSelection({});
                    refreshData();
                }
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.message || t("instructor.exam_questions.toast_unassign_bulk_error", "Failed to unassign questions.");
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
                header: t("instructor.exam_questions.table_col_question"),
                accessorKey: "body",
                size: 550,
                cell: (info: any) => <div className="text-wrap">{info.getValue()}</div>
            },
            {
                id: "score",
                header: t("instructor.exam_questions.table_col_score"),
                accessorKey: "score",
                size: 50,
                cell: (info: any) => <span className="fw-medium">{info.getValue()} {t("instructor.exams.total_grade_pts", { count: "" }).trim()}</span>
            },
            {
                id: "level",
                header: t("instructor.exam_questions.table_col_level"),
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
                header: t("instructor.exam_questions.table_col_actions"),
                size: 70,
                cell: (info: any) => (
                    <div className="d-flex justify-content-center gap-2">
                        <ActionButton
                            variant="primary"
                            onClick={() => handleEditQuestion(info.row.original)}
                            title={t("instructor.exam_questions.edit_tooltip")}
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
                                    ? t("instructor.exam_questions.unassign_disabled_tooltip")
                                    : t("instructor.exam_questions.unassign_tooltip")
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
        [rowSelection, isExamPublished, t]
    );

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    if (isNaN(examIdNum)) {
        return <Alert variant="danger">{t("instructor.exam_questions.invalid_exam_id")}</Alert>;
    }

    return (
        <div className="p-4">
            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <ActionButton variant="outline-secondary" onClick={() => navigate("/instructor/exams")}>
                        <ArrowLeft size={18} />
                    </ActionButton>
                    <div>
                        <h2 className="mb-1 fw-bold">{t("instructor.exam_questions.title")}</h2>
                        <span className="text-muted">
                            {isLoadingExam ? t("instructor.exam_questions.loading_exam_info") : examInfo?.data?.title}
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
                                <Unlink size={18} className="me-2" /> {t("instructor.exam_questions.btn_unassign_selected", { count: selectedCount })}
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={isDeleting}
                            >
                                <Trash2 size={18} className="me-2" /> {t("instructor.exam_questions.btn_delete_selected", { count: selectedCount })}
                            </ActionButton>
                        </>
                    )}
                    <ActionButton
                        variant="outline-primary"
                        onClick={() => setShowAssignModal(true)}
                        disabled={isExamPublished}
                        title={isExamPublished ? t("instructor.exam_questions.assign_disabled_tooltip") : t("instructor.exam_questions.btn_assign")}
                    >
                        <Plus size={18} className="me-2" /> {t("instructor.exam_questions.btn_assign")}
                    </ActionButton>
                    <ActionButton variant="primary" onClick={handleAddQuestion}>
                        <Plus size={18} className="me-2" /> {t("instructor.exam_questions.btn_new")}
                    </ActionButton>
                </div>
            </div>

            {isExamPublished && (
                <Alert variant="warning" className="mb-4 py-2 border-warning">
                    <strong>Note:</strong> {t("instructor.exam_questions.published_alert")}
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
                title={t("instructor.exam_questions.delete_modal_title")}
                description={t("instructor.exam_questions.delete_modal_desc", { count: selectedCount })}
            />

            <ConfirmActionDialog
                show={showSingleUnassignDialog}
                onHide={() => {
                    setShowSingleUnassignDialog(false);
                    setQuestionIdToUnassign(null);
                }}
                onConfirm={handleUnassignSingle}
                title={t("instructor.exam_questions.unassign_single_title")}
                description={t("instructor.exam_questions.unassign_single_desc")}
                confirmLabel={t("instructor.exam_questions.unassign_action_label")}
                confirmVariant="warning"
                icon={<Unlink size={24} style={{ color: "#d97706" }} />}
                iconBgColor="#fef3c7"
            />

            <ConfirmActionDialog
                show={showBulkUnassignDialog}
                onHide={() => setShowBulkUnassignDialog(false)}
                onConfirm={handleUnassignSelected}
                title={t("instructor.exam_questions.unassign_bulk_title")}
                description={t("instructor.exam_questions.unassign_bulk_desc", { count: selectedCount })}
                confirmLabel={t("instructor.exam_questions.unassign_action_label")}
                confirmVariant="warning"
                icon={<Unlink size={24} style={{ color: "#d97706" }} />}
                iconBgColor="#fef3c7"
            />
        </div>
    );
};

export default ExamQuestionsPage;
