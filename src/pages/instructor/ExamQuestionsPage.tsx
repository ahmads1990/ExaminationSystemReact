import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Alert } from "react-bootstrap";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import Table from "../../components/common/Table";
import ActionButton from "../../components/common/ActionButton";
import SaveQuestionModal from "../../components/instructor/questions/SaveQuestionModal";
import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";
import QuestionService from "../../services/questionService";
import ExamService from "../../services/examService";
import { usePagination } from "../../hooks/usePagination";
import useQuery from "../../hooks/useQuery";
import { QuestionLevel } from "../../enums";
import toast from "react-hot-toast";

const ExamQuestionsPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    
    const examIdNum = Number(examId);

    // Trigger for refetching data
    const [refreshTick, setRefreshTick] = useState(0);
    const refreshData = () => setRefreshTick(t => t + 1);

    // Fetch the exam header
    const { data: examInfo, isPending: isLoadingExam } = useQuery(
        () => ExamService.getExamById(examIdNum),
        [examIdNum]
    );

    // Pagination Hook
    const { 
        pageIndex, 
        pageSize, 
        totalCount, 
        setTotalCount, 
        setPageIndex
    } = usePagination({ defaultPageSize: 10 });

    // Fetch Questions
    const { data, isPending: isLoading, error } = useQuery(
        () => QuestionService.getQuestions({ 
            examId: examIdNum, 
            pageIndex, 
            pageSize 
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
    const handleSetPagination = useCallback((updater: any) => {
        if (typeof updater === 'function') {
            const newState = updater({ pageIndex, pageSize });
            setPageIndex(newState.pageIndex);
        }
    }, [pageIndex, pageSize, setPageIndex]);

    // Modals State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<any | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // We don't have rowSelection on the common Generic Table, we'll implement it manually or skip it
    // Wait, the generic table doesn't support rowSelection currently out of the box based on the error.
    // Let's modify Table columns to support it.
    
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    const handleSelectRow = (id: number) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleDeleteSelected = async () => {
        const idsToDelete = Object.keys(selectedRows)
            .filter(key => selectedRows[key])
            .map(Number);
            
        if (idsToDelete.length === 0) return;
        
        setIsDeleting(true);
        try {
            await QuestionService.deleteQuestions(idsToDelete);
            toast.success("Questions deleted successfully");
            setSelectedRows({});
            setShowDeleteDialog(false);
            refreshData();
        } catch (err: any) {
            console.error(err);
            setShowDeleteDialog(false);
        } finally {
            setIsDeleting(false);
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

    const columns: any[] = useMemo(() => [
        {
            id: 'select',
            header: '',
            cell: (info: any) => (
                <div style={{ width: '30px' }}>
                    <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={!!selectedRows[info.row.original.id]}
                        onChange={() => handleSelectRow(info.row.original.id)}
                    />
                </div>
            )
        },
        {
            id: 'body',
            header: 'Question',
            accessorKey: 'body',
            cell: (info: any) => (
                <div className="text-truncate" style={{ maxWidth: '400px' }} title={info.getValue()}>
                    {info.getValue()}
                </div>
            )
        },
        {
            id: 'score',
            header: 'Score',
            accessorKey: 'score',
            cell: (info: any) => <span className="fw-medium">{info.getValue()} pts</span>
        },
        {
            id: 'level',
            header: 'Level',
            accessorKey: 'questionLevel',
            cell: (info: any) => {
                const level = info.getValue() as QuestionLevel;
                const colors = {
                    [QuestionLevel.Easy]: 'success',
                    [QuestionLevel.Medium]: 'warning',
                    [QuestionLevel.Hard]: 'danger'
                };
                return <Badge bg={colors[level] || 'secondary'}>{QuestionLevel[level]}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: (info: any) => (
                <div className="d-flex justify-content-end">
                    <ActionButton variant="outline-primary" onClick={() => handleEditQuestion(info.row.original)}>
                        <Edit2 size={16} className="me-1" /> Edit
                    </ActionButton>
                </div>
            )
        }
    ], [selectedRows]);

    const selectedCount = Object.values(selectedRows).filter(Boolean).length;
    const isExamPublished = examInfo?.data?.examStatus === "Published";

    if (isNaN(examIdNum)) {
        return <Alert variant="danger">Invalid Exam ID</Alert>;
    }

    return (
        <div className="p-4">
            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <ActionButton variant="outline-secondary" onClick={() => navigate('/instructor/exams')}>
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
                        <ActionButton 
                            variant="danger" 
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 size={18} className="me-2" /> Delete Selected ({selectedCount})
                        </ActionButton>
                    )}
                    <ActionButton variant="primary" onClick={handleAddQuestion}>
                        <Plus size={18} className="me-2" /> New Question
                    </ActionButton>
                </div>
            </div>

            {isExamPublished && (
                <Alert variant="warning" className="mb-4 py-2 border-warning">
                    <strong>Note:</strong> This exam has been published. Modifying existing questions might be locked if students have already attempted them.
                </Alert>
            )}

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table
                    columns={columns}
                    data={data?.data || []}
                    totalCount={totalCount}
                    pagination={{ pageIndex, pageSize }}
                    setPagination={handleSetPagination}
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

            <ConfirmDeleteDialog
                show={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteSelected}
                title="Delete Questions"
                description={`Are you sure you want to delete ${selectedCount} selected question(s)? This action cannot be undone.`}
            />
        </div>
    );
};

export default ExamQuestionsPage;
