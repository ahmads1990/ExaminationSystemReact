import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Users, FileText, ArrowRight, Plus, Search } from "lucide-react";
import { Spinner, Card, Row, Col } from "react-bootstrap";
import { useState, useMemo, useEffect, useCallback } from "react";
import useQuery from "../../hooks/useQuery";
import InstructorService from "../../services/instructorService";
import ActionButton from "../../components/common/ActionButton";
import GenericTable from "../../components/common/Table";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { SortingDirection } from "../../enums";

const DashboardPage = () => {
    const navigate = useNavigate();

    // Pagination Hook
    const {
        pageIndex,
        pageSize,
        totalCount,
        setTotalCount,
        setPageIndex,
        setPageSize,
        resetPage
    } = usePagination({ defaultPageSize: 10 });

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Sorting state
    const [orderBy, setOrderBy] = useState<string>("CourseName");
    const [sortDirection, setSortDirection] = useState<SortingDirection>(SortingDirection.Ascending);

    const handleSort = useCallback((field: string) => {
        if (orderBy === field) {
            setSortDirection(prev =>
                prev === SortingDirection.Ascending
                    ? SortingDirection.Descending
                    : SortingDirection.Ascending
            );
        } else {
            setOrderBy(field);
            setSortDirection(SortingDirection.Ascending);
        }
        resetPage();
    }, [orderBy, resetPage]);

    // Fetch stats
    const { data: response, isPending, error } = useQuery(
        () => InstructorService.getInstructorCourseStats({
            CourseName: debouncedSearch || undefined,
            PageIndex: pageIndex,
            PageSize: pageSize,
            OrderBy: orderBy,
            SortDirection: sortDirection
        }),
        [debouncedSearch, pageIndex, pageSize, orderBy, sortDirection]
    );

    const statsResponse = response?.data;
    const stats = statsResponse?.data || [];

    // Fetch all stats (unpaginated/large page size) to compute aggregate card totals correctly
    const { data: allResponse } = useQuery(
        () => InstructorService.getInstructorCourseStats({
            PageIndex: 0,
            PageSize: 1000
        }),
        []
    );
    const allStats = allResponse?.data?.data || [];

    // Track if the instructor has any courses at all
    const [hasAnyCourses, setHasAnyCourses] = useState<boolean | null>(null);

    // Sync total count and initial check
    useEffect(() => {
        if (statsResponse) {
            setTotalCount(statsResponse.totalCount || 0);
            if (hasAnyCourses === null && !debouncedSearch) {
                setHasAnyCourses((statsResponse.totalCount || 0) > 0);
            }
        }
    }, [statsResponse, setTotalCount, hasAnyCourses, debouncedSearch]);

    // Reset pagination on search change
    useEffect(() => {
        resetPage();
    }, [debouncedSearch, resetPage]);

    const handleSetPagination = useCallback((updater: any) => {
        if (typeof updater === 'function') {
            const newState = updater({ pageIndex, pageSize });
            setPageIndex(newState.pageIndex);
            if (newState.pageSize !== pageSize) {
                setPageSize(newState.pageSize);
            }
        }
    }, [pageIndex, pageSize, setPageIndex, setPageSize]);

    const columns: any[] = useMemo(() => {
        const renderSortArrow = (field: string) => {
            const isSorted = orderBy === field;
            return (
                <span className={`ms-1 ${isSorted ? 'text-primary fw-bold' : 'text-muted opacity-50'}`} style={{ fontSize: '0.65rem' }}>
                    {isSorted ? (sortDirection === SortingDirection.Ascending ? "▲" : "▼") : "▲▼"}
                </span>
            );
        };

        return [
            {
                id: "courseName",
                header: () => (
                    <div className="d-flex align-items-center cursor-pointer select-none" onClick={() => handleSort("CourseName")}>
                        Course Name {renderSortArrow("CourseName")}
                    </div>
                ),
                accessorKey: "courseName",
                size: 350,
                cell: (info: any) => (
                    <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3 text-secondary d-none d-sm-block">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <div className="fw-semibold text-secondary-800">{info.getValue()}</div>
                        </div>
                    </div>
                )
            },
            {
                id: "enrolledLimit",
                header: () => (
                    <div className="d-flex align-items-center cursor-pointer select-none" onClick={() => handleSort("StudentCount")}>
                        Enrolled / Max Limit {renderSortArrow("StudentCount")}
                    </div>
                ),
                size: 220,
                cell: ({ row }: any) => {
                    const course = row.original;
                    const limit = course.maxEnrollment ?? 50;
                    const isOverLimit = course.studentCount > limit;
                    const percentage = Math.min((course.studentCount / limit) * 100, 100);
                    const progressColor = isOverLimit ? "bg-danger" : "bg-success";

                    return (
                        <div style={{ maxWidth: "220px" }}>
                            <div className="d-flex justify-content-between align-items-baseline mb-1">
                                <div>
                                    <span className={`fw-bold ${isOverLimit ? 'text-danger fs-5' : 'text-secondary-800 fs-5'}`}>
                                        {course.studentCount}
                                    </span>
                                    <span className="text-secondary-400 ms-1" style={{ fontSize: '0.8rem' }}>
                                        / {limit}
                                    </span>
                                </div>
                                <span className={`fw-semibold ${isOverLimit ? 'text-danger' : 'text-secondary-500'}`} style={{ fontSize: '0.75rem' }}>
                                    {isOverLimit ? 'Over Limit' : `${Math.round(percentage)}%`}
                                </span>
                            </div>
                            <div className="progress rounded-pill" style={{ height: "6px", backgroundColor: "#eef2f6" }}>
                                <div
                                    className={`progress-bar ${progressColor} rounded-pill`}
                                    role="progressbar"
                                    style={{ width: `${percentage}%` }}
                                    aria-valuenow={course.studentCount}
                                    aria-valuemin={0}
                                    aria-valuemax={limit}
                                />
                            </div>
                        </div>
                    );
                }
            },
            {
                id: "examsCount",
                header: () => (
                    <div className="d-flex align-items-center justify-content-center cursor-pointer select-none" onClick={() => handleSort("ExamsCount")}>
                        Exams {renderSortArrow("ExamsCount")}
                    </div>
                ),
                accessorKey: "examsCount",
                size: 100,
                cell: (info: any) => (
                    <div className="text-center">
                        <span className="badge bg-light text-dark border fw-medium px-2.5 py-1.5">
                            {info.getValue()}
                        </span>
                    </div>
                )
            },
            {
                id: "actions",
                header: "Actions",
                size: 150,
                cell: () => (
                    <div className="text-end">
                        <Link
                            to="/instructor/exams"
                            className="btn btn-link btn-sm p-0 d-inline-flex align-items-center text-primary text-decoration-none fw-semibold gap-1 hover-gap"
                        >
                            View Exams
                            <ArrowRight size={14} className="transition-all" />
                        </Link>
                    </div>
                )
            }
        ];
    }, [orderBy, sortDirection, handleSort]);

    if (isPending) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="mb-2" />
                    <p className="text-muted">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger" role="alert">
                    <h5 className="alert-heading fw-bold">Failed to Load Dashboard</h5>
                    <p className="mb-0">{error}</p>
                </div>
            </div>
        );
    }

    // Calculate totals based on all stats correctly
    const totalCourses = totalCount;
    const totalStudents = allStats.reduce((acc, curr) => acc + curr.studentCount, 0);
    const totalExams = allStats.reduce((acc, curr) => acc + curr.examsCount, 0);

    if (hasAnyCourses === false) {
        return (
            <div className="container-fluid animate-fade-in py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Instructor Dashboard</h2>
                        <p className="text-muted mb-0">Overview of your courses, exams, and enrolled students</p>
                    </div>
                </div>

                <Card className="border-0 shadow-sm text-center p-5 mt-4">
                    <Card.Body className="py-5">
                        <BookOpen size={64} className="text-primary mb-3 opacity-75" />
                        <h4 className="fw-bold text-dark mb-2">Welcome to Your Dashboard!</h4>
                        <p className="text-muted mx-auto mb-4" style={{ maxWidth: "480px" }}>
                            It looks like you haven't created any courses yet. Create your first course to begin managing exams, questions, and reviewing student submissions.
                        </p>
                        <ActionButton
                            variant="primary"
                            icon={<Plus size={18} />}
                            className="px-4"
                            onClick={() => navigate("/instructor/courses")}
                        >
                            Create First Course
                        </ActionButton>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <div className="container-fluid animate-fade-in py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Instructor Dashboard</h2>
                    <p className="text-muted mb-0">Overview of your courses, exams, and enrolled students</p>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <Row className="g-4 mb-4">
                {/* Courses Card */}
                <Col md={4}>
                    <Card
                        className="border-0 shadow-sm rounded-4 h-100"
                        style={{
                            background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                        }}
                    >
                        <Card.Body className="d-flex align-items-center p-4">
                            <div className="flex-grow-1">
                                <span className="text-uppercase fw-bold tracking-wider" style={{ fontSize: "0.75rem", color: "#4f46e5" }}>
                                    Total Courses
                                </span>
                                <h1 className="fw-extrabold mt-2 mb-0" style={{ fontSize: '2.5rem', color: '#312e81', letterSpacing: '-0.5px' }}>
                                    {totalCourses}
                                </h1>
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center text-white"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
                                }}
                            >
                                <BookOpen size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Students Card */}
                <Col md={4}>
                    <Card
                        className="border-0 shadow-sm rounded-4 h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                        }}
                    >
                        <Card.Body className="d-flex align-items-center p-4">
                            <div className="flex-grow-1">
                                <span className="text-uppercase fw-bold tracking-wider" style={{ fontSize: "0.75rem", color: "#059669" }}>
                                    Enrolled Students
                                </span>
                                <h1 className="fw-extrabold mt-2 mb-0" style={{ fontSize: '2.5rem', color: '#064e3b', letterSpacing: '-0.5px' }}>
                                    {totalStudents}
                                </h1>
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center text-white"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)'
                                }}
                            >
                                <Users size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Exams Card */}
                <Col md={4}>
                    <Card
                        className="border-0 shadow-sm rounded-4 h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(6, 182, 212, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                        }}
                    >
                        <Card.Body className="d-flex align-items-center p-4">
                            <div className="flex-grow-1">
                                <span className="text-uppercase fw-bold tracking-wider" style={{ fontSize: "0.75rem", color: "#0891b2" }}>
                                    Total Exams
                                </span>
                                <h1 className="fw-extrabold mt-2 mb-0" style={{ fontSize: '2.5rem', color: '#164e63', letterSpacing: '-0.5px' }}>
                                    {totalExams}
                                </h1>
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center text-white"
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                    boxShadow: '0 8px 16px -4px rgba(6, 182, 212, 0.4)'
                                }}
                            >
                                <FileText size={24} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Courses Stats Breakdown Section */ }
    <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
                <h5 className="fw-bold text-dark mb-0">Courses Stats Breakdown</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Detailed metrics per course</p>
            </div>
            <div style={{ minWidth: "260px" }}>
                <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 border-0">
                        <Search size={16} className="text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0 border-0 bg-light py-1.5"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ fontSize: "0.875rem" }}
                    />
                </div>
            </div>
        </Card.Header>
        <Card.Body className="p-0">
            <GenericTable
                columns={columns}
                data={stats}
                totalCount={totalCount}
                pagination={{ pageIndex, pageSize }}
                setPagination={handleSetPagination}
                getRowId={(row) => String(row.courseId)}
                isPending={isPending}
                error={error}
            />
        </Card.Body>
    </Card>
        </div >
    );
};

export default DashboardPage;
