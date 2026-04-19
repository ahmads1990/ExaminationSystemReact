import { useState, useEffect } from "react";
import { Search, Plus, FileText, Clock, CalendarDays, GraduationCap, Target } from "lucide-react";
import ExamService from "../../services/examService";
import { ExamDto } from "../../api/responses/exams/ExamDto";
import { ExamType, ExamStatus } from "../../enums";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import CourseService from "../../services/courseService";
import { formatDate } from "../../utils/dateUtils";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import ActionButton from "../../components/common/ActionButton";
import { Spinner, Pagination } from "react-bootstrap";
import { EXAM_TYPE_LABELS, EXAM_TYPE_COLORS, EXAM_STATUS_COLORS, EXAM_STATUS_LABELS } from "../../constants/examConstants";
import SaveExamModal from "../../components/instructor/exams/SaveExamModal";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ExamsPage = () => {
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
    
    // Auth context to filter exams
    const authContext = useAuth();
    const user = authContext?.user;

    const fetchExams = async () => {
        setLoading(true);
        try {
            const params: any = {
                Title: debouncedSearch || undefined,
                PageIndex: pageIndex,
                PageSize: pageSize,
                InstructorId: user?.uid ? parseInt(user.uid.toString()) : undefined,
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

    useEffect(() => { fetchCourses(); }, []);
    useEffect(() => { resetPage(); }, [debouncedSearch, typeFilter, statusFilter, courseFilter, resetPage]);
    useEffect(() => { fetchExams(); }, [debouncedSearch, typeFilter, statusFilter, courseFilter, pageIndex, pageSize]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this exam?")) return;
        setIsDeleting(id);
        try {
            const resp = await ExamService.deleteExam(id);
            if (resp.success) {
                toast.success("Exam deleted successfully.");
                fetchExams();
            } else {
                toast.error(resp.message || "Failed to delete exam.");
            }
        } catch {
            toast.error("An error occurred while deleting the exam.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleStatusChange = async (exam: ExamDto, isPublished: boolean) => {
        const examId = exam.id;
        setIsStatusChanging(examId);
        try {
            if (isPublished) {
                const resp = await ExamService.unpublishExam(examId);
                if (resp.success) {
                    toast.success("Exam unpublished successfully.");
                    fetchExams();
                } else {
                    toast.error(resp.message || "Failed to unpublish exam.");
                }
            } else {
                const resp = await ExamService.publishExam({ id: examId, publishDate: new Date().toISOString() });
                if (resp.success) {
                    toast.success("Exam published successfully.");
                    fetchExams();
                } else {
                    toast.error(resp.message || "Failed to publish exam.");
                }
            }
        } catch {
            toast.error("An error occurred while changing exam status.");
        } finally {
            setIsStatusChanging(null);
        }
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">My Exams</h2>
                </div>
                <ActionButton
                    variant="primary"
                    className="shadow-sm px-4"
                    fullWidth={false}
                    icon={<Plus size={18} />}
                    onClick={() => { setExamToEdit(null); setShowSaveModal(true); }}
                >
                    New Exam
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
                                    placeholder="Search by title..."
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
                                <option value="">All Courses</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select bg-light py-2"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value as ExamType | "")}
                            >
                                <option value="">All Types</option>
                                {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                                    <option key={`exam-type-${value}`} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 col-lg-3">
                            <select
                                className="form-select bg-light py-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ExamStatus | "")}
                            >
                                <option value="">All Statuses</option>
                                {Object.entries(EXAM_STATUS_LABELS).map(([value, label]) => (
                                    <option key={`exam-status-${value}`} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading && exams.length === 0 ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : exams.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <FileText size={56} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold">No exams found</h5>
                    <p className="text-muted">You haven't created any exams yet, or nothing matches your filters.</p>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {exams.map((exam, index) => {
                            const typeColor = EXAM_TYPE_COLORS[exam.examType] ?? { bg: "var(--surface-bg)", border: "var(--color-secondary-200)", text: "var(--text-secondary)" };
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
                                                <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}>
                                                    {exam.courseName}
                                                </span>
                                                <div className="d-flex gap-2">
                                                     <span
                                                        className="badge rounded-pill fw-semibold"
                                                        style={{
                                                            backgroundColor: typeColor.bg,
                                                            color: typeColor.text,
                                                            fontSize: "0.7rem",
                                                            padding: "0.4em 0.8em",
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
                                                        {isPublished ? "Published" : "Draft"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Exam Title */}
                                            <h5 className="fw-bold mb-0 text-dark" style={{ minHeight: "2.8rem", lineHeight: "1.4" }} title={exam.title}>
                                                {exam.title}
                                            </h5>

                                            <div className="d-flex align-items-center justify-content-between pt-3 mt-auto border-top-dashed w-100" style={{ fontSize: "var(--text-xs)" }}>
                                                <div className="d-flex align-items-center gap-1 text-muted" title="Duration">
                                                    <Clock size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">{exam.maxDurationInMinutes} min</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1 text-muted" title="Total Grade">
                                                    <GraduationCap size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">{exam.totalGrade} pts</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1 text-muted" title="Passing Score">
                                                    <Target size={14} className="text-primary opacity-75" />
                                                    <span className="fw-medium">Pass: {exam.passingScore}</span>
                                                </div>
                                                {exam.deadlineDate && (
                                                    <div className="d-flex align-items-center gap-1 text-muted" title="Deadline">
                                                        <CalendarDays size={14} className="text-primary opacity-75" />
                                                        <span className="fw-medium">{formatDate(exam.deadlineDate)}</span>
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
                                                {isStatusChanging === examId ? <Spinner animation="border" size="sm" /> : (isPublished ? "Unpublish" : "Publish")}
                                            </ActionButton>
                                            <ActionButton
                                                variant="primary"
                                                onClick={() => { setExamToEdit(exam); setShowSaveModal(true); }}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                Edit
                                            </ActionButton>
                                            <ActionButton
                                                variant="outline-secondary"
                                                onClick={() => {/* TODO: link to questions */}}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                Questions
                                            </ActionButton>
                                            <ActionButton
                                                variant="outline-danger"
                                                onClick={() => handleDelete(examId)}
                                                disabled={isDeleting === examId || isStatusChanging === examId}
                                            >
                                                Delete
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4 mb-5">
                            <Pagination>
                                <Pagination.Prev
                                    onClick={() => handlePageChange(pageIndex - 1)}
                                    disabled={pageIndex === 0}
                                />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item
                                        key={`page-${i}`}
                                        active={i === pageIndex}
                                        onClick={() => handlePageChange(i)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => handlePageChange(pageIndex + 1)}
                                    disabled={pageIndex === totalPages - 1}
                                />
                            </Pagination>
                        </div>
                    )}
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
        </div>
    );
};

export default ExamsPage;
