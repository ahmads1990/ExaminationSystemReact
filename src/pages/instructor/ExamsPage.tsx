import { CalendarDays, Clock, FileText, GraduationCap, Plus, Search, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GetExamsParams } from "../../api/requests/ExamRequests";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import { ExamDto } from "../../api/responses/exams/ExamDto";
import ActionButton from "../../components/common/ActionButton";
import EmptyState from "../../components/common/EmptyState";
import AppPagination from "../../components/common/Pagination";
import SkeletonCard from "../../components/common/SkeletonCard";
import SaveExamModal from "../../components/instructor/exams/SaveExamModal";
import {
    EXAM_STATUS_COLORS,
    EXAM_STATUS_LABELS,
    EXAM_TYPE_COLORS,
    EXAM_TYPE_LABELS
} from "../../constants/examConstants";
import { useAuth } from "../../contexts/AuthContext";
import { ExamStatus, ExamType } from "../../enums";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import CourseService from "../../services/courseService";
import ExamService from "../../services/examService";
import { formatDate } from "../../utils/dateUtils";

const ExamsPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [exams, setExams] = useState<ExamDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<ExamType | "">("");
    const [statusFilter, setStatusFilter] = useState<ExamStatus | "">("");
    const [courseFilter, setCourseFilter] = useState<number | "">("");
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { pageIndex, pageSize, totalPages, setTotalCount, handlePageChange, resetPage } = usePagination();

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [examToEdit, setExamToEdit] = useState<ExamDto | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isStatusChanging, setIsStatusChanging] = useState<number | null>(null);

    // Publish Modal States
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishDate, setPublishDate] = useState("");
    const [examIdToPublish, setExamIdToPublish] = useState<number | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const executePublish = async () => {
        if (examIdToPublish === null || !publishDate) return;
        setIsPublishing(true);
        try {
            const isoDate = new Date(publishDate).toISOString();
            const resp = await ExamService.publishExam({ id: examIdToPublish, publishDate: isoDate });
            if (resp.success) {
                toast.success(t("instructor.exams.toast_publish_success", "Exam published successfully."));
                setShowPublishModal(false);
                setPublishDate("");
                setExamIdToPublish(null);
                fetchExams();
            } else {
                toast.error(resp.message || t("instructor.exams.toast_publish_failed", "Failed to publish exam."));
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || t("instructor.exams.toast_publish_error", "An error occurred while publishing the exam.");
            toast.error(errorMsg);
        } finally {
            setIsPublishing(false);
        }
    };

    // Auth context to filter exams
    const authContext = useAuth();
    const user = authContext?.user;

    const fetchExams = async () => {
        setLoading(true);
        try {
            const params: GetExamsParams = {
                Title: debouncedSearch || undefined,
                PageIndex: pageIndex,
                PageSize: pageSize,
                InstructorId: user?.uid ? parseInt(user.uid.toString()) : undefined
            };
            if (typeFilter !== "") params.ExamType = typeFilter;
            if (statusFilter !== "") params.ExamStatus = statusFilter;
            if (courseFilter !== "") params.CourseId = courseFilter;

            const response = await ExamService.getExams(params);

            if (response) {
                setExams(response.data || []);
                setTotalCount(response.totalCount || 0);
            }
        } catch (error) {
            console.error("Failed to load exams", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await CourseService.getCourses({ PageIndex: 0, PageSize: 100 });
            setCourses(response.data || []);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    useEffect(() => {
        resetPage();
    }, [debouncedSearch, typeFilter, statusFilter, courseFilter, resetPage]);
    useEffect(() => {
        fetchExams();
    }, [debouncedSearch, typeFilter, statusFilter, courseFilter, pageIndex, pageSize]);

    const handleDelete = async (id: number) => {
        if (!confirm(t("instructor.exams.toast_delete_confirm", "Are you sure you want to delete this exam?"))) return;
        setIsDeleting(id);
        try {
            const resp = await ExamService.deleteExam(id);
            if (resp.success) {
                toast.success(t("instructor.exams.toast_delete_success", "Exam deleted successfully."));
                fetchExams();
            } else {
                toast.error(resp.message || t("instructor.exams.toast_delete_failed", "Failed to delete exam."));
            }
        } catch {
            toast.error(t("instructor.exams.toast_delete_error", "An error occurred while deleting the exam."));
        } finally {
            setIsDeleting(null);
        }
    };

    const handleStatusChange = async (exam: ExamDto, isPublished: boolean) => {
        const examId = exam.id;
        if (isPublished) {
            setIsStatusChanging(examId);
            try {
                const resp = await ExamService.unpublishExam(examId);
                if (resp.success) {
                    toast.success(t("instructor.exams.toast_unpublish_success", "Exam unpublished successfully."));
                    fetchExams();
                } else {
                    toast.error(resp.message || t("instructor.exams.toast_unpublish_failed", "Failed to unpublish exam."));
                }
            } catch {
                toast.error(t("instructor.exams.toast_unpublish_error", "An error occurred while unpublishing exam."));
            } finally {
                setIsStatusChanging(null);
            }
        } else {
            // Default value to tomorrow at 9:00 AM (ensures it is in the future)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            const y = tomorrow.getFullYear();
            const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
            const d = String(tomorrow.getDate()).padStart(2, "0");
            const h = String(tomorrow.getHours()).padStart(2, "0");
            const min = String(tomorrow.getMinutes()).padStart(2, "0");

            setPublishDate(`${y}-${m}-${d}T${h}:${min}`);
            setExamIdToPublish(examId);
            setShowPublishModal(true);
        }
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">{t("instructor.exams.title")}</h2>
                </div>
                <ActionButton
                    variant="primary"
                    className="shadow-sm px-4"
                    fullWidth={false}
                    icon={<Plus size={18} />}
                    onClick={() => {
                        setExamToEdit(null);
                        setShowSaveModal(true);
                    }}
                >
                    {t("instructor.exams.btn_new")}
                </ActionButton>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row g-3">
                        <div className="col-md-12 col-lg-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Search size={18} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 bg-light py-2"
                                    placeholder={t("instructor.exams.search_placeholder")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select bg-light py-2"
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value === "" ? "" : parseInt(e.target.value))}
                            >
                                <option value="">{t("instructor.exams.all_courses")}</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select bg-light py-2"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as ExamType | "")}
                            >
                                <option value="">{t("instructor.exams.all_types")}</option>
                                {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                                    <option key={`exam-type-${value}`} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select bg-light py-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ExamStatus | "")}
                            >
                                <option value="">{t("instructor.exams.all_statuses")}</option>
                                {Object.entries(EXAM_STATUS_LABELS).map(([value, label]) => (
                                    <option key={`exam-status-${value}`} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading && exams.length === 0 ? (
                <SkeletonCard count={6} />
            ) : exams.length === 0 ? (
                <EmptyState
                    title={t("instructor.exams.no_exams")}
                    message={t("instructor.exams.no_exams_desc")}
                    icon={FileText}
                    ctaText={t("instructor.exams.btn_create_first")}
                    onCtaClick={() => {
                        setExamToEdit(null);
                        setShowSaveModal(true);
                    }}
                />
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {exams.map((exam, index) => {
                            const typeColor = EXAM_TYPE_COLORS[exam.examType] ?? {
                                bg: "var(--surface-bg)",
                                border: "var(--color-secondary-200)",
                                text: "var(--text-secondary)"
                            };
                            const isPublished = exam.examStatus === "Published";
                            const statusColor = isPublished ? EXAM_STATUS_COLORS.published : EXAM_STATUS_COLORS.draft;
                            const examId = exam.id;
                            return (
                                <div className="col-12 col-md-6 col-xl-4" key={examId || index}>
                                    <div className="card h-100 border-0 shadow-sm card-custom hover-lift transition-all">
                                        {/* Colored accent top border */}
                                        <div
                                            className="position-absolute top-0 start-0 w-100"
                                            style={{
                                                height: "4px",
                                                backgroundColor: typeColor.border,
                                                borderRadius: "8px 8px 0 0"
                                            }}
                                        />

                                        <div className="card-body p-4 pt-5 d-flex flex-column gap-3">
                                            {/* Course Title (Small Label) */}
                                            <div className="d-flex align-items-center justify-content-between">
                                                <span
                                                    className="text-secondary fw-bold text-uppercase"
                                                    style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                                                >
                                                    {exam.courseName}
                                                </span>
                                                <div className="d-flex gap-2">
                                                    <span
                                                        className="badge rounded-pill fw-semibold"
                                                        style={{
                                                            backgroundColor: typeColor.bg,
                                                            color: typeColor.text,
                                                            fontSize: "0.7rem",
                                                            padding: "0.4em 0.8em"
                                                        }}
                                                    >
                                                        {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                                                    </span>
                                                    <span
                                                        className="badge rounded-pill fw-semibold"
                                                        style={{
                                                            backgroundColor: statusColor.bg,
                                                            color: statusColor.text,
                                                            border: `1px solid ${statusColor.border}`,
                                                            fontSize: "0.7rem",
                                                            padding: "0.35em 0.8em"
                                                        }}
                                                    >
                                                        {isPublished ? t("instructor.exams.published_label") : t("instructor.exams.draft_label")}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Exam Title */}
                                            <h5
                                                className="fw-bold mb-0 text-dark"
                                                style={{ minHeight: "2.8rem", lineHeight: "1.4" }}
                                                title={exam.title}
                                            >
                                                {exam.title}
                                            </h5>

                                            <div
                                                className="d-flex align-items-center justify-content-between pt-3 mt-auto border-top-dashed w-100"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <div
                                                    className="d-flex align-items-center gap-1 text-muted"
                                                    title="Duration"
                                                >
                                                    <Clock size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">
                                                        {exam.maxDurationInMinutes === 1
                                                            ? t("instructor.exams.duration_min", { count: exam.maxDurationInMinutes })
                                                            : t("instructor.exams.duration_mins", { count: exam.maxDurationInMinutes })}
                                                    </span>
                                                </div>
                                                <div
                                                    className="d-flex align-items-center gap-1 text-muted"
                                                    title="Total Grade"
                                                >
                                                    <GraduationCap size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">{t("instructor.exams.total_grade_pts", { count: exam.totalGrade })}</span>
                                                </div>
                                                <div
                                                    className="d-flex align-items-center gap-1 text-muted"
                                                    title="Passing Score"
                                                >
                                                    <Target size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">{t("instructor.exams.passing_score_label", { count: exam.passingScore })}</span>
                                                </div>
                                                {exam.deadlineDate && (
                                                    <div
                                                        className="d-flex align-items-center gap-1 text-muted"
                                                        title="Deadline"
                                                    >
                                                        <CalendarDays size={14} className="text-primary opacity-75" />
                                                        <span className="fw-medium">
                                                            {formatDate(exam.deadlineDate)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions with modernized buttons */}
                                        <div className="card-footer bg-white border-0 px-4 pb-4 pt-0 d-flex gap-2 flex-wrap">
                                            <ActionButton
                                                variant={isPublished ? "outline-warning" : "success"}
                                                onClick={() => handleStatusChange(exam, isPublished)}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                {isStatusChanging === examId ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : isPublished ? (
                                                    t("instructor.exams.unpublish_btn")
                                                ) : (
                                                    t("instructor.exams.publish_btn")
                                                )}
                                            </ActionButton>
                                            <ActionButton
                                                variant="primary"
                                                onClick={() => {
                                                    setExamToEdit(exam);
                                                    setShowSaveModal(true);
                                                }}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                {t("instructor.exams.btn_edit")}
                                            </ActionButton>
                                            <ActionButton
                                                variant="outline-secondary"
                                                onClick={() => navigate(`/instructor/exams/${examId}/questions`)}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                {t("instructor.exams.btn_questions")}
                                            </ActionButton>
                                            <ActionButton
                                                variant="outline-primary"
                                                onClick={() => navigate(`/instructor/exams/${examId}/submissions`)}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                {t("instructor.exams.btn_submissions")}
                                            </ActionButton>
                                            <ActionButton
                                                variant="outline-danger"
                                                onClick={() => handleDelete(examId)}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                {t("instructor.exams.btn_delete")}
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <AppPagination pageIndex={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
            {/* Save Exam Modal */}
            <SaveExamModal
                show={showSaveModal}
                onHide={() => setShowSaveModal(false)}
                examToEdit={examToEdit}
                onSuccess={() => {
                    resetPage();
                    fetchExams();
                }}
            />

            {/* Publish Date Selection Modal */}
            <Modal show={showPublishModal} onHide={() => setShowPublishModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-dark">{t("instructor.exams.publish_modal_title")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-3">
                    <p className="text-muted small mb-3">
                        {t("instructor.exams.publish_modal_desc")}
                    </p>
                    <div className="form-group">
                        <label className="form-label fw-semibold text-secondary-800" htmlFor="publish-date-input">
                            {t("instructor.exams.publish_date_label")}
                        </label>
                        <input
                            id="publish-date-input"
                            type="datetime-local"
                            className="form-control py-2 bg-light border-0"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            min={getMinDateTime()}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <ActionButton variant="outline-secondary" onClick={() => setShowPublishModal(false)}>
                        {t("instructor.exams.btn_cancel")}
                    </ActionButton>
                    <ActionButton
                        variant="success"
                        onClick={executePublish}
                        disabled={isPublishing || !publishDate}
                        fullWidth={false}
                    >
                        {isPublishing ? <Spinner animation="border" size="sm" /> : t("instructor.exams.btn_confirm_publish")}
                    </ActionButton>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExamsPage;
