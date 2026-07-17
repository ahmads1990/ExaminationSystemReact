import { AlertCircle, Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/dateUtils";

const CalendarPage = () => {
    const { t } = useTranslation();

    // Mock upcoming events list
    const events = [
        {
            id: 1,
            title: t("student.calendar.mock_event_1_title", "Physics I Midterm Exam"),
            course: "Physics 101",
            date: new Date("2026-07-20T10:00:00"),
            duration: `120 ${t("dashboard.minutes")}`,
            type: "Midterm",
            status: "urgent",
            location: t("student.calendar.mock_event_1_loc", "Online (ExamSys Portal)")
        },
        {
            id: 2,
            title: t("student.calendar.mock_event_2_title", "Database Systems Quiz 2"),
            course: "CS 304",
            date: new Date("2026-07-22T14:00:00"),
            duration: `30 ${t("dashboard.minutes")}`,
            type: "Quiz",
            status: "upcoming",
            location: t("student.calendar.mock_event_2_loc", "Online (ExamSys Portal)")
        },
        {
            id: 3,
            title: t("student.calendar.mock_event_3_title", "Calculus III Practice Exam"),
            course: "Math 201",
            date: new Date("2026-07-25T09:00:00"),
            duration: `90 ${t("dashboard.minutes")}`,
            type: "Practice",
            status: "upcoming",
            location: t("student.calendar.mock_event_3_loc", "Self-Paced Practice")
        },
        {
            id: 4,
            title: t("student.calendar.mock_event_4_title", "English Technical Writing Final"),
            course: "ENG 202",
            date: new Date("2026-07-29T16:00:00"),
            duration: `180 ${t("dashboard.minutes")}`,
            type: "Final",
            status: "scheduled",
            location: t("student.calendar.mock_event_4_loc", "Online (ExamSys Portal)")
        }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "urgent":
                return (
                    <Badge bg="danger" className="px-2 py-1">
                        {t("student.calendar.status_urgent")}
                    </Badge>
                );
            case "upcoming":
                return (
                    <Badge bg="warning" className="px-2 py-1 text-dark">
                        {t("student.calendar.status_upcoming")}
                    </Badge>
                );
            default:
                return (
                    <Badge bg="primary" className="px-2 py-1">
                        {t("student.calendar.status_scheduled")}
                    </Badge>
                );
        }
    };

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">{t("student.calendar.title")}</h1>
                <p className="text-secondary">
                    {t("student.calendar.subtitle")}
                </p>
            </div>

            <Row className="g-4">
                {/* Event Schedule List */}
                <Col xs={12} lg={8}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <Calendar size={22} className="text-primary" /> {t("student.calendar.upcoming")}
                    </h4>
                    <div className="d-flex flex-column gap-3">
                        {events.map((event) => (
                            <Card key={event.id} className="border-0 shadow-sm rounded-4 bg-white overflow-hidden p-1">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2 flex-wrap">
                                        <div>
                                            <span className="text-muted small fw-semibold text-uppercase tracking-wider">
                                                {event.course}
                                            </span>
                                            <h5 className="fw-bold text-dark mt-1 mb-0">{event.title}</h5>
                                        </div>
                                        {getStatusBadge(event.status)}
                                    </div>

                                    <Row className="g-3 mt-2 text-secondary small">
                                        <Col xs={12} sm={6} md={4} className="d-flex align-items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            <span>{formatDate(event.date.toISOString())}</span>
                                        </Col>
                                        <Col xs={12} sm={6} md={4} className="d-flex align-items-center gap-2">
                                            <Clock size={14} className="text-primary" />
                                            <span>{event.duration}</span>
                                        </Col>
                                        <Col xs={12} sm={6} md={4} className="d-flex align-items-center gap-2">
                                            <MapPin size={14} className="text-primary" />
                                            <span>{event.location}</span>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Col>

                {/* Quick Reminders Panel */}
                <Col xs={12} lg={4}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <AlertCircle size={22} className="text-primary" /> {t("student.calendar.reminders")}
                    </h4>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                        <ListGroup variant="flush" className="gap-3">
                            <ListGroup.Item className="border-0 p-0 d-flex gap-3 align-items-start">
                                <div className="rounded-circle bg-danger-subtle p-2 text-danger mt-1">
                                    <AlertCircle size={16} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                                        {t("student.calendar.reminder_exam_title")}
                                    </div>
                                    <div className="text-secondary small">
                                        {t("student.calendar.reminder_exam_desc")}
                                    </div>
                                </div>
                            </ListGroup.Item>

                            <ListGroup.Item className="border-0 p-0 d-flex gap-3 align-items-start">
                                <div className="rounded-circle bg-success-subtle p-2 text-success mt-1">
                                    <CheckCircle size={16} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>
                                        {t("student.calendar.reminder_grades_title")}
                                    </div>
                                    <div className="text-secondary small">
                                        {t("student.calendar.reminder_grades_desc")}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CalendarPage;
