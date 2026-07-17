import { BookOpen, Clock, GraduationCap, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Card, Col, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { CourseDto } from "../../api/responses/courses/CourseDto";
import ActionButton from "../../components/common/ActionButton";
import AppPagination from "../../components/common/Pagination";
import SkeletonCard from "../../components/common/SkeletonCard";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import StudentCourseService from "../../services/studentCourseService";

const StudentCoursesPage = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { pageIndex, pageSize, totalPages, setTotalCount, handlePageChange, resetPage } = usePagination({
        defaultPageSize: 9
    });

    const fetchEnrollments = async () => {
        try {
            const resp = await StudentCourseService.getMyEnrollments({ OnlyEnrolled: true });
            const enrolled = new Set(resp.data?.map((e) => e.courseID) || []);
            setEnrolledIds(enrolled);
        } catch (err) {
            console.error("Failed to load student enrollments", err);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const resp = await StudentCourseService.getCourses({
                Title: debouncedSearch || undefined,
                PageIndex: pageIndex,
                PageSize: pageSize
            });
            setCourses(resp.data || []);
            setTotalCount(resp.totalCount || 0);
        } catch (err) {
            console.error("Failed to load courses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    useEffect(() => {
        resetPage();
    }, [debouncedSearch, resetPage]);

    useEffect(() => {
        fetchCourses();
    }, [debouncedSearch, pageIndex, pageSize]);

    const handleEnroll = async (courseId: number) => {
        setEnrollingId(courseId);
        try {
            const resp = await StudentCourseService.enrollInCourse({ courseID: courseId });
            if (resp.success) {
                toast.success(t("student.courses.success_enroll", "Successfully enrolled in the course!"));
                setEnrolledIds((prev) => {
                    const next = new Set(prev);
                    next.add(courseId);
                    return next;
                });
            } else {
                toast.error(resp.message || t("student.courses.failed_enroll", "Failed to enroll in course."));
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || t("student.courses.generic_enroll_error", "An error occurred while enrolling.");
            toast.error(errorMsg);
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <div className="container-fluid animate-fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">{t("student.courses.title")}</h2>
                    <span className="text-muted">{t("student.courses.subtitle")}</span>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-3">
                    <Row className="g-3">
                        <Col md={12} lg={4}>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0 border-end-0">
                                    <Search size={18} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 border-start-0 bg-light py-2"
                                    placeholder={t("student.courses.search_placeholder")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Courses Cards Grid */}
            {loading && courses.length === 0 ? (
                <SkeletonCard count={9} />
            ) : courses.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-0">
                    <BookOpen size={56} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold">{t("student.courses.no_courses")}</h5>
                    <p className="text-muted">{t("student.courses.no_courses_desc")}</p>
                </div>
            ) : (
                <>
                    <Row className="g-4 mb-4">
                        {courses.map((course) => {
                            const isEnrolled = enrolledIds.has(course.id);
                            return (
                                <Col key={course.id} xs={12} md={6} xl={4}>
                                    <Card className="h-100 border-0 shadow-sm card-custom hover-lift transition-all">
                                        <Card.Body className="p-4 d-flex flex-column gap-3">
                                            {/* Colored accent line */}
                                            <div
                                                className="position-absolute top-0 start-0 w-100"
                                                style={{
                                                    height: "4px",
                                                    backgroundColor: isEnrolled ? "#10b981" : "#3b82f6",
                                                    borderRadius: "8px 8px 0 0"
                                                }}
                                            />

                                            <div className="d-flex justify-content-between align-items-start gap-2 pt-2">
                                                <h5
                                                    className="fw-bold mb-0 text-dark"
                                                    style={{ minHeight: "2.8rem", lineHeight: "1.4" }}
                                                >
                                                    {course.title}
                                                </h5>
                                                <Badge
                                                    bg="light"
                                                    className="text-primary border border-primary-subtle py-1.5 px-2.5 rounded-pill fw-semibold"
                                                >
                                                    {t("student.courses.credits", { count: course.creditHours })}
                                                </Badge>
                                            </div>

                                            <p
                                                className="text-secondary small mb-0 flex-grow-1"
                                                style={{
                                                    minHeight: "3.2rem",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                {course.description || t("student.courses.no_desc")}
                                            </p>

                                            <div
                                                className="d-flex align-items-center gap-2 border-top-dashed pt-3"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <div
                                                    className="d-flex align-items-center gap-1 text-muted"
                                                    title="Instructor"
                                                >
                                                    <GraduationCap size={15} className="text-primary opacity-75" />
                                                    <span className="fw-medium">
                                                        {t("student.courses.instructor_label")}{course.instructorName || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card.Body>

                                        <Card.Footer className="bg-white border-0 px-4 pb-4 pt-0">
                                            {isEnrolled ? (
                                                <div
                                                    className="d-flex align-items-center justify-content-center bg-success-subtle text-success py-2 px-3 rounded-3 fw-bold w-100"
                                                    style={{ fontSize: "0.9rem" }}
                                                >
                                                    <Clock size={16} className="me-2" />✓ {t("student.courses.status_enrolled")}
                                                </div>
                                            ) : (
                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() => handleEnroll(course.id)}
                                                    disabled={enrollingId === course.id}
                                                    fullWidth
                                                >
                                                    {enrollingId === course.id ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        t("student.courses.btn_enroll")
                                                    )}
                                                </ActionButton>
                                            )}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>

                    {/* Pagination */}
                    <AppPagination pageIndex={pageIndex} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default StudentCoursesPage;
