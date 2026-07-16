import { AlertTriangle, Award, CheckCircle2, Clock, LayoutDashboard, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiErrorCode } from "../../api/contracts/apiErrorCode";
import { AttemptResultDto } from "../../api/responses/StudentExamResponses";
import ActionButton from "../../components/common/ActionButton";
import StudentExamService from "../../services/studentExamService";

const ExamResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const attemptId = searchParams.get("attemptId");

    const [result, setResult] = useState<AttemptResultDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGrading, setIsGrading] = useState(false);

    useEffect(() => {
        const fetchResult = async () => {
            if (!attemptId) {
                setError("No attempt ID was specified.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setIsGrading(false);

            try {
                const res = await StudentExamService.getExamResult(Number(attemptId));
                if (res.success && res.data) {
                    setResult(res.data);
                } else {
                    setError(res.message || "Failed to retrieve exam results.");
                }
            } catch (err: any) {
                console.error("Error fetching exam result:", err);
                const errorCode = err.response?.data?.errorCode;

                if (errorCode === ApiErrorCode.GradingInProgress) {
                    setIsGrading(true);
                } else if (errorCode === ApiErrorCode.AttemptNotCompleted) {
                    setError("This exam attempt has not been completed or submitted yet.");
                } else {
                    setError(err.response?.data?.message || "Failed to fetch attempt details.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">Loading exam results...</p>
            </div>
        );
    }

    if (isGrading) {
        return (
            <div className="container max-w-md py-5 animate-fade-in">
                <Card className="border-0 shadow-sm rounded-4 text-center">
                    <Card.Body className="p-5">
                        <div className="bg-warning-subtle text-warning rounded-circle p-3.5 d-inline-flex mb-4">
                            <Clock size={36} className="animate-spin" style={{ animationDuration: "3s" }} />
                        </div>
                        <h4 className="fw-bold mb-2">Grading in Progress</h4>
                        <p className="text-muted small mb-4">
                            Your submission is currently being processed and graded by the system. Please check back in
                            a few minutes.
                        </p>
                        <div className="d-flex gap-2 flex-column">
                            <ActionButton variant="primary" onClick={() => navigate("/student/dashboard")} fullWidth>
                                <LayoutDashboard size={16} className="me-2" /> Go to Dashboard
                            </ActionButton>
                            <ActionButton
                                variant="outline-secondary"
                                onClick={() => {
                                    setLoading(true);
                                    window.location.reload();
                                }}
                                fullWidth
                            >
                                Refresh Status
                            </ActionButton>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="container max-w-md py-5 animate-fade-in">
                <Card className="border-0 shadow-sm rounded-4 text-center">
                    <Card.Body className="p-4">
                        <AlertTriangle size={36} className="text-danger mb-3 mx-auto" />
                        <h4 className="fw-bold mb-3">Result Error</h4>
                        <Alert variant="danger" className="py-2.5 px-3 mb-4">
                            {error || "Unable to display results for this attempt."}
                        </Alert>
                        <ActionButton variant="primary" onClick={() => navigate("/student/dashboard")} fullWidth>
                            Back to Dashboard
                        </ActionButton>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    const percentage = result.maxGrade > 0 ? Math.round((result.currentGrade / result.maxGrade) * 100) : 0;

    return (
        <div className="container max-w-md py-5 animate-fade-in">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                {/* Result header banner */}
                <div className={`p-5 text-white text-center ${result.isPassed ? "bg-success" : "bg-danger"}`}>
                    <div className="mb-3">
                        {result.isPassed ? (
                            <CheckCircle2 size={56} className="text-white" />
                        ) : (
                            <XCircle size={56} className="text-white" />
                        )}
                    </div>
                    <h3 className="fw-bold mb-1">{result.isPassed ? "Congratulations!" : "Attempt Completed"}</h3>
                    <p className="mb-0 text-white-50 font-size-14">
                        {result.isPassed
                            ? "You passed the examination successfully."
                            : "You did not achieve the required passing score."}
                    </p>
                </div>

                <Card.Body className="p-4">
                    {/* Score display circle */}
                    <div className="text-center py-4 my-2 border-bottom">
                        <span className="text-muted d-block font-size-11 text-uppercase fw-semibold tracking-wider mb-1">
                            Your Score
                        </span>
                        <div className="d-flex align-items-baseline justify-content-center">
                            <span className="display-4 fw-extrabold text-dark leading-none">{result.currentGrade}</span>
                            <span className="fs-5 text-muted ms-1">/ {result.maxGrade}</span>
                        </div>
                        <span
                            className={`badge rounded-pill mt-3 px-3 py-1.5 fw-bold ${result.isPassed ? "bg-success-subtle text-success-800" : "bg-danger-subtle text-danger-800"}`}
                        >
                            {percentage}% Grade — {result.isPassed ? "PASSED" : "FAILED"}
                        </span>
                    </div>

                    {/* Attempt statistics */}
                    <div className="d-flex flex-column gap-3 py-3 border-bottom mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted d-flex align-items-center gap-1.5 font-size-13">
                                <Award size={16} className="text-primary" /> Grade Status
                            </span>
                            <strong
                                className={result.isPassed ? "text-success font-size-14" : "text-danger font-size-14"}
                            >
                                {result.isPassed ? "Passed" : "Needs Review"}
                            </strong>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted d-flex align-items-center gap-1.5 font-size-13">
                                <Clock size={16} className="text-primary" /> Completion Time
                            </span>
                            <strong className="text-dark font-size-14">{result.completionTime || "N/A"}</strong>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <ActionButton
                            variant="primary"
                            onClick={() => navigate("/student/dashboard")}
                            fullWidth
                            className="py-2.5"
                        >
                            <LayoutDashboard size={16} className="me-2" /> Go to Dashboard
                        </ActionButton>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ExamResultPage;
