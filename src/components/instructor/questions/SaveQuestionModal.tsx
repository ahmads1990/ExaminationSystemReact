import { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner, Row, Col, FloatingLabel, InputGroup } from "react-bootstrap";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import QuestionService from "../../../services/questionService";
import { QuestionDto } from "../../../api/responses/QuestionResponses";
import { QuestionLevel } from "../../../enums";
import toast from "react-hot-toast";

interface SaveQuestionModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    examId: number;
    questionToEdit: QuestionDto | null;
}

const SaveQuestionModal = ({ show, onHide, onSuccess, examId, questionToEdit }: SaveQuestionModalProps) => {
    const isEditMode = !!questionToEdit;
    
    // Form state
    const [body, setBody] = useState("");
    const [score, setScore] = useState<number>(1);
    const [questionLevel, setQuestionLevel] = useState<QuestionLevel>(QuestionLevel.Medium);
    const [choices, setChoices] = useState<{ body: string; isCorrect: boolean }[]>([]);
    
    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initialize form
    useEffect(() => {
        if (show) {
            if (isEditMode && questionToEdit) {
                setBody(questionToEdit.body);
                setScore(questionToEdit.score);
                setQuestionLevel(questionToEdit.questionLevel);
                setChoices(questionToEdit.choices);
            } else {
                // Reset to defaults with 4 empty choices, first one marked correct
                setBody("");
                setScore(1);
                setQuestionLevel(QuestionLevel.Medium);
                setChoices([
                    { body: "", isCorrect: true },
                    { body: "", isCorrect: false },
                    { body: "", isCorrect: false },
                    { body: "", isCorrect: false }
                ]);
            }
        }
    }, [show, isEditMode, questionToEdit]);

    const handleChoiceBodyChange = (index: number, newBody: string) => {
        const updatedChoices = [...choices];
        updatedChoices[index].body = newBody;
        setChoices(updatedChoices);
    };

    const handleChoiceCorrectChange = (index: number) => {
        const updatedChoices = choices.map((choice, i) => ({
            ...choice,
            isCorrect: i === index
        }));
        setChoices(updatedChoices);
    };

    const handleAddChoice = () => {
        if (choices.length >= 6) {
            toast.error("Maximum of 6 choices allowed.");
            return;
        }
        setChoices([...choices, { body: "", isCorrect: false }]);
    };

    const handleRemoveChoice = (index: number) => {
        if (choices.length <= 2) {
            toast.error("Minimum of 2 choices required.");
            return;
        }
        
        const updatedChoices = [...choices];
        const removed = updatedChoices.splice(index, 1)[0];
        
        // If we removed the correct choice, mark the first remaining one as correct
        if (removed.isCorrect && updatedChoices.length > 0) {
            updatedChoices[0].isCorrect = true;
        }
        
        setChoices(updatedChoices);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validations
        if (!body.trim()) {
            toast.error("Question body is required.");
            return;
        }
        
        if (score <= 0) {
            toast.error("Question score must be greater than 0.");
            return;
        }
        
        const emptyChoice = choices.find(c => !c.body.trim());
        if (emptyChoice) {
            toast.error("All choices must have text.");
            return;
        }
        
        const hasCorrectChoice = choices.some(c => c.isCorrect);
        if (!hasCorrectChoice) {
            // This shouldn't happen due to UI binding, but just in case
            toast.error("Select one correct choice.");
            return;
        }

        setIsSubmitting(true);
        try {
            const requestData = {
                examId,
                body,
                score,
                questionLevel,
                choices
            };

            if (isEditMode) {
                await QuestionService.updateQuestion({ id: questionToEdit.id, ...requestData });
                toast.success("Question updated successfully.");
            } else {
                await QuestionService.createQuestion(requestData);
                toast.success("Question created successfully.");
            }
            onSuccess();
            onHide();
        } catch (error) {
            // Error handling is managed globally via interceptor, but we catch to stop loading state
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">
                        {isEditMode ? "Edit Question" : "Add New Question"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Row className="g-3">
                        <Col xs={12}>
                            <FloatingLabel label="Question Body">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter question text here..."
                                    style={{ height: '100px' }}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </Col>
                        
                        <Col md={6}>
                            <FloatingLabel label="Score Points">
                                <Form.Control
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={score}
                                    onChange={(e) => setScore(Number(e.target.value))}
                                    required
                                />
                            </FloatingLabel>
                        </Col>
                        
                        <Col md={6}>
                            <FloatingLabel label="Difficulty Level">
                                <Form.Select
                                    value={questionLevel}
                                    onChange={(e) => setQuestionLevel(Number(e.target.value))}
                                >
                                    <option value={QuestionLevel.Easy}>Easy</option>
                                    <option value={QuestionLevel.Medium}>Medium</option>
                                    <option value={QuestionLevel.Hard}>Hard</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>

                        <Col xs={12} className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Choices</h6>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    onClick={handleAddChoice}
                                    disabled={choices.length >= 6}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <Plus size={16} /> Add Choice
                                </Button>
                            </div>
                            
                            <div className="d-flex flex-column gap-2">
                                {choices.map((choice, index) => (
                                    <InputGroup key={index} className={choice.isCorrect ? "border-success shadow-sm rounded-2 border" : ""}>
                                        <InputGroup.Radio 
                                            name="correctChoice"
                                            checked={choice.isCorrect}
                                            onChange={() => handleChoiceCorrectChange(index)}
                                            title="Mark as correct answer"
                                            className="mt-0"
                                            style={{ cursor: "pointer" }}
                                        />
                                        <Form.Control
                                            placeholder={`Choice ${index + 1}`}
                                            value={choice.body}
                                            onChange={(e) => handleChoiceBodyChange(index, e.target.value)}
                                            required
                                            className={choice.isCorrect ? "border-0 shadow-none bg-success-subtle" : ""}
                                        />
                                        {choice.isCorrect && (
                                            <InputGroup.Text className="bg-success text-white border-success border-start-0 py-0">
                                                <CheckCircle2 size={18} />
                                            </InputGroup.Text>
                                        )}
                                        <Button 
                                            variant="outline-danger" 
                                            onClick={() => handleRemoveChoice(index)}
                                            disabled={choices.length <= 2}
                                            title={choices.length <= 2 ? "Minimum 2 choices required" : "Remove choice"}
                                            className="border-start-0"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </InputGroup>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-top-0 pt-0">
                    <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
                        {isSubmitting ? <Spinner animation="border" size="sm" /> : "Save Question"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SaveQuestionModal;
