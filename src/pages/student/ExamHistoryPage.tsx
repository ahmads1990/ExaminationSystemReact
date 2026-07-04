import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { History, FileText, Calendar, ChevronRight, BookOpen } from "lucide-react";
import StudentExamService from "../../services/studentExamService";
import { StudentAttemptSummaryDto } from "../../api/responses/StudentExamResponses";
import { formatDate } from "../../utils/dateUtils";
import ActionButton from "../../components/common/ActionButton";

const ExamHistoryPage = () => {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState<StudentAttemptSummaryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await StudentExamService.getExamHistory();
                if (res.success && res.data) {
                    setAttempts(res.data);
                } else {
                    setError(res.message || "Failed to load exam history.");
                }
            } catch (err) {
                console.error("Error loading exam history:", err);
                setError("An error occurred while loading your exam history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="container-fluid animate-fade-in">
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Exam History</h2>
                <p className="text-muted">Review your past examination attempts, scores, and grades.</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-white rounded-4 border border-light shadow-sm min-vh-50">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p className="text-muted fw-semibold">Loading your attempts history...</p>
                </div>
            ) : attempts.length === 0 ? (
                <Card className="border-0 shadow-sm rounded-4 text-center py-5 px-4 bg-white">
                    <Card.Body className="d-flex flex-column align-items-center gap-3">
                        <div className="bg-light rounded-circle p-3 text-muted">
                            <History size={32} />
                        </div>
                        <h5 className="fw-bold mb-1">No attempts yet</h5>
                        <p className="text-muted small mb-3 max-w-sm">
                            You have not taken any exams yet. Start by browsing available courses or check your dashboard for active exams.
                        </p>
                        <ActionButton variant="primary" onClick={() => navigate("/student/dashboard")} fullWidth={false} className="px-4">
                            Go to Dashboard
                        </ActionButton>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0" style={{ borderCollapse: "separate" }}>
                                <thead className="bg-light text-uppercase text-secondary" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                                    <tr>
                                        <th className="py-3 px-4 border-0">Exam Details</th>
                                        <th className="py-3 px-4 border-0">Course Name</th>
                                        <th className="py-3 px-4 border-0 text-center">Score</th>
                                        <th className="py-3 px-4 border-0 text-center">Result</th>
                                        <th className="py-3 px-4 border-0">Submitted Date</th>
                                        <th className="py-3 px-4 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((attempt) => {
                                        const scorePercent = attempt.maxGrade > 0 ? Math.round((attempt.score / attempt.maxGrade) * 100) : 0;

                                        return (
                                            <tr key={attempt.attemptId} className="transition-all hover-bg-light">
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
                                                                Attempt #{attempt.attemptId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* COURSE NAME */}
                                                <td className="py-3.5 px-4 border-bottom border-light text-secondary font-size-14">
                                                    <div className="d-flex align-items-center gap-1.5">
                                                        <BookOpen size={14} className="text-muted" />
                                                        <span>{attempt.courseTitle}</span>
                                                    </div>
                                                </td>

                                                {/* SCORE */}
                                                <td className="py-3.5 px-4 border-bottom border-light text-center">
                                                    <div>
                                                        <strong className="text-dark font-size-15">{attempt.score}</strong>
                                                        <span className="text-muted font-size-12"> / {attempt.maxGrade}</span>
                                                    </div>
                                                    <span className="text-muted font-size-11 d-block mt-0.5">
                                                        {scorePercent}% Grade
                                                    </span>
                                                </td>

                                                {/* RESULT BADGE */}
                                                <td className="py-3.5 px-4 border-bottom border-light text-center">
                                                    <Badge
                                                        bg={attempt.isPassed ? "success-subtle" : "danger-subtle"}
                                                        className={`rounded-pill px-2.5 py-1.5 font-size-11 fw-bold ${
                                                            attempt.isPassed ? "text-success-800" : "text-danger-800"
                                                        }`}
                                                    >
                                                        {attempt.isPassed ? "PASSED" : "FAILED"}
                                                    </Badge>
                                                </td>

                                                {/* SUBMITTED DATE */}
                                                <td className="py-3.5 px-4 border-bottom border-light text-secondary font-size-13">
                                                    <div className="d-flex align-items-center gap-1.5">
                                                        <Calendar size={14} className="text-muted" />
                                                        <span>{formatDate(attempt.submittedAt)}</span>
                                                    </div>
                                                </td>

                                                {/* VIEW ACTION */}
                                                <td className="py-3.5 px-4 border-bottom border-light text-end">
                                                    <button
                                                        onClick={() => navigate(`/student/exams/result?attemptId=${attempt.attemptId}`)}
                                                        className="btn btn-sm btn-outline-primary rounded-3 px-3 py-1.5 d-inline-flex align-items-center gap-1 fw-semibold"
                                                        style={{ fontSize: "0.75rem" }}
                                                    >
                                                        View Result <ChevronRight size={14} />
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
            )}
        </div>
    );
};

export default ExamHistoryPage;
