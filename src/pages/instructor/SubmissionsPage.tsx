import { ArrowLeft, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Badge, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import GenericTable from "../../components/common/Table";
import { ExamAttemptStatus, SortingDirection } from "../../enums";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import useQuery from "../../hooks/useQuery";
import ExamService from "../../services/examService";
import InstructorService from "../../services/instructorService";
import { formatDate } from "../../utils/dateUtils";

const SubmissionsPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const examIdNum = Number(examId);

    // Pagination Hook
    const { pageIndex, pageSize, totalCount, setTotalCount, setPageIndex, setPageSize, resetPage } = usePagination({
        defaultPageSize: 10
    });

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState<ExamAttemptStatus | "">("");

    // Sorting State
    const [orderBy, setOrderBy] = useState<string>("StudentName");
    const [sortDirection, setSortDirection] = useState<SortingDirection>(SortingDirection.Ascending);

    const handleSort = useCallback(
        (field: string) => {
            if (orderBy === field) {
                setSortDirection((prev) =>
                    prev === SortingDirection.Ascending ? SortingDirection.Descending : SortingDirection.Ascending
                );
            } else {
                setOrderBy(field);
                setSortDirection(SortingDirection.Ascending);
            }
            resetPage();
        },
        [orderBy, resetPage]
    );

    // Fetch Exam Info for Header
    const { data: examResponse, isPending: isLoadingExam } = useQuery(
        () => ExamService.getExamById(examIdNum),
        [examIdNum]
    );
    const examInfo = examResponse?.data;

    // Fetch Submissions Stats
    const {
        data: response,
        isPending: isLoading,
        error
    } = useQuery(
        () =>
            InstructorService.getExamSubmissions(examIdNum, {
                StudentName: debouncedSearch || undefined,
                Status: statusFilter || undefined,
                PageIndex: pageIndex,
                PageSize: pageSize,
                OrderBy: orderBy,
                SortDirection: sortDirection
            }),
        [examIdNum, debouncedSearch, statusFilter, pageIndex, pageSize, orderBy, sortDirection]
    );

    const statsResponse = response?.data;
    const submissions = statsResponse?.data || [];

    // Sync total count
    useEffect(() => {
        if (statsResponse) {
            setTotalCount(statsResponse.totalCount || 0);
        }
    }, [statsResponse, setTotalCount]);

    // Reset pagination on search/filter changes
    useEffect(() => {
        resetPage();
    }, [debouncedSearch, statusFilter, resetPage]);

    const handleSetPagination = useCallback(
        (updater: any) => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
                if (newState.pageSize !== pageSize) {
                    setPageSize(newState.pageSize);
                }
            }
        },
        [pageIndex, pageSize, setPageIndex, setPageSize]
    );

    // Sort Arrows Indicator
    const renderSortArrow = useCallback(
        (field: string) => {
            const isSorted = orderBy === field;
            return (
                <span
                    className={`ms-1 ${isSorted ? "text-primary fw-bold" : "text-muted opacity-50"}`}
                    style={{ fontSize: "0.65rem" }}
                >
                    {isSorted ? (sortDirection === SortingDirection.Ascending ? "▲" : "▼") : "▲▼"}
                </span>
            );
        },
        [orderBy, sortDirection]
    );

    const columns: any[] = useMemo(
        () => [
            {
                id: "studentName",
                header: () => (
                    <div
                        className="d-flex align-items-center cursor-pointer select-none"
                        onClick={() => handleSort("StudentName")}
                    >
                        {t("instructor.submissions.table_student_name")} {renderSortArrow("StudentName")}
                    </div>
                ),
                accessorKey: "studentName",
                size: 250,
                cell: (info: any) => <div className="fw-semibold text-secondary-800">{info.getValue() || "N/A"}</div>
            },
            {
                id: "status",
                header: () => (
                    <div
                        className="d-flex align-items-center cursor-pointer select-none"
                        onClick={() => handleSort("Status")}
                    >
                        {t("instructor.submissions.table_status")} {renderSortArrow("Status")}
                    </div>
                ),
                accessorKey: "status",
                size: 150,
                cell: (info: any) => {
                    const status = info.getValue() as ExamAttemptStatus;
                    let badgeBg = "secondary";
                    switch (status) {
                        case ExamAttemptStatus.NotStarted:
                            badgeBg = "secondary";
                            break;
                        case ExamAttemptStatus.InProgress:
                            badgeBg = "primary";
                            break;
                        case ExamAttemptStatus.Completed:
                            badgeBg = "warning";
                            break;
                        case ExamAttemptStatus.TimedOut:
                            badgeBg = "danger";
                            break;
                        case ExamAttemptStatus.Grading:
                            badgeBg = "info";
                            break;
                        case ExamAttemptStatus.Graded:
                            badgeBg = "success";
                            break;
                    }
                    return <Badge bg={badgeBg}>{status}</Badge>;
                }
            },
            {
                id: "grade",
                header: () => (
                    <div
                        className="d-flex align-items-center cursor-pointer select-none"
                        onClick={() => handleSort("Grade")}
                    >
                        {t("instructor.submissions.table_grade")} {renderSortArrow("Grade")}
                    </div>
                ),
                size: 180,
                cell: ({ row }: any) => {
                    const attempt = row.original;
                    if (attempt.status === ExamAttemptStatus.Graded) {
                        return (
                            <span className="fw-bold text-success">
                                {attempt.grade?.toFixed(1)} / {attempt.maxGrade?.toFixed(1)}
                            </span>
                        );
                    }
                    if (attempt.status === ExamAttemptStatus.Grading) {
                        return <span className="text-info fw-medium">{t("instructor.submissions.status_grading")}</span>;
                    }
                    if (
                        attempt.status === ExamAttemptStatus.Completed ||
                        attempt.status === ExamAttemptStatus.TimedOut
                    ) {
                        return <span className="text-secondary fw-medium">{t("instructor.submissions.status_pending_grade")}</span>;
                    }
                    return <span className="text-muted">-</span>;
                }
            },
            {
                id: "createDate",
                header: () => (
                    <div
                        className="d-flex align-items-center cursor-pointer select-none"
                        onClick={() => handleSort("CreateDate")}
                    >
                        {t("instructor.submissions.table_started_date")} {renderSortArrow("CreateDate")}
                    </div>
                ),
                accessorKey: "createDate",
                size: 200,
                cell: (info: any) => <span>{formatDate(info.getValue())}</span>
            },
            {
                id: "completionTime",
                header: t("instructor.submissions.table_completion_time"),
                accessorKey: "completionTime",
                size: 180,
                cell: (info: any) => <span>{info.getValue() || "-"}</span>
            }
        ],
        [orderBy, sortDirection, handleSort, renderSortArrow, t]
    );

    if (isNaN(examIdNum)) {
        return <Alert variant="danger">{t("instructor.submissions.invalid_exam_id")}</Alert>;
    }

    return (
        <div className="p-4 animate-fade-in">
            {/* Header Panel */}
            <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                    <ActionButton variant="outline-secondary" onClick={() => navigate("/instructor/exams")}>
                        <ArrowLeft size={18} />
                    </ActionButton>
                    <div>
                        <h2 className="mb-1 fw-bold">{t("instructor.submissions.title")}</h2>
                        <span className="text-muted">{isLoadingExam ? t("instructor.submissions.loading_exam_info") : examInfo?.title}</span>
                    </div>
                </div>
            </div>

            {/* Filter controls card */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 border-0">
                                    <Search size={18} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 border-0 bg-light py-2"
                                    placeholder={t("instructor.submissions.search_placeholder")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select border-0 bg-light py-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ExamAttemptStatus | "")}
                            >
                                <option value="">{t("instructor.exams.all_statuses")}</option>
                                <option value={ExamAttemptStatus.NotStarted}>{ExamAttemptStatus.NotStarted}</option>
                                <option value={ExamAttemptStatus.InProgress}>{ExamAttemptStatus.InProgress}</option>
                                <option value={ExamAttemptStatus.Completed}>{ExamAttemptStatus.Completed}</option>
                                <option value={ExamAttemptStatus.TimedOut}>{ExamAttemptStatus.TimedOut}</option>
                                <option value={ExamAttemptStatus.Grading}>{ExamAttemptStatus.Grading}</option>
                                <option value={ExamAttemptStatus.Graded}>{ExamAttemptStatus.Graded}</option>
                            </select>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Table Area */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <GenericTable
                    columns={columns}
                    data={submissions}
                    totalCount={totalCount}
                    pagination={{ pageIndex, pageSize }}
                    setPagination={handleSetPagination}
                    getRowId={(row) => String(row.studentId)}
                    isPending={isLoading}
                    error={error}
                />
            </Card>
        </div>
    );
};

export default SubmissionsPage;
