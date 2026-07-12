import { useState, useEffect } from "react";
import { Search, Plus, BookOpen, Clock, User, CalendarDays } from "lucide-react";
import CourseService from "../../services/courseService";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { formatDate } from "../../utils/dateUtils";
import ActionButton from "../../components/common/ActionButton";
import { Spinner } from "react-bootstrap";
import AppPagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import AddCourseModal from "../../components/instructor/AddCourseModal";
import EditCourseModal from "../../components/instructor/EditCourseModal";
import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";

const CoursesPage = () => {
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

    useEffect(() => { resetPage(); }, [debouncedSearch, resetPage]);
    useEffect(() => { fetchCourses(); }, [debouncedSearch, pageIndex, pageSize]);

    // CRUD handlers
    const handleCourseCreated = (course: CourseDto) => {
        toast.success(`"${course.title}" created successfully!`);
        fetchCourses();
    };

    const handleCourseUpdated = (updated: CourseDto) => {
        toast.success(`"${updated.title}" updated successfully!`);
        setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    };

    const handleDeleteConfirm = async () => {
        if (!deleteCourse) return;
        await CourseService.deleteCourse(deleteCourse.id);
        toast.success(`"${deleteCourse.title}" deleted successfully!`);
        setDeleteCourse(null);
        fetchCourses();
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">My Courses</h2>
                    <p className="text-muted mb-0">Manage and organize your examination courses</p>
                </div>
                <ActionButton
                    variant="primary"
                    className="shadow-sm px-4"
                    fullWidth={false}
                    icon={<Plus size={18} />}
                    onClick={() => setShowAddModal(true)}
                >
                    New Course
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
                                    placeholder="Search courses by title..."
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
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                    <BookOpen size={56} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold">No courses found</h5>
                    <p className="text-muted">You haven't created any courses yet, or nothing matches your search.</p>
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
                                            {course.description || "No description provided."}
                                        </p>

                                        {/* Metadata row */}
                                        <div
                                            className="d-flex flex-wrap gap-3 pt-3 mt-auto border-top"
                                            style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
                                        >
                                            <span className="d-flex align-items-center gap-1">
                                                <Clock size={15} />
                                                {course.creditHours} Credit {course.creditHours === 1 ? "Hour" : "Hours"}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <User size={15} />
                                                {course.instructorName}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <CalendarDays size={15} />
                                                {formatDate(course.createdDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="card-footer bg-white border-0 px-4 pb-4 pt-0 d-flex gap-2">
                                        <ActionButton
                                            variant="outline-primary"
                                            onClick={() => setEditCourse(course)}
                                        >
                                            Edit
                                        </ActionButton>
                                        <ActionButton
                                            variant="outline-danger"
                                            onClick={() => setDeleteCourse(course)}
                                        >
                                            Delete
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <AppPagination
                        pageIndex={pageIndex}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Modals */}
            <AddCourseModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSuccess={handleCourseCreated}
            />
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
                title={`Delete "${deleteCourse?.title}"?`}
                description="This will permanently remove the course. This action cannot be undone."
            />
        </div>
    );
};

export default CoursesPage;
