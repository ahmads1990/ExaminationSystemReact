import { AlertTriangle, ArrowLeft, Calendar, Clock, FileText, PlayCircle, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Card, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ApiErrorCode } from "../../api/contracts/apiErrorCode";
import { AvailableExamDto } from "../../api/responses/StudentExamResponses";
import ActionButton from "../../components/common/ActionButton";
import { EXAM_TYPE_LABELS } from "../../constants/examConstants";
import StudentExamService from "../../services/studentExamService";
import { formatDate } from "../../utils/dateUtils";
import { saveExamToken } from "../../utils/storage";

const ExamStartPage = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [exam, setExam] = useState<AvailableExamDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExamDetails = async () => {
            if (!examId) return;
            setLoading(true);
            setError(null);

            try {
                const response = await StudentExamService.getAvailableExams();
                if (response.success && response.data) {
                    const foundExam = response.data.find((e) => e.examId === Number(examId));
                    if (foundExam) {
                        setExam(foundExam);
                    } else {
                        setError(t("student.exam_start.not_found", "Exam not found or is no longer available."));
                    }
                } else {
                    setError(response.message || t("student.exam_start.failed_retrieve", "Failed to retrieve exam details."));
                }
            } catch (err) {
                console.error("Error fetching exam details:", err);
                setError(t("student.exam_start.generic_error", "An error occurred while loading the exam details."));
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
    }, [examId]);

    const handleBeginExam = async () => {
        if (!examId) return;
        setSubmitting(true);
        setError(null);

        try {
            const response = await StudentExamService.startExam(Number(examId));
            if (response.success && response.data) {
                saveExamToken(response.data);
                toast.success(t("student.exam_start.started_toast", "Exam started! Good luck."));
                navigate("/student/exams/take");
            } else {
                setError(response.message || t("student.exam_start.failed_start_error", "Could not start the exam."));
            }
        } catch (err: any) {
            console.error("Error starting exam attempt:", err);
            const errorCode = err.response?.data?.errorCode;
            const returnedToken = err.response?.data?.data;

            if (errorCode === ApiErrorCode.HasActiveAttempt) {
                if (typeof returnedToken === "string" && returnedToken.length > 0) {
                    saveExamToken(returnedToken);
                    toast.success(t("student.exam_start.resume_toast", "Resuming active exam attempt."));
                    navigate("/student/exams/take");
                } else {
                    toast.success(t("student.exam_start.resume_generic_toast", "Resuming active attempt..."));
                    navigate("/student/exams/take");
                }
            } else if (errorCode === ApiErrorCode.MaxAttemptsExceeded) {
                setError(t("student.exam_start.max_attempts_error", "You have reached the maximum number of attempts for this exam."));
            } else if (errorCode === ApiErrorCode.ExamDeadlinePassed) {
                setError(t("student.exam_start.deadline_error", "The deadline to take this exam has passed."));
            } else if (errorCode === ApiErrorCode.NotEnrolledInCourse) {
                setError(t("student.exam_start.not_enrolled_error", "You must be enrolled in the course offering this exam."));
            } else if (errorCode === ApiErrorCode.ExamNotPublished) {
                setError(t("student.exam_start.not_published_error", "This exam is not currently published."));
            } else {
                setError(err.response?.data?.message || t("student.exam_start.failed_start_error", "Failed to start the exam attempt."));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-50">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">{t("student.exam_start.loading_details")}</p>
            </div>
        );
    }

    if (error || !exam) {
        return (
            <div className="container max-w-md py-5">
                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4 text-center">
                        <div className="bg-danger-subtle text-danger rounded-circle p-3 d-inline-flex mb-3">
                            <AlertTriangle size={32} />
                        </div>
                        <h4 className="fw-bold mb-3">{t("student.exam_start.unable_start")}</h4>
                        <Alert variant="danger" className="text-start py-2.5 px-3">
                            {error || t("student.exam_start.no_exam_info")}
                        </Alert>
                        <ActionButton
                            variant="outline-primary"
                            onClick={() => navigate("/student/dashboard")}
                            fullWidth
                        >
                            <ArrowLeft size={16} className="me-2" /> {t("student.exam_start.back_dashboard")}
                        </ActionButton>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    const remainingAttempts = exam.maxAttempts - exam.attemptsTaken;
    const isDeadlinePassed = new Date(exam.deadlineDate) < new Date();
    const canTake = remainingAttempts > 0 && !isDeadlinePassed;

    return (
        <div className="container max-w-lg py-4 animate-fade-in">
            <button
                onClick={() => navigate("/student/dashboard")}
                className="btn border-0 p-0 text-muted hover-text-primary d-flex align-items-center gap-1.5 mb-4"
                style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}
            >
                <ArrowLeft size={16} /> {t("student.exam_start.back_dashboard")}
            </button>

            <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="bg-primary p-4 text-white position-relative">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span
                            className="text-white-50 fw-bold text-uppercase"
                            style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                        >
                            {exam.courseName}
                        </span>
                        <span
                            className="badge rounded-pill fw-semibold border border-white-50"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "white",
                                fontSize: "0.65rem",
                                padding: "0.3em 0.7em"
                            }}
                        >
                            {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                        </span>
                    </div>
                    <h3 className="fw-bold mb-1">{exam.title}</h3>
                </div>

                <Card.Body className="p-4">
                    <div className="row g-3 mb-4">
                        <div className="col-sm-4">
                            <div className="p-3 bg-light rounded-3 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <Clock size={20} className="text-primary mb-2" />
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">
                                    {t("student.exam_start.duration")}
                                </span>
                                <strong className="fs-5 text-dark mt-0.5">{exam.maxDurationInMinutes} {t("dashboard.minutes")}</strong>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="p-3 bg-light rounded-3 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <Target size={20} className="text-primary mb-2" />
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">
                                    {t("student.exam_start.attempts")}
                                </span>
                                <strong className="fs-5 text-dark mt-0.5">{remainingAttempts} {t("student.exam_start.left")}</strong>
                                <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                                    {t("student.exam_start.max_attempts_label", { count: exam.maxAttempts })}
                                </span>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="p-3 bg-light rounded-3 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <Calendar
                                    size={20}
                                    className={isDeadlinePassed ? "text-danger mb-2" : "text-primary mb-2"}
                                />
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">
                                    {t("student.exam_start.due_date")}
                                </span>
                                <strong className={`fs-6 mt-0.5 ${isDeadlinePassed ? "text-danger" : "text-dark"}`}>
                                    {formatDate(exam.deadlineDate)}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="border-top pt-4 mb-4">
                        <h5 className="fw-bold text-secondary-800 mb-3 d-flex align-items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            {t("student.exam_start.rules_title")}
                        </h5>
                        <ul
                            className="text-secondary ps-3.5 mb-0"
                            style={{ fontSize: "var(--text-sm)", lineHeight: "1.7" }}
                        >
                            <li className="mb-2">
                                {t("student.exam_start.rule_time")}
                            </li>
                            <li className="mb-2">
                                {t("student.exam_start.rule_save")}
                            </li>
                            <li className="mb-2">
                                {t("student.exam_start.rule_submit")}
                            </li>
                            <li className="mb-2">
                                {t("student.exam_start.rule_integrity")}
                            </li>
                        </ul>
                    </div>

                    <div className="d-flex flex-column gap-2 mt-4">
                        <ActionButton
                            variant="primary"
                            onClick={handleBeginExam}
                            disabled={!canTake || submitting}
                            fullWidth
                            className="py-2.5 btn-lg"
                        >
                            {submitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    {t("student.exam_start.btn_starting")}
                                </>
                            ) : (
                                <>
                                    <PlayCircle size={18} className="me-2" />
                                    {exam.attemptsTaken > 0 ? t("student.exam_start.btn_resume") : t("student.exam_start.btn_begin")}
                                </>
                            )}
                        </ActionButton>

                        {!canTake && (
                            <Alert
                                variant="warning"
                                className="d-flex align-items-center gap-2.5 py-2.5 px-3 mb-0 text-start mt-2"
                            >
                                <AlertTriangle size={20} className="flex-shrink-0" />
                                <span style={{ fontSize: "var(--text-sm)" }}>
                                    {isDeadlinePassed
                                        ? t("student.exam_start.alert_locked_deadline")
                                        : t("student.exam_start.alert_no_attempts")}
                                </span>
                            </Alert>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ExamStartPage;
