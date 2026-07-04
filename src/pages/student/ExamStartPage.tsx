import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Alert, Spinner } from "react-bootstrap";
import { FileText, Clock, AlertTriangle, ArrowLeft, PlayCircle, Target, Calendar } from "lucide-react";
import StudentExamService from "../../services/studentExamService";
import { AvailableExamDto } from "../../api/responses/StudentExamResponses";
import { saveExamToken } from "../../utils/storage";
import ActionButton from "../../components/common/ActionButton";
import { EXAM_TYPE_LABELS } from "../../constants/examConstants";
import { formatDate } from "../../utils/dateUtils";
import { ApiErrorCode } from "../../api/contracts/apiErrorCode";
import toast from "react-hot-toast";

const ExamStartPage = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

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
                    const foundExam = response.data.find(e => e.examId === Number(examId));
                    if (foundExam) {
                        setExam(foundExam);
                    } else {
                        setError("Exam not found or is no longer available.");
                    }
                } else {
                    setError(response.message || "Failed to retrieve exam details.");
                }
            } catch (err) {
                console.error("Error fetching exam details:", err);
                setError("An error occurred while loading the exam details.");
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
                toast.success("Exam started! Good luck.");
                navigate("/student/exams/take");
            } else {
                setError(response.message || "Could not start the exam.");
            }
        } catch (err: any) {
            console.error("Error starting exam attempt:", err);
            const errorCode = err.response?.data?.errorCode;
            const returnedToken = err.response?.data?.data;

            if (errorCode === ApiErrorCode.HasActiveAttempt) {
                if (typeof returnedToken === "string" && returnedToken.length > 0) {
                    saveExamToken(returnedToken);
                    toast.success("Resuming active exam attempt.");
                    navigate("/student/exams/take");
                } else {
                    toast.success("Resuming active attempt...");
                    navigate("/student/exams/take");
                }
            } else if (errorCode === ApiErrorCode.MaxAttemptsExceeded) {
                setError("You have reached the maximum number of attempts for this exam.");
            } else if (errorCode === ApiErrorCode.ExamDeadlinePassed) {
                setError("The deadline to take this exam has passed.");
            } else if (errorCode === ApiErrorCode.NotEnrolledInCourse) {
                setError("You must be enrolled in the course offering this exam.");
            } else if (errorCode === ApiErrorCode.ExamNotPublished) {
                setError("This exam is not currently published.");
            } else {
                setError(err.response?.data?.message || "Failed to start the exam attempt.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-50">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">Loading exam details...</p>
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
                        <h4 className="fw-bold mb-3">Unable to Start Exam</h4>
                        <Alert variant="danger" className="text-start py-2.5 px-3">
                            {error || "We couldn't retrieve the exam info."}
                        </Alert>
                        <ActionButton variant="outline-primary" onClick={() => navigate("/student/dashboard")} fullWidth>
                            <ArrowLeft size={16} className="me-2" /> Back to Dashboard
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
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="bg-primary p-4 text-white position-relative">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="text-white-50 fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}>
                            {exam.courseName}
                        </span>
                        <span
                            className="badge rounded-pill fw-semibold border border-white-50"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "white",
                                fontSize: "0.65rem",
                                padding: "0.3em 0.7em",
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
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">Duration</span>
                                <strong className="fs-5 text-dark mt-0.5">{exam.maxDurationInMinutes} mins</strong>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="p-3 bg-light rounded-3 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <Target size={20} className="text-primary mb-2" />
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">Attempts</span>
                                <strong className="fs-5 text-dark mt-0.5">{remainingAttempts} left</strong>
                                <span className="text-muted" style={{ fontSize: "0.65rem" }}>of {exam.maxAttempts} max</span>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="p-3 bg-light rounded-3 text-center h-100 d-flex flex-column justify-content-center align-items-center">
                                <Calendar size={20} className={isDeadlinePassed ? "text-danger mb-2" : "text-primary mb-2"} />
                                <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider">Due Date</span>
                                <strong className={`fs-6 mt-0.5 ${isDeadlinePassed ? "text-danger" : "text-dark"}`}>
                                    {formatDate(exam.deadlineDate)}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="border-top pt-4 mb-4">
                        <h5 className="fw-bold text-secondary-800 mb-3 d-flex align-items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            Exam Rules & Instructions
                        </h5>
                        <ul className="text-secondary ps-3.5 mb-0" style={{ fontSize: "var(--text-sm)", lineHeight: "1.7" }}>
                            <li className="mb-2"><strong>Time Limit:</strong> Once you click "Begin Exam", the timer starts and cannot be paused. Refreshing or closing the tab will <strong>NOT</strong> stop the timer.</li>
                            <li className="mb-2"><strong>Auto-Save:</strong> Your answers are saved automatically when selected. If you lose connection, they will remain stored locally and sync when you're back.</li>
                            <li className="mb-2"><strong>Submission:</strong> You can submit early at any time. When the timer hits 0, your exam will be automatically submitted with your currently saved answers.</li>
                            <li className="mb-2"><strong>Integrity:</strong> Do not open multiple tabs or switch screens as it might violate examination policies. Ensure a stable internet connection.</li>
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
                                    Starting Exam...
                                </>
                            ) : (
                                <>
                                    <PlayCircle size={18} className="me-2" />
                                    {exam.attemptsTaken > 0 ? "Resume Exam Attempt" : "Begin Exam"}
                                </>
                            )}
                        </ActionButton>

                        {!canTake && (
                            <Alert variant="warning" className="d-flex align-items-center gap-2.5 py-2.5 px-3 mb-0 text-start mt-2">
                                <AlertTriangle size={20} className="flex-shrink-0" />
                                <span style={{ fontSize: "var(--text-sm)" }}>
                                    {isDeadlinePassed
                                        ? "This exam is locked because the deadline has passed."
                                        : "You have used all allowable attempts for this exam."}
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
