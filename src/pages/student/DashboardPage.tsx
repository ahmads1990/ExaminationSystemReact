import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Badge, Alert } from "react-bootstrap";
import SkeletonCard from "../../components/common/SkeletonCard";
import { FileText, BookOpen, Clock, CalendarDays, Target, CheckCircle } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";
import StudentCourseService from "../../services/studentCourseService";
import StudentExamService from "../../services/studentExamService";
import { StudentEnrollmentDto } from "../../api/responses/StudentCourseResponses";
import { AvailableExamDto } from "../../api/responses/StudentExamResponses";
import { EXAM_TYPE_LABELS, EXAM_TYPE_COLORS } from "../../constants/examConstants";
import { formatDate } from "../../utils/dateUtils";
import ActionButton from "../../components/common/ActionButton";
import { useAuth } from "../../contexts/AuthContext";

const StudentDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

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
                setError(prev => prev ? `${prev} ` : "" + (examsResp.message || "Failed to load available exams."));
            }
        } catch (err) {
            console.error("Failed to load available exams", err);
            setError(prev => prev ? `${prev} ` : "" + "Failed to load available exams.");
        } finally {
            setLoadingExams(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getRemainingAttemptsStr = (exam: AvailableExamDto) => {
        const remaining = exam.maxAttempts - exam.attemptsTaken;
        return `${remaining} of ${exam.maxAttempts} remaining`;
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Welcoming Header */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Welcome back, {user?.name || "Student"}!</h2>
                <p className="text-muted">Here is an overview of your active courses and upcoming exams.</p>
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
                            Available Exams
                        </h4>
                        <Badge bg="primary" className="rounded-pill px-2.5 py-1.5 fw-semibold">
                            {availableExams.length} Active
                        </Badge>
                    </div>

                    {loadingExams ? (
                        <SkeletonCard count={3} />
                    ) : availableExams.length === 0 ? (
                        <EmptyState 
                            title="All caught up!"
                            message="There are no pending exams available for your enrolled courses right now."
                            icon={CheckCircle}
                        />
                    ) : (
                        <Row className="g-3">
                            {availableExams.map((exam) => {
                                const typeColor = EXAM_TYPE_COLORS[exam.examType] ?? { bg: "var(--surface-bg)", border: "var(--color-secondary-200)", text: "var(--text-secondary)" };
                                const hasAttemptsLeft = exam.attemptsTaken < exam.maxAttempts;
                                const deadlinePassed = new Date(exam.deadlineDate) < new Date();
                                const canTake = hasAttemptsLeft && !deadlinePassed;

                                return (
                                    <Col xs={12} key={exam.examId}>
                                        <Card className="border-0 shadow-sm card-custom hover-lift transition-all">
                                            <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                                                <div className="d-flex flex-column gap-2 flex-grow-1">
                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                        <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}>
                                                            {exam.courseName}
                                                        </span>
                                                        <span
                                                            className="badge rounded-pill fw-semibold"
                                                            style={{
                                                                backgroundColor: typeColor.bg,
                                                                color: typeColor.text,
                                                                fontSize: "0.65rem",
                                                                padding: "0.3em 0.7em",
                                                            }}
                                                        >
                                                            {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                                                        </span>
                                                    </div>

                                                    <h5 className="fw-bold mb-1 text-dark">
                                                        {exam.title}
                                                    </h5>

                                                    <div className="d-flex align-items-center gap-4 flex-wrap mt-1" style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                                                        <div className="d-flex align-items-center gap-1" title="Duration">
                                                            <Clock size={14} className="text-primary opacity-75" />
                                                            <span className="fw-medium">{exam.maxDurationInMinutes} mins</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1" title="Attempts Remaining">
                                                            <Target size={14} className="text-primary opacity-75" />
                                                            <span className="fw-medium">{getRemainingAttemptsStr(exam)}</span>
                                                        </div>
                                                        {exam.deadlineDate && (
                                                            <div className="d-flex align-items-center gap-1" title="Deadline">
                                                                <CalendarDays size={14} className="text-primary opacity-75" />
                                                                <span className="fw-medium text-danger">Due: {formatDate(exam.deadlineDate)}</span>
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
                                                        {!hasAttemptsLeft ? "Attempts Used" : (deadlinePassed ? "Expired" : "Take Exam")}
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
                            My Courses
                        </h4>
                        <Badge bg="secondary" className="rounded-pill px-2.5 py-1.5 fw-semibold bg-secondary-subtle text-secondary-800">
                            {enrollments.length} Enrolled
                        </Badge>
                    </div>

                    {loadingEnrollments ? (
                        <SkeletonCard count={3} />
                    ) : enrollments.length === 0 ? (
                        <EmptyState 
                            title="No courses yet"
                            message="Browse available courses and enroll in them to start taking exams."
                            icon={BookOpen}
                            ctaText="Browse Courses"
                            ctaLink="/courses"
                        />
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {enrollments.map((enrollment) => (
                                <Card key={enrollment.courseID} className="border-0 shadow-sm card-custom-dark">
                                    <Card.Body className="p-3.5 d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-start gap-2">
                                            <h6 className="fw-bold mb-0 text-dark">
                                                {enrollment.courseName}
                                            </h6>
                                            {enrollment.finished && (
                                                <Badge bg="success" className="rounded-pill py-1 px-2 text-uppercase font-size-10">
                                                    Finished
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center gap-1 text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                                            <CalendarDays size={13} className="text-secondary opacity-75" />
                                            <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
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

// Check Circle icon fallback
const CheckCircleIcon = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default StudentDashboardPage;
