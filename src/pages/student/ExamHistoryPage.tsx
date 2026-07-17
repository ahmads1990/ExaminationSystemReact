import { BookOpen, Calendar, ChevronRight, FileText, History } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Badge, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { StudentAttemptSummaryDto } from "../../api/responses/StudentExamResponses";
import AppPagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import SkeletonTable from "../../components/common/SkeletonTable";
import { usePagination } from "../../hooks/usePagination";
import StudentExamService from "../../services/studentExamService";
import { formatDate } from "../../utils/dateUtils";

const ExamHistoryPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [attempts, setAttempts] = useState<StudentAttemptSummaryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { pageIndex, pageSize, totalPages, setTotalCount, handlePageChange } = usePagination({
        defaultPageSize: 10
    });

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await StudentExamService.getExamHistory({
                    PageIndex: pageIndex,
                    PageSize: pageSize
                });
                setAttempts(res.data || []);
                setTotalCount(res.totalCount || 0);
            } catch (err) {
                console.error("Error loading exam history:", err);
                setError(t("common.occurred_error"));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [pageIndex, pageSize]);

    return (
        <div className="container-fluid animate-fade-in">
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">{t("student.history.title")}</h2>
                <p className="text-muted">{t("student.history.subtitle")}</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                    <Card.Body className="p-0">
                        <SkeletonTable rows={5} cols={6} />
                    </Card.Body>
                </Card>
            ) : attempts.length === 0 && pageIndex === 0 ? (
                <EmptyState
                    title={t("student.history.no_attempts")}
                    message={t("student.history.no_attempts_desc")}
                    icon={History}
                    ctaText={t("student.history.go_dashboard")}
                    ctaLink="/student/dashboard"
                />
            ) : (
                <>
                    <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="align-middle mb-0" style={{ borderCollapse: "separate" }}>
                                    <thead
                                        className="bg-light text-uppercase text-secondary"
                                        style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                                    >
                                        <tr>
                                            <th className="py-3 px-4 border-0">{t("student.history.col_exam_details")}</th>
                                            <th className="py-3 px-4 border-0">{t("student.history.col_course")}</th>
                                            <th className="py-3 px-4 border-0 text-center">{t("student.history.col_score")}</th>
                                            <th className="py-3 px-4 border-0 text-center">{t("student.history.col_result")}</th>
                                            <th className="py-3 px-4 border-0">{t("student.history.col_date")}</th>
                                            <th className="py-3 px-4 border-0 text-end">{t("student.history.col_action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((attempt) => {
                                            const isGraded = attempt.status === "Graded";
                                            const scorePercent =
                                                isGraded && attempt.maxGrade > 0
                                                    ? Math.round((attempt.grade / attempt.maxGrade) * 100)
                                                    : 0;

                                            return (
                                                <tr key={attempt.attemptId} className="transition-all">
                                                    {/* EXAM TITLE */}
                                                    <td className="py-3.5 px-4 border-bottom border-light">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="bg-light text-primary rounded-3 p-2">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div>
                                                                <span className="fw-bold text-dark d-block leading-snug">
                                                                    {attempt.examTitle}
                                                                </span>
                                                                <span className="text-muted font-size-11">
                                                                    {t("student.history.attempt_num", { id: attempt.attemptId })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* COURSE NAME */}
                                                    <td className="py-3.5 px-4 border-bottom border-light text-secondary font-size-14">
                                                        <div className="d-flex align-items-center gap-1.5">
                                                            <BookOpen size={14} className="text-muted" />
                                                            <span>{attempt.courseName}</span>
                                                        </div>
                                                    </td>

                                                    {/* SCORE */}
                                                    <td className="py-3.5 px-4 border-bottom border-light text-center">
                                                        {isGraded ? (
                                                            <>
                                                                <div>
                                                                    <strong className="text-dark font-size-15">
                                                                        {attempt.grade}
                                                                    </strong>
                                                                    <span className="text-muted font-size-12">
                                                                        {" "}
                                                                        / {attempt.maxGrade}
                                                                    </span>
                                                                </div>
                                                                <span className="text-muted font-size-11 d-block mt-0.5">
                                                                    {scorePercent}% {t("student.history.grade_label")}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted font-size-12 italic">{t("student.history.status_pending")}</span>
                                                        )}
                                                    </td>

                                                    {/* RESULT BADGE */}
                                                    <td className="py-3.5 px-4 border-bottom border-light text-center">
                                                        {isGraded ? (
                                                            <Badge
                                                                bg={attempt.isPassed ? "success-subtle" : "danger-subtle"}
                                                                className={`rounded-pill px-2.5 py-1.5 font-size-11 fw-bold ${
                                                                    attempt.isPassed
                                                                        ? "text-success-800"
                                                                        : "text-danger-800"
                                                                }`}
                                                            >
                                                                {attempt.isPassed ? t("student.history.pass") : t("student.history.fail")}
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                bg="warning-subtle"
                                                                className="rounded-pill px-2.5 py-1.5 font-size-11 fw-bold text-warning-800"
                                                            >
                                                                {t("student.history.grading")}
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    {/* SUBMITTED DATE */}
                                                    <td className="py-3.5 px-4 border-bottom border-light text-secondary font-size-13">
                                                        <div className="d-flex align-items-center gap-1.5">
                                                            <Calendar size={14} className="text-muted" />
                                                            <span>{formatDate(attempt.createDate)}</span>
                                                        </div>
                                                    </td>

                                                    {/* VIEW ACTION */}
                                                    <td className="py-3.5 px-4 border-bottom border-light text-end">
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/student/exams/result?attemptId=${attempt.attemptId}`
                                                                )
                                                            }
                                                            className="btn btn-sm btn-outline-primary rounded-3 px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-semibold"
                                                            style={{ fontSize: "0.75rem" }}
                                                        >
                                                            {isGraded ? t("student.history.btn_view_result") : t("student.history.btn_check_status")}{" "}
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Pagination */}
                    <AppPagination
                        pageIndex={pageIndex}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ExamHistoryPage;


