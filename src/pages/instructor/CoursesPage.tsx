import { useState, useEffect } from "react";
import { Search, Plus, BookOpen, Clock, User, CalendarDays } from "lucide-react";
import CourseService from "../../services/courseService";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import { useDebounce } from "../../hooks/useDebounce";
import { Spinner, Pagination } from "react-bootstrap";
import toast from "react-hot-toast";

const CoursesPage = () => {
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await CourseService.getCourses({
                Title: debouncedSearch,
                PageIndex: pageIndex,
                PageSize: pageSize
            });

            if (response) {
                if (Array.isArray(response)) {
                    setCourses(response);
                    setTotalCount(response.length);
                } else {
                    setCourses(response.data || []);
                    setTotalCount(response.totalCount || 0);
                }
            }
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { setPageIndex(0); }, [debouncedSearch]);
    useEffect(() => { fetchCourses(); }, [debouncedSearch, pageIndex, pageSize]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newIndex: number) => {
        if (newIndex >= 0 && newIndex < totalPages) setPageIndex(newIndex);
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">My Courses</h2>
                    <p className="text-muted mb-0">Manage and organize your examination courses</p>
                </div>
                <button
                    className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-4 py-2"
                    onClick={() => toast("Create course coming soon!")}
                >
                    <Plus size={18} />
                    <span>New Course</span>
                </button>
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
                        {courses.map((course) => (
                            <div className="col-12 col-md-6 col-xl-4" key={course.id}>
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
                                        <button
                                            className="btn btn-outline-primary btn-sm flex-grow-1"
                                            onClick={() => toast("Edit coming soon!")}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => toast("Delete coming soon!")}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                        key={i} 
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
        </div>
    );
};

export default CoursesPage;
