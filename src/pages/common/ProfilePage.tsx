import { BookOpen, Edit, FileCheck, Globe, ShieldCheck, Smartphone } from "lucide-react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = () => {
    const { user } = useAuth();

    // Default mock data if fields are not configured
    const userProfile = {
        phone: "+1 (555) 019-2834",
        timezone: "Asia/Riyadh (UTC +3:00)",
        bio: "Academic profile on ExamSys portal.",
        roleLabel: user?.role === "Instructor" ? "Instructor Account" : "Student Account",
        joinedDate: "October 12, 2025",
        status: "Active"
    };

    // Color theme based on user role
    const isInstructor = user?.role === "Instructor";
    const headerBgGradient = isInstructor
        ? "linear-gradient(135deg, #059669 0%, #047857 100%)" // Forest Green for Instructor
        : "linear-gradient(135deg, #10b981 0%, #059669 100%)"; // Emerald Green for Student

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            {/* PROFILE HEADER CARD */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                <div style={{ background: headerBgGradient, height: "140px" }} />
                <Card.Body className="px-4 pb-4 pt-0 position-relative">
                    <div
                        className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3"
                        style={{ marginTop: "-60px" }}
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=10B981&color=fff&rounded=true&size=120`}
                            alt="Avatar"
                            className="rounded-circle border border-4 border-white shadow-sm"
                            width="110"
                            height="110"
                        />
                        <div className="flex-grow-1 text-center text-md-start mb-2">
                            <h2 className="fw-bold text-dark mb-1">{user?.name || "User"}</h2>
                            <p className="text-secondary mb-0 d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
                                <span>{user?.email}</span>
                                <span className="text-muted">•</span>
                                <Badge
                                    bg="success"
                                    className="text-uppercase py-1.5 px-2.5 rounded-pill"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    {userProfile.roleLabel}
                                </Badge>
                            </p>
                        </div>
                        <div className="mb-2">
                            <Link
                                to="/settings"
                                className="btn btn-outline-secondary btn-sm rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                            >
                                <Edit size={14} /> Edit Profile
                            </Link>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* LEFT COLUMN: ABOUT / DETAILS */}
                <Col xs={12} md={5}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                        <h5 className="fw-bold text-dark mb-3">About Me</h5>
                        <p className="text-secondary small mb-4">{userProfile.bio}</p>

                        <h5 className="fw-bold text-dark mb-3">Account Details</h5>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center gap-3 p-2 bg-light-subtle rounded-3">
                                <div className="p-2 rounded-2 bg-primary-subtle text-primary">
                                    <Smartphone size={16} />
                                </div>
                                <div>
                                    <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                        Phone Number
                                    </div>
                                    <div className="fw-semibold text-dark small">{userProfile.phone}</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 p-2 bg-light-subtle rounded-3">
                                <div className="p-2 rounded-2 bg-success-subtle text-success">
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                        Timezone
                                    </div>
                                    <div className="fw-semibold text-dark small">{userProfile.timezone}</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 p-2 bg-light-subtle rounded-3">
                                <div className="p-2 rounded-2 bg-info-subtle text-info">
                                    <ShieldCheck size={16} />
                                </div>
                                <div>
                                    <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                        Status
                                    </div>
                                    <div className="fw-semibold text-success small d-flex align-items-center gap-1">
                                        <span
                                            className="bg-success rounded-circle d-inline-block"
                                            style={{ width: "6px", height: "6px" }}
                                        />
                                        Verified Member
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top text-muted small text-center text-md-start">
                            Member since: {userProfile.joinedDate}
                        </div>
                    </Card>
                </Col>

                {/* RIGHT COLUMN: ACTIVITY SUMMARY */}
                <Col xs={12} md={7}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                        {isInstructor ? (
                            <>
                                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <BookOpen size={18} className="text-primary" /> Teaching Summary
                                </h5>
                                <p className="text-secondary small mb-4">
                                    A snapshot of courses and items you administer on this platform.
                                </p>

                                <ListGroup className="rounded-3 border border-light overflow-hidden mb-3">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-white">
                                        <div>
                                            <div className="fw-semibold text-dark small">
                                                CS-101: Introduction to Computing
                                            </div>
                                            <div className="text-muted small">120 Active Students</div>
                                        </div>
                                        <Badge bg="primary" pill>
                                            Active
                                        </Badge>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-white">
                                        <div>
                                            <div className="fw-semibold text-dark small">
                                                CS-302: Database Management Systems
                                            </div>
                                            <div className="text-muted small">85 Active Students</div>
                                        </div>
                                        <Badge bg="primary" pill>
                                            Active
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>

                                <div className="bg-light p-3 rounded-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="fw-bold text-dark mb-0 small">Total Exams Released</div>
                                        <span className="text-secondary small">8 quizzes and tests administered.</span>
                                    </div>
                                    <Link
                                        to="/instructor/exams"
                                        className="btn btn-primary btn-sm rounded-2 fw-semibold px-3 py-1.5"
                                    >
                                        Manage Exams
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <FileCheck size={18} className="text-success" /> Academic Progress
                                </h5>
                                <p className="text-secondary small mb-4">
                                    Your current enrolled classes and examination achievements.
                                </p>

                                <ListGroup className="rounded-3 border border-light overflow-hidden mb-3">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-white">
                                        <div>
                                            <div className="fw-semibold text-dark small">
                                                Introduction to Machine Learning
                                            </div>
                                            <div className="text-muted small">Last Test: Grade A (94%)</div>
                                        </div>
                                        <Badge bg="success" pill>
                                            Enrolled
                                        </Badge>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-white">
                                        <div>
                                            <div className="fw-semibold text-dark small">
                                                Data Structures & Algorithms
                                            </div>
                                            <div className="text-muted small">Last Test: Grade B+ (88%)</div>
                                        </div>
                                        <Badge bg="success" pill>
                                            Enrolled
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>

                                <div className="bg-light p-3 rounded-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="fw-bold text-dark mb-0 small">Upcoming Deadlines</div>
                                        <span className="text-secondary small">
                                            CS-202 Quiz 3 is scheduled next week.
                                        </span>
                                    </div>
                                    <Link
                                        to="/student/calendar"
                                        className="btn btn-success btn-sm rounded-2 fw-semibold px-3 py-1.5"
                                    >
                                        View Calendar
                                    </Link>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
