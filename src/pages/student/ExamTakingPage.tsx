import { AlertCircle, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Badge, Card, Col, Container, ProgressBar, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ExamQuestionDto } from "../../api/responses/StudentExamResponses";
import ActionButton from "../../components/common/ActionButton";
import ConfirmActionDialog from "../../components/common/ConfirmActionDialog";
import StudentExamService from "../../services/studentExamService";
import { getExamToken, removeExamToken } from "../../utils/storage";

const getRemainingSecondsFromJwt = (token: string): number => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        const payload = JSON.parse(jsonPayload);
        if (payload.exp) {
            const expTime = payload.exp * 1000;
            const remaining = Math.max(0, Math.floor((expTime - Date.now()) / 1000));
            return remaining;
        }
    } catch (e) {
        console.error("Failed to decode JWT expiration", e);
    }
    return 0;
};

const ExamTakingPage = () => {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<ExamQuestionDto[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [savingStatus, setSavingStatus] = useState<Record<number, "saved" | "saving" | "error">>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [examMeta, setExamMeta] = useState<{ title: string; courseName: string } | null>(null);

    const timerRef = useRef<any>(null);
    const answersRef = useRef(answers);
    answersRef.current = answers;

    // Redirect to dashboard if no token is found
    useEffect(() => {
        const token = getExamToken();
        if (!token) {
            toast.error("No active exam session found.");
            navigate("/student/dashboard");
        }
    }, [navigate]);

    // Load questions and restore answers from cache
    useEffect(() => {
        const initExam = async () => {
            const token = getExamToken();
            if (!token) return;

            setLoading(true);
            setError(null);

            // Fetch questions
            try {
                const res = await StudentExamService.getExamQuestions();
                if (res.success && res.data) {
                    setQuestions(res.data);

                    // Restore saved answers from localStorage if present
                    const cachedAnswers = localStorage.getItem("exam_answers_active");
                    if (cachedAnswers) {
                        try {
                            const parsed = JSON.parse(cachedAnswers);
                            setAnswers(parsed);
                            // Initialize their status as saved since they were saved in a previous session
                            const initialSavingStatus: Record<number, "saved"> = {};
                            Object.keys(parsed).forEach((qid) => {
                                initialSavingStatus[Number(qid)] = "saved";
                            });
                            setSavingStatus(initialSavingStatus);
                        } catch (e) {
                            console.error("Failed to parse cached answers", e);
                        }
                    }

                    // Decode JWT to get expiration
                    const secondsLeft = getRemainingSecondsFromJwt(token);
                    setTimeLeft(secondsLeft);

                    // Fetch exam meta from list of available exams
                    try {
                        const base64Url = token.split(".")[1];
                        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                        const jsonPayload = decodeURIComponent(
                            window
                                .atob(base64)
                                .split("")
                                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                                .join("")
                        );
                        const payload = JSON.parse(jsonPayload);
                        const examId = payload?.ExamId || payload?.examId;

                        if (examId) {
                            const examsResp = await StudentExamService.getAvailableExams();
                            if (examsResp.success && examsResp.data) {
                                const matched = examsResp.data.find((e) => e.examId === Number(examId));
                                if (matched) {
                                    setExamMeta({
                                        title: matched.title,
                                        courseName: matched.courseName
                                    });
                                }
                            }
                        }
                    } catch (metaErr) {
                        console.error("Failed to decode exam meta", metaErr);
                    }
                } else {
                    setError(res.message || "Failed to load exam questions.");
                }
            } catch (err) {
                console.error("Error loading exam:", err);
                setError("Unable to load exam. Please make sure you have an active attempt.");
            } finally {
                setLoading(false);
            }
        };

        initExam();
    }, []);

    const handleAutoSubmit = useCallback(async () => {
        if (isAutoSubmitting) return;
        setIsAutoSubmitting(true);
        toast.error("Time's up! Submitting exam automatically...", { duration: 5000 });

        try {
            const res = await StudentExamService.submitAttempt();
            removeExamToken();
            localStorage.removeItem("exam_answers_active");
            toast.success("Exam submitted successfully!");
            navigate(`/student/exams/result?attemptId=${res.data || ""}`);
        } catch (err) {
            console.error("Auto submit failed:", err);
            removeExamToken();
            localStorage.removeItem("exam_answers_active");
            toast.error("Time ran out. Attempt completed.");
            navigate("/student/dashboard");
        }
    }, [isAutoSubmitting, navigate]);

    // Set up countdown timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isAutoSubmitting) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, isAutoSubmitting, handleAutoSubmit]);

    // Warning before leaving/reloading the page
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isAutoSubmitting || submitting) return;
            e.preventDefault();
            e.returnValue = "Warning! Leaving this page will not pause the exam timer.";
            return e.returnValue;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isAutoSubmitting, submitting]);

    const handleSelectChoice = async (questionId: number, choiceId: number) => {
        if (isAutoSubmitting || submitting) return;

        // Update local answers map
        const newAnswers = { ...answers, [questionId]: choiceId };
        setAnswers(newAnswers);
        localStorage.setItem("exam_answers_active", JSON.stringify(newAnswers));

        // Update saving status to saving
        setSavingStatus((prev) => ({ ...prev, [questionId]: "saving" }));

        try {
            await StudentExamService.submitAnswer(questionId, choiceId);
            setSavingStatus((prev) => ({ ...prev, [questionId]: "saved" }));
        } catch (err) {
            console.error(`Failed to auto-save answer for question ${questionId}:`, err);
            setSavingStatus((prev) => ({ ...prev, [questionId]: "error" }));
            toast.error("Connection error. Failed to save answer to server.");
        }
    };

    const handleManualSubmit = async () => {
        setShowSubmitModal(false);
        setSubmitting(true);

        try {
            const res = await StudentExamService.submitAttempt();
            removeExamToken();
            localStorage.removeItem("exam_answers_active");
            toast.success("Exam submitted successfully!");
            navigate(`/student/exams/result?attemptId=${res.data || ""}`);
        } catch (err: any) {
            console.error("Manual submit failed:", err);
            toast.error(err.response?.data?.message || "Failed to submit the exam. Please try again.");
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted fw-semibold">Setting up your secure exam environment...</p>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <Container className="py-5">
                <Card className="border-0 shadow-sm rounded-4 text-center max-w-md mx-auto">
                    <Card.Body className="p-4">
                        <AlertCircle size={40} className="text-danger mb-3 mx-auto" />
                        <h4 className="fw-bold mb-3">Exam Error</h4>
                        <Alert variant="danger" className="py-2.5 px-3">
                            {error || "No questions found for this exam attempt."}
                        </Alert>
                        <ActionButton variant="primary" onClick={() => navigate("/student/dashboard")} fullWidth>
                            Go back to Dashboard
                        </ActionButton>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    const isTimerLow = timeLeft !== null && timeLeft < 300; // < 5 mins
    const isTimerCritical = timeLeft !== null && timeLeft < 60; // < 1 min

    return (
        <div className="d-flex flex-column min-vh-100 bg-light animate-fade-in" style={{ userSelect: "none" }}>
            {/* FIXED EXAM HEADER */}
            <header className="bg-dark text-white shadow-sm border-bottom border-secondary-800 sticky-top py-3 px-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-white-50 fw-semibold text-uppercase font-size-11">
                                {examMeta?.courseName || "Active Course"}
                            </span>
                            <span className="badge bg-danger rounded-pill fw-semibold font-size-10">
                                DO NOT REFRESH
                            </span>
                        </div>
                        <h4 className="fw-bold mb-0 text-white mt-0.5">{examMeta?.title || "Exam Attempt"}</h4>
                    </div>

                    {/* TIMER & PROGRESS */}
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center gap-3 bg-secondary-900 border border-secondary-800 rounded-3 px-3 py-2">
                            <div className="d-flex flex-column text-end">
                                <span className="text-white-50 font-size-10 text-uppercase fw-semibold tracking-wider">
                                    Remaining Time
                                </span>
                                <span
                                    className={`fs-5 fw-bold leading-none mt-0.5 d-flex align-items-center gap-1.5 ${
                                        isTimerCritical
                                            ? "text-danger animate-pulse"
                                            : isTimerLow
                                              ? "text-warning"
                                              : "text-white"
                                    }`}
                                >
                                    <Clock size={16} />
                                    {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
                                </span>
                            </div>
                        </div>

                        <ActionButton
                            variant="success"
                            onClick={() => setShowSubmitModal(true)}
                            disabled={submitting || isAutoSubmitting}
                            className="fw-bold px-4"
                        >
                            Submit Exam
                        </ActionButton>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="d-flex align-items-center gap-3 mt-3">
                    <span className="font-size-11 text-white-50 text-nowrap fw-semibold">
                        Progress: {answeredCount} of {totalQuestions} answered
                    </span>
                    <ProgressBar
                        now={progressPercent}
                        variant="success"
                        className="flex-grow-1"
                        style={{ height: "6px" }}
                    />
                </div>
            </header>

            {/* MAIN EXAM CONTAINER */}
            <div className="flex-grow-1 py-4 px-4 container-fluid max-w-7xl">
                <Row className="g-4">
                    {/* LEFT PANEL: QUESTION NAVIGATOR */}
                    <Col lg={3} className="order-2 order-lg-1">
                        <Card className="border-0 shadow-sm rounded-4 bg-white sticky-top" style={{ top: "140px" }}>
                            <Card.Body className="p-3.5">
                                <h6 className="fw-bold text-secondary-800 mb-3">Question Navigator</h6>
                                <div
                                    className="d-grid grid-cols-5 gap-2"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))"
                                    }}
                                >
                                    {questions.map((q, idx) => {
                                        const isCurrent = idx === currentIndex;
                                        const isAnswered = answers[q.questionId] !== undefined;
                                        const isSavingError = savingStatus[q.questionId] === "error";
                                        const isSaving = savingStatus[q.questionId] === "saving";

                                        let btnClass =
                                            "btn btn-sm d-flex align-items-center justify-content-center fw-semibold rounded-3 ";
                                        if (isCurrent) {
                                            btnClass += "btn-primary shadow-sm border-2 border-primary-700";
                                        } else if (isSavingError) {
                                            btnClass += "btn-danger text-white";
                                        } else if (isAnswered) {
                                            btnClass +=
                                                "btn-success text-white bg-success-subtle border-success text-success-800";
                                        } else {
                                            btnClass += "btn-outline-secondary text-secondary-600";
                                        }

                                        return (
                                            <button
                                                key={q.questionId}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={btnClass}
                                                style={{ width: "42px", height: "42px", position: "relative" }}
                                            >
                                                {idx + 1}
                                                {isSaving && (
                                                    <span className="position-absolute bottom-0 start-50 translate-middle-x mb-1">
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                            style={{
                                                                width: "8px",
                                                                height: "8px",
                                                                borderWidth: "1.5px"
                                                            }}
                                                        />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div
                                    className="border-top mt-4 pt-3 d-flex flex-column gap-2"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <span
                                            className="bg-primary rounded-circle"
                                            style={{ width: "12px", height: "12px", display: "inline-block" }}
                                        ></span>
                                        <span>Current Question</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <span
                                            className="bg-success rounded-circle"
                                            style={{ width: "12px", height: "12px", display: "inline-block" }}
                                        ></span>
                                        <span>Answered & Saved</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <span
                                            className="border border-secondary rounded-circle"
                                            style={{ width: "12px", height: "12px", display: "inline-block" }}
                                        ></span>
                                        <span>Unanswered</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <span
                                            className="bg-danger rounded-circle"
                                            style={{ width: "12px", height: "12px", display: "inline-block" }}
                                        ></span>
                                        <span>Save Error (Unsaved)</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* RIGHT PANEL: MAIN QUESTION CARD */}
                    <Col lg={9} className="order-1 order-lg-2">
                        <Card className="border-0 shadow-sm rounded-4 bg-white mb-4">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <Badge
                                            bg="secondary"
                                            className="px-2.5 py-1.5 bg-secondary-subtle text-secondary-800 rounded-pill"
                                        >
                                            Question {currentIndex + 1} of {totalQuestions}
                                        </Badge>
                                    </div>

                                    {/* SAVE STATUS INDICATOR */}
                                    <div>
                                        {savingStatus[currentQuestion.questionId] === "saving" && (
                                            <span
                                                className="text-muted d-flex align-items-center gap-1.5"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <RefreshCw size={12} className="spin text-primary" /> Saving answer...
                                            </span>
                                        )}
                                        {savingStatus[currentQuestion.questionId] === "saved" && (
                                            <span
                                                className="text-success d-flex align-items-center gap-1.5"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <CheckCircle2 size={12} /> Progress auto-saved
                                            </span>
                                        )}
                                        {savingStatus[currentQuestion.questionId] === "error" && (
                                            <span
                                                className="text-danger d-flex align-items-center gap-1.5"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <AlertTriangle size={12} /> Auto-save failed! Click again to retry.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4
                                        className="fw-bold mb-0 text-dark leading-snug"
                                        style={{ fontSize: "var(--text-lg)" }}
                                    >
                                        {currentQuestion.body}
                                    </h4>
                                </div>

                                {/* MULTIPLE CHOICE OPTIONS */}
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {currentQuestion.choices.map((choice) => {
                                        const isSelected = answers[currentQuestion.questionId] === choice.choiceId;

                                        return (
                                            <div
                                                key={choice.choiceId}
                                                onClick={() =>
                                                    handleSelectChoice(currentQuestion.questionId, choice.choiceId)
                                                }
                                                className={`p-3.5 border rounded-3 transition-all cursor-pointer d-flex align-items-start gap-3 hover-bg-light ${
                                                    isSelected
                                                        ? "border-success bg-success-subtle bg-opacity-10 text-success-900 shadow-sm"
                                                        : "border-secondary-200 bg-white text-secondary-800"
                                                }`}
                                                style={{ border: "1px solid" }}
                                            >
                                                <div className="d-flex align-items-center mt-0.5">
                                                    <input
                                                        type="radio"
                                                        name={`question-${currentQuestion.questionId}`}
                                                        checked={isSelected}
                                                        onChange={() => {}} // handled by div click
                                                        className="form-check-input text-success cursor-pointer"
                                                        style={{ transform: "scale(1.15)" }}
                                                    />
                                                </div>
                                                <div className="fw-medium font-size-14 flex-grow-1">{choice.body}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* BOTTOM NAVIGATION CONTROLS */}
                                <div className="d-flex justify-content-between border-top pt-4">
                                    <button
                                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                                        disabled={currentIndex === 0}
                                        className="btn btn-outline-secondary d-flex align-items-center gap-1.5 px-3 py-2 rounded-3"
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </button>

                                    {currentIndex < totalQuestions - 1 ? (
                                        <button
                                            onClick={() => setCurrentIndex((prev) => prev + 1)}
                                            className="btn btn-primary d-flex align-items-center gap-1.5 px-4 py-2 rounded-3"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <ActionButton
                                            variant="success"
                                            onClick={() => setShowSubmitModal(true)}
                                            disabled={submitting}
                                            className="px-4 py-2"
                                        >
                                            Submit Exam
                                        </ActionButton>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* MANUAL SUBMISSION CONFIRMATION DIALOG */}
            <ConfirmActionDialog
                show={showSubmitModal}
                onHide={() => setShowSubmitModal(false)}
                onConfirm={handleManualSubmit}
                title="Submit Exam?"
                description={`You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to finish and submit? You cannot make any more changes after submitting.`}
                confirmLabel="Yes, Submit"
                confirmVariant="success"
                icon={<CheckCircle2 size={32} className="text-success" />}
                iconBgColor="#ecfdf5"
            />
        </div>
    );
};

export default ExamTakingPage;
