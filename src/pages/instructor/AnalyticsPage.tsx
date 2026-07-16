import { Row, Col } from "react-bootstrap";
import { TrendingUp, Users, Award, BookOpen } from "lucide-react";

const AnalyticsPage = () => {
    // Mock general stats
    const stats = [
        { id: 1, label: "Total Enrolled Students", value: "348", icon: Users, color: "text-primary", bg: "bg-primary-subtle" },
        { id: 2, label: "Average Test Score", value: "82.4%", icon: Award, color: "text-success", bg: "bg-success-subtle" },
        { id: 3, label: "Average Pass Rate", value: "91.2%", icon: TrendingUp, color: "text-warning", bg: "bg-warning-subtle" },
        { id: 4, label: "Active Courses", value: "12", icon: BookOpen, color: "text-info", bg: "bg-info-subtle" }
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
                <h1 className="h3 fw-bold text-dark mb-1">Analytics & Reports</h1>
                <p className="text-secondary">Monitor course enrollment trends, average performance scores, and exam pass rates</p>
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
                                        <span className="text-secondary small fw-semibold text-uppercase tracking-wider d-block mb-1">{stat.label}</span>
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
                            <h5 className="fw-bold text-dark mb-1">Course Performance Breakdown</h5>
                            <p className="text-secondary small mb-0">Comparison of average scores and pass rates across active courses</p>
                        </div>

                        <div className="d-flex flex-column gap-4">
                            {coursePerformance.map((course, idx) => (
                                <div key={idx}>
                                    <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                                        <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: "70%" }}>{course.name}</span>
                                        <span className="text-muted fw-bold">Avg: {course.avgScore}% | Pass: {course.passRate}%</span>
                                    </div>
                                    
                                    {/* Styled CSS Bar Chart using HTML and Bootstrap progress utilities */}
                                    <div className="progress" style={{ height: "12px", borderRadius: "6px", backgroundColor: "#F3F4F6" }}>
                                        <div 
                                            className="progress-bar rounded-pill" 
                                            role="progressbar" 
                                            style={{ 
                                                width: `${course.avgScore}%`, 
                                                backgroundColor: course.avgScore >= 85 ? "#10B981" : course.avgScore >= 75 ? "#3B82F6" : "#F59E0B"
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
                            <h5 className="fw-bold text-dark mb-1">Performance Highlights</h5>
                            <p className="text-secondary small mb-0">Summary insights of academic activities</p>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 rounded-3 border bg-light-subtle d-flex align-items-start gap-3">
                                <div className="text-success mt-1"><Award size={20} /></div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Highest Average Course</div>
                                    <div className="text-secondary small">English Technical Writing (ENG 202) holds the highest class average of 92%.</div>
                                </div>
                            </div>

                            <div className="p-3 rounded-3 border bg-light-subtle d-flex align-items-start gap-3">
                                <div className="text-warning mt-1"><Users size={20} /></div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Enrollment Growth</div>
                                    <div className="text-secondary small">Enrollments grew by 18% overall this semester, leading with Database Systems.</div>
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
