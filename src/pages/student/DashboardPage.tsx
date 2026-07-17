import { BookOpen, CalendarDays, CheckCircle, Clock, FileText, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { StudentEnrollmentDto } from "../../api/responses/StudentCourseResponses";
import { AvailableExamDto } from "../../api/responses/StudentExamResponses";
import ActionButton from "../../components/common/ActionButton";
import EmptyState from "../../components/common/EmptyState";
import SkeletonCard from "../../components/common/SkeletonCard";
import { EXAM_TYPE_COLORS, EXAM_TYPE_LABELS } from "../../constants/examConstants";
import { useAuth } from "../../contexts/AuthContext";
import StudentCourseService from "../../services/studentCourseService";
import StudentExamService from "../../services/studentExamService";
import { formatDate } from "../../utils/dateUtils";

const StudentDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    const [enrollments, setEnrollments] = useState<StudentEnrollmentDto[]>([]);
    const [availableExams, setAvailableExams] = useState<AvailableExamDto[]>([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(true);
    const [loadingExams, setLoadingExams] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoadingEnrollments(true);
        setLoadingExams(true);
        setError(null);

        try {
            // Fetch student enrollments
            const enrollmentsResp = await StudentCourseService.getMyEnrollments({ OnlyEnrolled: true });
            setEnrollments(enrollmentsResp.data || []);
        } catch (err) {
            console.error("Failed to load enrollments", err);
            setError("Failed to load course enrollments.");
        } finally {
            setLoadingEnrollments(false);
        }

        try {
            // Fetch available exams
            const examsResp = await StudentExamService.getAvailableExams();
            if (examsResp.success) {
                setAvailableExams(examsResp.data || []);
            } else {
                setError((prev) => (prev ? `${prev} ` : "" + (examsResp.message || "Failed to load available exams.")));
            }
        } catch (err) {
            console.error("Failed to load available exams", err);
            setError((prev) => (prev ? `${prev} ` : "" + "Failed to load available exams."));
        } finally {
            setLoadingExams(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getRemainingAttemptsStr = (exam: AvailableExamDto) => {
        const remaining = exam.maxAttempts - exam.attemptsTaken;
        return t("dashboard.attempts_remaining", { remaining, total: exam.maxAttempts });
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Welcoming Header */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">{t("dashboard.welcome_student", { name: user?.name || "Student" })}</h2>
                <p className="text-muted">{t("dashboard.student_desc")}</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Row className="g-4">
                {/* AVAILABLE EXAMS COLUMN */}
                <Col lg={8}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-secondary-800 d-flex align-items-center gap-2">
                            <FileText size={22} className="text-primary" />
                            {t("dashboard.available_exams")}
                        </h4>
                        <Badge bg="primary" className="rounded-pill px-2.5 py-1.5 fw-semibold">
                            {availableExams.length} {t("dashboard.active")}
                        </Badge>
                    </div>

                    {loadingExams ? (
                        <SkeletonCard count={3} />
                    ) : availableExams.length === 0 ? (
                        <EmptyState
                            title={t("dashboard.all_caught_up")}
                            message={t("dashboard.no_pending_exams")}
                            icon={CheckCircle}
                        />
                    ) : (
                        <Row className="g-3">
                            {availableExams.map((exam) => {
                                const typeColor = EXAM_TYPE_COLORS[exam.examType] ?? {
                                    bg: "var(--surface-bg)",
                                    border: "var(--color-secondary-200)",
                                    text: "var(--text-secondary)"
                                };
                                const hasAttemptsLeft = exam.attemptsTaken < exam.maxAttempts;
                                const deadlinePassed = new Date(exam.deadlineDate) < new Date();
                                const canTake = hasAttemptsLeft && !deadlinePassed;

                                return (
                                    <Col xs={12} key={exam.examId}>
                                        <Card className="border-0 shadow-sm card-custom hover-lift transition-all">
                                            <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                                                <div className="d-flex flex-column gap-2 flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                        <span
                                                            className="text-secondary fw-bold text-uppercase"
                                                            style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                                                        >
                                                            {exam.courseName}
                                                        </span>
                                                        <span
                                                            className="badge rounded-pill fw-semibold"
                                                            style={{
                                                                backgroundColor: typeColor.bg,
                                                                color: typeColor.text,
                                                                fontSize: "0.65rem",
                                                                padding: "0.3em 0.7em"
                                                            }}
                                                        >
                                                            {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                                                        </span>
                                                    </div>

                                                    <h5 className="fw-bold mb-1 text-dark">{exam.title}</h5>

                                                    <div
                                                        className="d-flex align-items-center gap-4 flex-wrap mt-1"
                                                        style={{
                                                            fontSize: "var(--text-xs)",
                                                            color: "var(--text-secondary)"
                                                        }}
                                                    >
                                                        <div
                                                            className="d-flex align-items-center gap-1"
                                                            title="Duration"
                                                        >
                                                            <Clock size={14} className="text-primary opacity-75" />
                                                            <span className="fw-medium">
                                                                {exam.maxDurationInMinutes} {t("dashboard.minutes")}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-center gap-1"
                                                            title="Attempts Remaining"
                                                        >
                                                            <Target size={14} className="text-primary opacity-75" />
                                                            <span className="fw-medium">
                                                                {getRemainingAttemptsStr(exam)}
                                                            </span>
                                                        </div>
                                                        {exam.deadlineDate && (
                                                            <div
                                                                className="d-flex align-items-center gap-1"
                                                                title="Deadline"
                                                            >
                                                                <CalendarDays
                                                                    size={14}
                                                                    className="text-primary opacity-75"
                                                                />
                                                                <span className="fw-medium text-danger">
                                                                    {t("dashboard.due")}: {formatDate(exam.deadlineDate)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-md-end min-width-md-150">
                                                    <ActionButton
                                                        variant={canTake ? "primary" : "outline-secondary"}
                                                        onClick={() => navigate(`/student/exams/${exam.examId}/start`)}
                                                        disabled={!canTake}
                                                        fullWidth
                                                    >
                                                        {!hasAttemptsLeft
                                                            ? t("dashboard.attempts_used")
                                                            : deadlinePassed
                                                              ? t("dashboard.expired")
                                                              : t("dashboard.take_exam")}
                                                    </ActionButton>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </Col>

                {/* ENROLLED COURSES COLUMN */}
                <Col lg={4}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-secondary-800 d-flex align-items-center gap-2">
                            <BookOpen size={22} className="text-primary" />
                            {t("dashboard.my_courses")}
                        </h4>
                        <Badge
                            bg="secondary"
                            className="rounded-pill px-2.5 py-1.5 fw-semibold bg-secondary-subtle text-secondary-800"
                        >
                            {enrollments.length} {t("dashboard.enrolled")}
                        </Badge>
                    </div>

                    {loadingEnrollments ? (
                        <SkeletonCard count={3} />
                    ) : enrollments.length === 0 ? (
                        <EmptyState
                            title={t("dashboard.no_courses_yet")}
                            message={t("dashboard.browse_courses_desc")}
                            icon={BookOpen}
                            ctaText={t("dashboard.browse_courses_btn")}
                            ctaLink="/courses"
                        />
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {enrollments.map((enrollment) => (
                                <Card key={enrollment.courseID} className="border-0 shadow-sm card-custom-dark">
                                    <Card.Body className="p-3.5 d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-start gap-2">
                                            <h6 className="fw-bold mb-0 text-dark">{enrollment.courseName}</h6>
                                            {enrollment.finished && (
                                                <Badge
                                                    bg="success"
                                                    className="rounded-pill py-1 px-2 text-uppercase font-size-10"
                                                >
                                                    {t("dashboard.finished")}
                                                </Badge>
                                            )}
                                        </div>
                                        <div
                                            className="d-flex align-items-center gap-1 text-muted mt-1"
                                            style={{ fontSize: "0.75rem" }}
                                        >
                                            <CalendarDays size={13} className="text-secondary opacity-75" />
                                            <span>{t("dashboard.enrolled_date")}{formatDate(enrollment.enrollmentDate)}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default StudentDashboardPage;
