import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { QuestionDto } from "../../../api/responses/QuestionResponses";
import { QuestionLevel } from "../../../enums";
import QuestionService from "../../../services/questionService";

interface SaveQuestionModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    examId: number;
    questionToEdit: QuestionDto | null;
}

const SaveQuestionModal = ({ show, onHide, onSuccess, examId, questionToEdit }: SaveQuestionModalProps) => {
    const { t } = useTranslation();
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
                let levelVal = questionToEdit.questionLevel;
                if (typeof levelVal === "string") {
                    const parsed = Number(levelVal);
                    if (!isNaN(parsed)) {
                        levelVal = parsed;
                    } else {
                        levelVal = (QuestionLevel as any)[levelVal] ?? QuestionLevel.Medium;
                    }
                }
                setQuestionLevel(levelVal);
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
            toast.error(t("instructor.exam_questions.save_toast_max_choices"));
            return;
        }
        setChoices([...choices, { body: "", isCorrect: false }]);
    };

    const handleRemoveChoice = (index: number) => {
        if (choices.length <= 2) {
            toast.error(t("instructor.exam_questions.save_toast_min_choices"));
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
            toast.error(t("instructor.exam_questions.save_toast_body_req"));
            return;
        }

        if (score <= 0) {
            toast.error(t("instructor.exam_questions.save_toast_score_req"));
            return;
        }

        const emptyChoice = choices.find((c) => !c.body.trim());
        if (emptyChoice) {
            toast.error(t("instructor.exam_questions.save_toast_choices_empty"));
            return;
        }

        const hasCorrectChoice = choices.some((c) => c.isCorrect);
        if (!hasCorrectChoice) {
            // This shouldn't happen due to UI binding, but just in case
            toast.error(t("instructor.exam_questions.save_toast_correct_req"));
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
                toast.success(t("instructor.exam_questions.save_toast_success_update"));
            } else {
                await QuestionService.createQuestion(requestData);
                toast.success(t("instructor.exam_questions.save_toast_success_create"));
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
                        {isEditMode ? t("instructor.exam_questions.save_modal_title_edit") : t("instructor.exam_questions.save_modal_title_add")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Row className="g-3">
                        <Col xs={12}>
                            <FloatingLabel label={t("instructor.exam_questions.save_label_body")}>
                                <Form.Control
                                    as="textarea"
                                    placeholder={t("instructor.exam_questions.save_placeholder_body")}
                                    style={{ height: "100px" }}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                />
                            </FloatingLabel>
                        </Col>

                        <Col md={6}>
                            <FloatingLabel label={t("instructor.exam_questions.save_label_score")}>
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
                            <FloatingLabel label={t("instructor.exam_questions.save_label_difficulty")}>
                                <Form.Select
                                    value={questionLevel}
                                    onChange={(e) => setQuestionLevel(Number(e.target.value))}
                                >
                                    <option value={QuestionLevel.Easy}>{t("instructor.exam_questions.save_difficulty_easy")}</option>
                                    <option value={QuestionLevel.Medium}>{t("instructor.exam_questions.save_difficulty_medium")}</option>
                                    <option value={QuestionLevel.Hard}>{t("instructor.exam_questions.save_difficulty_hard")}</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>

                        <Col xs={12} className="mt-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">{t("instructor.exam_questions.save_label_choices")}</h6>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleAddChoice}
                                    disabled={choices.length >= 6}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <Plus size={16} /> {t("instructor.exam_questions.save_btn_add_choice")}
                                </Button>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                {choices.map((choice, index) => (
                                    <InputGroup
                                        key={index}
                                        className={choice.isCorrect ? "border-success shadow-sm rounded-2 border" : ""}
                                    >
                                        <InputGroup.Radio
                                            name="correctChoice"
                                            checked={choice.isCorrect}
                                            onChange={() => handleChoiceCorrectChange(index)}
                                            title={t("instructor.exam_questions.save_title_correct_choice")}
                                            className="mt-0"
                                            style={{ cursor: "pointer" }}
                                        />
                                        <Form.Control
                                            placeholder={t("instructor.exam_questions.save_placeholder_choice", { num: index + 1 })}
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
                                            title={choices.length <= 2 ? t("instructor.exam_questions.save_toast_min_choices") : t("common.delete")}
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
                        {t("common.cancel")}
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
                        {isSubmitting ? <Spinner animation="border" size="sm" /> : t("instructor.exam_questions.save_btn_save")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default SaveQuestionModal;
