import { useState, useEffect } from "react";
import { Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { Pencil } from "lucide-react";
import CourseService from "../../services/courseService";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import TextInput from "../common/forms/TextInput";
import TextAreaInput from "../common/forms/TextAreaInput";

interface EditCourseModalProps {
    show: boolean;
    onHide: () => void;
    course: CourseDto | null;
    onSuccess: (course: CourseDto) => void;
}

interface FormErrors {
    title?: string;
    description?: string;
    creditHours?: string;
    maxEnrollment?: string;
}

const EditCourseModal = ({ show, onHide, course, onSuccess }: EditCourseModalProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [creditHours, setCreditHours] = useState("");
    const [maxEnrollment, setMaxEnrollment] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (course) {
            setTitle(course.title);
            setDescription(course.description);
            setCreditHours(String(course.creditHours));
            setMaxEnrollment(String(course.maxEnrollment ?? 50));
            setErrors({});
        }
    }, [course]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!title.trim()) newErrors.title = "Course title is required.";
        else if (title.length > 100) newErrors.title = "Course title must not exceed 100 characters.";
        
        if (!description.trim()) newErrors.description = "Course description is required.";
        else if (description.trim().length < 20) newErrors.description = "Course description must be at least 20 characters long.";
        else if (description.length > 500) newErrors.description = "Course description must not exceed 500 characters.";
        
        const hours = parseInt(creditHours);
        if (!creditHours) newErrors.creditHours = "Credit hours is required.";
        else if (isNaN(hours) || hours < 1 || hours > 6) newErrors.creditHours = "Credit hours must be between 1 and 6.";

        const maxEnroll = parseInt(maxEnrollment);
        if (!maxEnrollment) newErrors.maxEnrollment = "Max enrollment limit is required.";
        else if (isNaN(maxEnroll) || maxEnroll < 1 || maxEnroll > 1000) newErrors.maxEnrollment = "Max enrollment limit must be between 1 and 1000.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !course) return;
        setIsSubmitting(true);
        try {
            const response = await CourseService.updateCourse({
                id: course.id,
                title: title.trim(),
                description: description.trim(),
                creditHours: parseInt(creditHours),
                maxEnrollment: parseInt(maxEnrollment),
            });
            if (response.success) {
                onSuccess({ ...course, title: title.trim(), description: description.trim(), creditHours: parseInt(creditHours), maxEnrollment: parseInt(maxEnrollment) });
                onHide();
            }
        } catch {
            // Global toast handles API errors
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header className="border-0 pb-0 px-4 pt-4" closeButton>
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: 44, height: 44, backgroundColor: "var(--color-accent-400)", opacity: 0.9 }}
                    >
                        <Pencil size={20} color="#fff" />
                    </div>
                    <div>
                        <Modal.Title className="fw-bold fs-5 mb-0">Edit Course</Modal.Title>
                        <p className="text-muted small mb-0" style={{ maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {course?.title}
                        </p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="px-4 pb-0 pt-4">
                <Form id="edit-course-form" onSubmit={handleSubmit}>
                    <TextInput
                        id="edit-course-title"
                        name="title"
                        label="Course Title"
                        placeholder="e.g. Introduction to Computer Science"
                        value={title}
                        onChange={setTitle}
                        error={errors.title}
                        required
                        maxLength={100}
                    />
                    <TextAreaInput
                        id="edit-course-description"
                        name="description"
                        label="Description"
                        placeholder="Describe what students will learn in this course"
                        value={description}
                        onChange={setDescription}
                        error={errors.description}
                        required
                        rows={4}
                        maxLength={500}
                    />
                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <label htmlFor="edit-credit-hours" className="form-label fw-semibold" style={{ fontSize: "var(--text-sm)" }}>
                                Credit Hours
                            </label>
                            <input
                                id="edit-credit-hours"
                                type="number"
                                min={1}
                                max={6}
                                className={`form-control bg-light border-light-subtle ${errors.creditHours ? "is-invalid" : ""}`}
                                placeholder="Enter credit hours (1–6)"
                                value={creditHours}
                                onChange={(e) => setCreditHours(e.target.value)}
                            />
                            {errors.creditHours && <div className="invalid-feedback">{errors.creditHours}</div>}
                        </Col>
                        <Col md={6}>
                            <label htmlFor="edit-max-enrollment" className="form-label fw-semibold" style={{ fontSize: "var(--text-sm)" }}>
                                Max Enrollment Limit
                            </label>
                            <input
                                id="edit-max-enrollment"
                                type="number"
                                min={1}
                                max={1000}
                                className={`form-control bg-light border-light-subtle ${errors.maxEnrollment ? "is-invalid" : ""}`}
                                placeholder="Enter max enrollment limit"
                                value={maxEnrollment}
                                onChange={(e) => setMaxEnrollment(e.target.value)}
                            />
                            {errors.maxEnrollment && <div className="invalid-feedback">{errors.maxEnrollment}</div>}
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer className="border-0 px-4 pb-4 pt-3 gap-2">
                <button type="button" className="btn btn-secondary px-4" onClick={onHide} disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" form="edit-course-form" className="btn btn-primary px-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><Spinner animation="border" size="sm" className="me-2" />Saving...</>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCourseModal;
