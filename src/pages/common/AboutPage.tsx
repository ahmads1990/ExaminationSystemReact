import { Award, Cpu, Info, ShieldAlert } from "lucide-react";
import { Card, Col, Container, Row } from "react-bootstrap";

const AboutPage = () => {
    return (
        <Container className="py-4" style={{ maxWidth: "900px" }}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-info-subtle p-3 text-info">
                        <Info size={28} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">About ExamSys</h1>
                        <span className="text-secondary small">Academic Excellence & Innovation</span>
                    </div>
                </div>

                <div className="text-secondary d-flex flex-column gap-4" style={{ lineHeight: 1.6 }}>
                    <p>
                        ExamSys is a premium, high-integrity online examination platform built to assist academic
                        institutions in conducting safe, flexible, and automated tests. We bridge the gap between
                        convenience and rigorous assessment metrics.
                    </p>

                    <Row className="g-4 mt-2">
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-primary mb-2">
                                    <Cpu size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">Automated Workflow</h6>
                                <p className="small mb-0 text-secondary">
                                    Instantly create exams, compile scores, and distribute performance diagnostics.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-success mb-2">
                                    <Award size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">Clear Metrics</h6>
                                <p className="small mb-0 text-secondary">
                                    High-fidelity student performance analytics and grading systems for instructors.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-warning mb-2">
                                    <ShieldAlert size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">Honor Safeguards</h6>
                                <p className="small mb-0 text-secondary">
                                    Auto-save caches, connection integrity tracking, and strict anti-cheat policies.
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Container>
    );
};

export default AboutPage;
