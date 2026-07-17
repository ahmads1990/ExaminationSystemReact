import { BookOpen, CalendarDays, Clock, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {} from "react-bootstrap";
import toast from "react-hot-toast";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import ActionButton from "../../components/common/ActionButton";
import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";
import AppPagination from "../../components/common/Pagination";
import SkeletonCard from "../../components/common/SkeletonCard";
import AddCourseModal from "../../components/instructor/AddCourseModal";
import EditCourseModal from "../../components/instructor/EditCourseModal";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import CourseService from "../../services/courseService";
import { formatDate } from "../../utils/dateUtils";

const CoursesPage = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { pageIndex, pageSize, totalPages, setTotalCount, handlePageChange, resetPage } = usePagination();

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [editCourse, setEditCourse] = useState<CourseDto | null>(null);
    const [deleteCourse, setDeleteCourse] = useState<CourseDto | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await CourseService.getCourses({
                Title: debouncedSearch,
                PageIndex: pageIndex,
                PageSize: pageSize
            });

            if (response) {
                setCourses(response.data || []);
                setTotalCount(response.totalCount || 0);
            }
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        resetPage();
    }, [debouncedSearch, resetPage]);
    useEffect(() => {
        fetchCourses();
    }, [debouncedSearch, pageIndex, pageSize]);

    // CRUD handlers
    const handleCourseCreated = (course: CourseDto) => {
        toast.success(t("instructor.courses.toast_created", { title: course.title }));
        fetchCourses();
    };

    const handleCourseUpdated = (updated: CourseDto) => {
        toast.success(t("instructor.courses.toast_updated", { title: updated.title }));
        setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    };

    const handleDeleteConfirm = async () => {
        if (!deleteCourse) return;
        await CourseService.deleteCourse(deleteCourse.id);
        toast.success(t("instructor.courses.toast_deleted", { title: deleteCourse.title }));
        setDeleteCourse(null);
        fetchCourses();
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">{t("instructor.courses.title")}</h2>
                    <p className="text-muted mb-0">{t("instructor.courses.subtitle")}</p>
                </div>
                <ActionButton
                    variant="primary"
                    className="shadow-sm px-4"
                    fullWidth={false}
                    icon={<Plus size={18} />}
                    onClick={() => setShowAddModal(true)}
                >
                    {t("instructor.courses.btn_new")}
                </ActionButton>
            </div>

            {/* Search */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Search size={18} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 bg-light py-2"
                                    placeholder={t("instructor.courses.search_placeholder")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading && courses.length === 0 ? (
                <SkeletonCard count={6} />
            ) : courses.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <BookOpen size={56} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold">{t("instructor.courses.no_courses")}</h5>
                    <p className="text-muted">{t("instructor.courses.no_courses_desc")}</p>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {courses.map((course, index) => (
                            <div className="col-12 col-md-6 col-xl-4" key={course.id || index}>
                                <div className="card h-100 border-0 shadow-sm card-custom position-relative overflow-hidden">
                                    {/* Top accent bar using primary brand color */}
                                    <div
                                        className="position-absolute top-0 start-0 w-100"
                                        style={{ height: "4px", backgroundColor: "var(--color-primary-500)" }}
                                    />

                                    <div className="card-body p-4 pt-5 d-flex flex-column gap-2">
                                        {/* Title */}
                                        <h5 className="fw-bold mb-0 lh-sm" title={course.title}>
                                            {course.title}
                                        </h5>

                                        {/* Description */}
                                        <p
                                            className="text-muted small mb-0"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                minHeight: "3.6rem"
                                            }}
                                        >
                                            {course.description || t("instructor.courses.no_desc")}
                                        </p>

                                        {/* Metadata row */}
                                        <div
                                            className="d-flex flex-wrap gap-3 pt-3 mt-auto border-top"
                                            style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
                                        >
                                            <span className="d-flex align-items-center gap-1">
                                                <Clock size={15} />
                                                {course.creditHours}{" "}
                                                {course.creditHours === 1 ? t("instructor.courses.credit_hour") : t("instructor.courses.credit_hours")}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <Users size={15} />
                                                {t("instructor.courses.max_limit", { count: course.maxEnrollment ?? 50 })}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <CalendarDays size={15} />
                                                {formatDate(course.createdDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="card-footer bg-white border-0 px-4 pb-4 pt-0 d-flex gap-2">
                                        <ActionButton variant="outline-primary" onClick={() => setEditCourse(course)}>
                                            {t("instructor.courses.btn_edit")}
                                        </ActionButton>
                                        <ActionButton variant="outline-danger" onClick={() => setDeleteCourse(course)}>
                                            {t("instructor.courses.btn_delete")}
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <AppPagination pageIndex={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}

            {/* Modals */}
            <AddCourseModal show={showAddModal} onHide={() => setShowAddModal(false)} onSuccess={handleCourseCreated} />
            <EditCourseModal
                show={editCourse !== null}
                onHide={() => setEditCourse(null)}
                course={editCourse}
                onSuccess={handleCourseUpdated}
            />
            <ConfirmDeleteDialog
                show={deleteCourse !== null}
                onHide={() => setDeleteCourse(null)}
                onConfirm={handleDeleteConfirm}
                title={t("instructor.courses.delete_title", { title: deleteCourse?.title })}
                description={t("instructor.courses.delete_desc")}
            />
        </div>
    );
};

export default CoursesPage;
