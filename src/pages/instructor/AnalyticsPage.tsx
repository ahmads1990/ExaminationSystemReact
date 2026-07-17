import { Award, BookOpen, TrendingUp, Users } from "lucide-react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const AnalyticsPage = () => {
    const { t } = useTranslation();

    // General stats
    const stats = [
        {
            id: 1,
            label: t("instructor.analytics.stat_total_enrolled"),
            value: "348",
            icon: Users,
            color: "text-primary",
            bg: "bg-primary-subtle"
        },
        {
            id: 2,
            label: t("instructor.analytics.stat_avg_score"),
            value: "82.4%",
            icon: Award,
            color: "text-success",
            bg: "bg-success-subtle"
        },
        {
            id: 3,
            label: t("instructor.analytics.stat_avg_pass_rate"),
            value: "91.2%",
            icon: TrendingUp,
            color: "text-warning",
            bg: "bg-warning-subtle"
        },
        { id: 4, label: t("instructor.analytics.stat_active_courses"), value: "12", icon: BookOpen, color: "text-info", bg: "bg-info-subtle" }
    ];

    // Mock bar chart details (Course Performances)
    const coursePerformance = [
        { name: "Database Systems (CS 304)", avgScore: 86, passRate: 94 },
        { name: "Physics I Mechanics (PHYS 101)", avgScore: 74, passRate: 85 },
        { name: "Introduction to AI (CS 401)", avgScore: 88, passRate: 97 },
        { name: "Calculus III (MATH 201)", avgScore: 78, passRate: 88 },
        { name: "English Technical Writing (ENG 202)", avgScore: 92, passRate: 100 }
    ];

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1100px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">{t("instructor.analytics.title")}</h1>
                <p className="text-secondary">
                    {t("instructor.analytics.subtitle")}
                </p>
            </div>

            {/* General Stats Grid */}
            <Row className="g-3 mb-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Col key={stat.id} xs={12} sm={6} lg={3}>
                            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span className="text-secondary small fw-semibold text-uppercase tracking-wider d-block mb-1">
                                            {stat.label}
                                        </span>
                                        <h3 className="fw-bold text-dark mb-0">{stat.value}</h3>
                                    </div>
                                    <div className={`rounded-circle p-3 ${stat.color} ${stat.bg}`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>

            <Row className="g-4">
                {/* Visual Bar Chart Course Performances */}
                <Col xs={12} lg={7}>
                    <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                        <div className="mb-4">
                            <h5 className="fw-bold text-dark mb-1">{t("instructor.analytics.performance_breakdown")}</h5>
                            <p className="text-secondary small mb-0">
                                {t("instructor.analytics.performance_breakdown_desc")}
                            </p>
                        </div>

                        <div className="d-flex flex-column gap-4">
                            {coursePerformance.map((course, idx) => (
                                <div key={idx}>
                                    <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                                        <span
                                            className="fw-semibold text-dark text-truncate"
                                            style={{ maxWidth: "70%" }}
                                        >
                                            {course.name}
                                        </span>
                                        <span className="text-muted fw-bold">
                                            {t("instructor.analytics.performance_avg")}: {course.avgScore}% | {t("instructor.analytics.performance_pass")}: {course.passRate}%
                                        </span>
                                    </div>

                                    {/* Styled CSS Bar Chart using HTML and Bootstrap progress utilities */}
                                    <div
                                        className="progress"
                                        style={{ height: "12px", borderRadius: "6px", backgroundColor: "#F3F4F6" }}
                                    >
                                        <div
                                            className="progress-bar rounded-pill"
                                            role="progressbar"
                                            style={{
                                                width: `${course.avgScore}%`,
                                                backgroundColor:
                                                    course.avgScore >= 85
                                                        ? "#10B981"
                                                        : course.avgScore >= 75
                                                          ? "#3B82F6"
                                                          : "#F59E0B"
                                            }}
                                            aria-valuenow={course.avgScore}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Performance Summary Cards */}
                <Col xs={12} lg={5}>
                    <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                        <div className="mb-4">
                            <h5 className="fw-bold text-dark mb-1">{t("instructor.analytics.highlights")}</h5>
                            <p className="text-secondary small mb-0">{t("instructor.analytics.highlights_desc")}</p>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 rounded-3 border bg-light-subtle d-flex align-items-start gap-3">
                                <div className="text-success mt-1">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                                        {t("instructor.analytics.highlight_highest_course")}
                                    </div>
                                    <div className="text-secondary small">
                                        {t("instructor.analytics.highlight_highest_course_desc")}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-3 border bg-light-subtle d-flex align-items-start gap-3">
                                <div className="text-warning mt-1">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                                        {t("instructor.analytics.highlight_enrollment_growth")}
                                    </div>
                                    <div className="text-secondary small">
                                        {t("instructor.analytics.highlight_enrollment_growth_desc")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AnalyticsPage;
