import { useState, useEffect } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { BookOpen } from "lucide-react";
import CourseService from "../../services/courseService";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import TextInput from "../common/forms/TextInput";
import TextAreaInput from "../common/forms/TextAreaInput";

interface AddCourseModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: (course: CourseDto) => void;
}

interface FormData {
    title: string;
    description: string;
    creditHours: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    creditHours?: string;
}

const AddCourseModal = ({ show, onHide, onSuccess }: AddCourseModalProps) => {
    const [formData, setFormData] = useState<FormData>({ title: "", description: "", creditHours: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (show) {
            setFormData({ title: "", description: "", creditHours: "" });
            setErrors({});
        }
    }, [show]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = "Course title is required.";
        else if (formData.title.length > 100) newErrors.title = "Course title must not exceed 100 characters.";
        
        if (!formData.description.trim()) newErrors.description = "Course description is required.";
        else if (formData.description.trim().length < 20) newErrors.description = "Course description must be at least 20 characters long.";
        else if (formData.description.length > 500) newErrors.description = "Course description must not exceed 500 characters.";
        
        const hours = parseInt(formData.creditHours);
        if (!formData.creditHours) newErrors.creditHours = "Credit hours is required.";
        else if (isNaN(hours) || hours < 1 || hours > 6) newErrors.creditHours = "Credit hours must be between 1 and 6.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const response = await CourseService.createCourse({
                title: formData.title.trim(),
                description: formData.description.trim(),
                creditHours: parseInt(formData.creditHours),
            });
            if (response.success) {
                onSuccess({ ...formData, id: response.data!, creditHours: parseInt(formData.creditHours), instructorID: 0, instructorName: "", createdDate: new Date().toISOString() });
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
            <Modal.Header
                className="border-0 pb-0 px-4 pt-4"
                closeButton
                style={{ borderBottom: "none" }}
            >
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: 44, height: 44, backgroundColor: "var(--color-primary-50)" }}
                    >
                        <BookOpen size={22} style={{ color: "var(--color-primary-600)" }} />
                    </div>
                    <div>
                        <Modal.Title className="fw-bold fs-5 mb-0">Create New Course</Modal.Title>
                        <p className="text-muted small mb-0">Fill in the details to add a new course</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="px-4 pb-0 pt-4">
                <Form id="add-course-form" onSubmit={handleSubmit}>
                    <TextInput
                        id="add-course-title"
                        name="title"
                        label="Course Title"
                        placeholder="e.g. Introduction to Computer Science"
                        value={formData.title}
                        onChange={(v: string) => setFormData((p) => ({ ...p, title: v }))}
                        error={errors.title}
                        required
                        maxLength={100}
                    />
                    <TextAreaInput
                        id="add-course-description"
                        name="description"
                        label="Description"
                        placeholder="Describe what students will learn in this course"
                        value={formData.description}
                        onChange={(v: string) => setFormData((p) => ({ ...p, description: v }))}
                        error={errors.description}
                        required
                        rows={4}
                        maxLength={500}
                    />
                    <div className="mb-3">
                        <label htmlFor="add-credit-hours" className="form-label fw-semibold" style={{ fontSize: "var(--text-sm)" }}>
                            Credit Hours
                        </label>
                        <input
                            id="add-credit-hours"
                            type="number"
                            min={1}
                            max={6}
                            className={`form-control bg-light border-light-subtle ${errors.creditHours ? "is-invalid" : ""}`}
                            placeholder="Enter credit hours (1–6)"
                            value={formData.creditHours}
                            onChange={(e) => setFormData((p) => ({ ...p, creditHours: e.target.value }))}
                        />
                        {errors.creditHours && <div className="invalid-feedback">{errors.creditHours}</div>}
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer className="border-0 px-4 pb-4 pt-3 gap-2">
                <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={onHide}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="add-course-form"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <><Spinner animation="border" size="sm" className="me-2" />Creating...</>
                    ) : (
                        "Create Course"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddCourseModal;
