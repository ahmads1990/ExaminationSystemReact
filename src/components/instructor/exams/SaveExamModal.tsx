import { useState, useEffect } from "react";
import { Modal, Form, Spinner, Row, Col, FloatingLabel } from "react-bootstrap";
import { Settings, FileText } from "lucide-react";
import ExamService from "../../../services/examService";
import CourseService from "../../../services/courseService";
import { CourseDto } from "../../../api/responses/courses/CourseDto";
import { ExamDto } from "../../../api/responses/exams/ExamDto";
import { ExamType } from "../../../enums";
import ErrorDialog from "../../common/ErrorDialog";

import toast from "react-hot-toast";

interface SaveExamModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    examToEdit: ExamDto | null;
}

export const SaveExamModal = ({ show, onHide, onSuccess, examToEdit }: SaveExamModalProps) => {
    const isEditMode = !!examToEdit;

    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isFetchingExam, setIsFetchingExam] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [courseId, setCourseId] = useState<number | "">("");
    const [title, setTitle] = useState("");
    const [examType, setExamType] = useState<ExamType | "">(isEditMode ? examToEdit.examType : "");
    const [maxDuration, setMaxDuration] = useState<string>("30");
    const [totalGrade, setTotalGrade] = useState<string>("100");
    const [passingScore, setPassingScore] = useState<string>("50");
    const [maxAttempts, setMaxAttempts] = useState<string>("1");
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [deadlineDate, setDeadlineDate] = useState("");

    const [apiError, setApiError] = useState<unknown>(null);

    // Reset or populate form when modal opens
    useEffect(() => {
        if (show) {
            fetchCourses();
            if (isEditMode && examToEdit) {
                const examId = examToEdit.id;
                fetchExamDetails(examId);
            } else {
                setCourseId("");
                setTitle("");
                setExamType("");
                setMaxDuration("30");
                setTotalGrade("100");
                setPassingScore("50");
                setMaxAttempts("1");
                setShuffleQuestions(true);
                setDeadlineDate("");
            }
        }
    }, [show, isEditMode, examToEdit]);

    const fetchExamDetails = async (id: number) => {
        setIsFetchingExam(true);
        try {
            const resp = await ExamService.getExamById(id);
            if (resp.success && resp.data) {
                const fullExam = resp.data;
                setCourseId(fullExam.courseId || "");
                setTitle(fullExam.title);
                setExamType(fullExam.examType);
                setMaxDuration(fullExam.maxDurationInMinutes.toString());
                setTotalGrade(fullExam.totalGrade.toString());
                setPassingScore(fullExam.passingScore?.toString() || "");
                setMaxAttempts(fullExam.maxAttempts?.toString() || "1");
                setShuffleQuestions(fullExam.shuffleQuestions ?? true);

                if (fullExam.deadlineDate) {
                    const d = new Date(fullExam.deadlineDate);
                    const tzOffset = d.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
                    setDeadlineDate(localISOTime);
                } else {
                    setDeadlineDate("");
                }
            }
        } catch (error) {
            console.error("Failed to load exam details", error);
            toast.error("Could not load exam settings.");
            onHide();
        } finally {
            setIsFetchingExam(false);
        }
    };

    const fetchCourses = async () => {
        setIsLoadingCourses(true);
        try {
            const res = await CourseService.getCourses({ PageIndex: 0, PageSize: 100 });
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses dropdown", error);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const validate = () => {
        if (!courseId) { toast.error("Please select a course."); return false; }
        if (!title.trim()) { toast.error("Title is required."); return false; }
        if (!examType) { toast.error("Exam type is required."); return false; }
        if (Number(maxDuration) <= 0) { toast.error("Duration must be greater than 0."); return false; }
        if (Number(totalGrade) <= 0) { toast.error("Total grade must be greater than 0."); return false; }
        if (!deadlineDate) { toast.error("Deadline date is required."); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = {
                courseID: Number(courseId),
                title: title.trim(),
                examType: examType as ExamType,
                maxDurationInMinutes: Number(maxDuration),
                totalGrade: Number(totalGrade),
                passingScore: Number(passingScore) || 0,
                maxAttempts: Number(maxAttempts) || 1,
                shuffleQuestions,
                deadlineDate: deadlineDate ? new Date(deadlineDate).toISOString() : null,
            };

            if (isEditMode && examToEdit) {
                await ExamService.updateExam({ id: examToEdit.id, ...payload }, { _skipGlobalError: true });
                toast.success("Exam updated successfully!");
            } else {
                await ExamService.createExam(payload, { _skipGlobalError: true });
                toast.success("Exam created successfully!");
            }
            onSuccess();
            onHide();
        } catch (error: any) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
                <Modal.Header className="border-0 pb-0 px-4 pt-4" closeButton>
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-3"
                            style={{ width: 44, height: 44, backgroundColor: "var(--color-primary-50)" }}
                        >
                            {isEditMode ? <Settings size={22} className="text-primary" /> : <FileText size={22} className="text-primary" />}
                        </div>
                        <div>
                            <Modal.Title className="fw-bold fs-5 mb-0">{isEditMode ? "Edit Exam" : "Create New Exam"}</Modal.Title>
                            <p className="text-muted small mb-0">{isEditMode ? "Update your exam settings" : "Configure a new examination"}</p>
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body className="px-4 pb-0 pt-4">
                    {isFetchingExam ? (
                        <div className="py-5 text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-3">Loading exam settings...</p>
                        </div>
                    ) : (
                        <Form id="save-exam-form" onSubmit={handleSubmit}>
                            <Row className="g-3 mb-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <FloatingLabel controlId="related-course" label="Related Course *">
                                            <Form.Select
                                                className="bg-light border-light-subtle"
                                                value={courseId}
                                                onChange={(e) => setCourseId(e.target.value as unknown as number)}
                                                required
                                                disabled={isEditMode} // Usually you can't reassign an exam to another course safely
                                            >
                                                <option value="" disabled>{isLoadingCourses ? "Loading courses..." : "Select a Course"}</option>
                                                {courses.map((c, idx) => (
                                                    <option key={`course-opt-${c.id || idx}`} value={c.id}>{c.title}</option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <FloatingLabel controlId="exam-title" label="Exam Title *">
                                            <Form.Control
                                                type="text"
                                                className="bg-light border-light-subtle"
                                                placeholder="e.g. Midterm Physics Quiz"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <FloatingLabel controlId="exam-type" label="Exam Type *">
                                            <Form.Select
                                                className="bg-light border-light-subtle"
                                                value={examType}
                                                onChange={(e) => setExamType(e.target.value as ExamType)}
                                                required
                                            >
                                                <option value="" disabled>Select Type</option>
                                                <option value={ExamType.Quiz}>Quiz</option>
                                                <option value={ExamType.Final}>Final Exam</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr className="my-4 border-light-subtle" />
                            <h6 className="fw-bold mb-3 text-secondary" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Grading & Duration</h6>

                            <Row className="g-3 mb-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <FloatingLabel controlId="max-duration" label="Duration (mins) *">
                                            <Form.Control type="number" min="1" className="bg-light border-light-subtle" placeholder="Duration" value={maxDuration} onChange={e => setMaxDuration(e.target.value)} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <FloatingLabel controlId="total-grade" label="Total Grade *">
                                            <Form.Control type="number" min="1" className="bg-light border-light-subtle" placeholder="Total Grade" value={totalGrade} onChange={e => setTotalGrade(e.target.value)} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <FloatingLabel controlId="passing-score" label="Passing Score *">
                                            <Form.Control type="number" min="0" className="bg-light border-light-subtle" placeholder="Passing Score" value={passingScore} onChange={e => setPassingScore(e.target.value)} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <FloatingLabel controlId="max-attempts" label="Max Attempts">
                                            <Form.Control type="number" min="1" className="bg-light border-light-subtle" placeholder="Max Attempts" value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} />
                                        </FloatingLabel>
                                        <Form.Text className="text-muted" style={{ fontSize: "0.7rem" }}>Set to 1 for finals.</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={8}>
                                    <Form.Group>
                                        <FloatingLabel controlId="deadline" label="Deadline Date *">
                                            <Form.Control type="datetime-local" className="bg-light border-light-subtle" placeholder="Deadline" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} required />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="g-3 mb-4 mt-1">
                                <Col md={12}>
                                    <Form.Check
                                        type="switch"
                                        id="shuffle-switch"
                                        label={<span className="ms-2">Shuffle Questions</span>}
                                        checked={shuffleQuestions}
                                        onChange={e => setShuffleQuestions(e.target.checked)}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>

                <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-2">
                    <button type="button" className="btn btn-secondary px-4" onClick={onHide} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" form="save-exam-form" className="btn btn-primary px-4" disabled={isSubmitting}>
                        {isSubmitting ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : "Save Exam"}
                    </button>
                </Modal.Footer>
            </Modal>

            <ErrorDialog show={!!apiError} onHide={() => setApiError(null)} error={apiError} />
        </>
    );
};

export default SaveExamModal;
