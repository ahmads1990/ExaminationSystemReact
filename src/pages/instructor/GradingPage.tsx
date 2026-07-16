import { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { User, Calendar, BookOpen, PenTool, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Submission {
    id: number;
    studentName: string;
    courseName: string;
    examTitle: string;
    submitDate: string;
    status: "Pending" | "Graded";
    score?: string;
    studentAnswers: { question: string; answer: string; maxPoints: number }[];
}

const GradingPage = () => {
    // Mock list of submissions needing grading
    const [submissions, setSubmissions] = useState<Submission[]>([
        {
            id: 1,
            studentName: "John Doe",
            courseName: "Introduction to AI (CS 401)",
            examTitle: "Midterm Exam 1",
            submitDate: "2026-07-15 14:32",
            status: "Pending",
            studentAnswers: [
                {
                    question: "Explain the difference between supervised and unsupervised learning.",
                    answer: "Supervised learning relies on labeled data which has input-output pairs to train the model, whereas unsupervised learning processes unlabeled datasets to identify hidden structures or clusters on its own.",
                    maxPoints: 10
                },
                {
                    question: "Define what a heuristic is in the context of search algorithms.",
                    answer: "A heuristic is a guiding rule or function that estimates the cost of the path from a node to the goal state, helping search algorithms like A* prioritize paths that are likely to lead to the solution faster.",
                    maxPoints: 10
                }
            ]
        },
        {
            id: 2,
            studentName: "Emma Watson",
            courseName: "Database Systems (CS 304)",
            examTitle: "Relational Algebra Quiz",
            submitDate: "2026-07-16 09:15",
            status: "Pending",
            studentAnswers: [
                {
                    question: "What is referential integrity and why is it important?",
                    answer: "It is a relational database rule ensuring that relationships between tables remain consistent. Foreign keys must always point to a valid primary key in the parent table to avoid orphaned records.",
                    maxPoints: 10
                }
            ]
        },
        {
            id: 3,
            studentName: "Jane Smith",
            courseName: "Physics I Mechanics (PHYS 101)",
            examTitle: "Newtonian Physics Quiz",
            submitDate: "2026-07-14 11:20",
            status: "Graded",
            score: "18/20",
            studentAnswers: []
        }
    ]);

    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [feedback, setFeedback] = useState("");

    const handleOpenGrading = (submission: Submission) => {
        setSelectedSubmission(submission);
        // Initialize scores
        const initialScores: { [key: number]: number } = {};
        submission.studentAnswers.forEach((_, idx) => {
            initialScores[idx] = 8; // Default mock score
        });
        setScores(initialScores);
        setFeedback("");
        setShowModal(true);
    };

    const handleScoreChange = (qIndex: number, val: number) => {
        setScores(prev => ({
            ...prev,
            [qIndex]: val
        }));
    };

    const handleSubmitGrade = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        // Calculate total score
        let earned = 0;
        let max = 0;
        selectedSubmission.studentAnswers.forEach((q, idx) => {
            earned += scores[idx] || 0;
            max += q.maxPoints;
        });

        // Update local state
        setSubmissions(prev => 
            prev.map(sub => 
                sub.id === selectedSubmission.id 
                    ? { ...sub, status: "Graded" as const, score: `${earned}/${max}` }
                    : sub
            )
        );

        toast.success(`Grade submitted: ${earned}/${max} points!`);
        setShowModal(false);
    };

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Grade Submissions</h1>
                <p className="text-secondary">Review student answers for subjective questions, assign point scores, and provide written feedback</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-0">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="bg-light text-secondary" style={{ fontSize: '0.85rem' }}>
                        <tr>
                            <th className="py-3 px-4 border-0">Student</th>
                            <th className="py-3 px-4 border-0">Course</th>
                            <th className="py-3 px-4 border-0">Exam</th>
                            <th className="py-3 px-4 border-0">Submit Date</th>
                            <th className="py-3 px-4 border-0">Status</th>
                            <th className="py-3 px-4 border-0 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.9rem' }}>
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="border-bottom border-light">
                                <td className="py-3.5 px-4 border-0">
                                    <div className="d-flex align-items-center gap-2.5">
                                        <div className="rounded-circle bg-light p-1.5 text-secondary">
                                            <User size={16} />
                                        </div>
                                        <span className="fw-semibold text-dark">{sub.studentName}</span>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4 border-0 text-secondary">{sub.courseName}</td>
                                <td className="py-3.5 px-4 border-0 text-secondary">{sub.examTitle}</td>
                                <td className="py-3.5 px-4 border-0 text-secondary">{sub.submitDate}</td>
                                <td className="py-3.5 px-4 border-0">
                                    {sub.status === "Pending" ? (
                                        <Badge bg="warning" className="text-dark px-2 py-1">Pending Review</Badge>
                                    ) : (
                                        <Badge bg="success" className="px-2 py-1">Graded ({sub.score})</Badge>
                                    )}
                                </td>
                                <td className="py-3.5 px-4 border-0 text-end">
                                    {sub.status === "Pending" ? (
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="rounded-2 px-3 fw-semibold border-0"
                                            onClick={() => handleOpenGrading(sub)}
                                        >
                                            Grade
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            disabled
                                            className="rounded-2 px-3 border-light bg-light"
                                        >
                                            Completed
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Grading Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="border-0">
                {selectedSubmission && (
                    <Form onSubmit={handleSubmitGrade}>
                        <Modal.Header closeButton className="border-light p-4">
                            <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
                                <PenTool size={20} className="text-primary" /> Grade Submission
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                            <div className="d-flex flex-wrap gap-4 mb-4 p-3 bg-light rounded-3 small text-secondary">
                                <div className="d-flex align-items-center gap-2">
                                    <User size={14} className="text-primary" />
                                    <strong className="text-dark">Student:</strong> {selectedSubmission.studentName}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <BookOpen size={14} className="text-primary" />
                                    <strong className="text-dark">Course:</strong> {selectedSubmission.courseName}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Calendar size={14} className="text-primary" />
                                    <strong className="text-dark">Date:</strong> {selectedSubmission.submitDate}
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-4">
                                {selectedSubmission.studentAnswers.map((item, idx) => (
                                    <div key={idx} className="p-3 border rounded-3 bg-white">
                                        <div className="fw-bold text-dark mb-2">Question {idx + 1}: {item.question}</div>
                                        <div className="p-3 bg-light rounded-3 text-secondary mb-3 italic">
                                            "{item.answer}"
                                        </div>
                                        
                                        <Form.Group className="d-flex align-items-center gap-3" style={{ maxWidth: "250px" }}>
                                            <Form.Label className="fw-semibold text-secondary mb-0 flex-shrink-0">Score:</Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                min={0}
                                                max={item.maxPoints}
                                                value={scores[idx] || 0}
                                                onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                                                required
                                                className="rounded-2 text-center"
                                            />
                                            <span className="text-secondary fw-semibold">/ {item.maxPoints} pts</span>
                                        </Form.Group>
                                    </div>
                                ))}
                            </div>

                            <Form.Group className="mt-4">
                                <Form.Label className="fw-semibold text-secondary">Written Feedback (Optional)</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide comments to help the student understand their score"
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-light p-4">
                            <Button variant="outline-secondary" className="rounded-3 px-4 py-2 border-light" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm">
                                <CheckCircle size={16} /> Submit Grade
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default GradingPage;
