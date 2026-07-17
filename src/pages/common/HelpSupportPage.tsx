import { AlertCircle, HelpCircle, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";

const HelpSupportPage = () => {
    const { t } = useTranslation();
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("Technical");
    const [message, setMessage] = useState("");

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t("common.support_ticket_success_toast"));
        setSubject("");
        setMessage("");
    };

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">{t("common.support_h1")}</h1>
                <p className="text-secondary">{t("common.support_p")}</p>
            </div>

            <Row className="g-4 mb-5">
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-primary-subtle p-3 text-primary">
                                <HelpCircle size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{t("common.support_card1_title")}</h5>
                            <p className="text-secondary small mb-0">
                                {t("common.support_card1_desc")}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-success-subtle p-3 text-success">
                                <Mail size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{t("common.support_card2_title")}</h5>
                            <p className="text-secondary small mb-0">
                                {t("common.support_card2_desc")}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-warning-subtle p-3 text-warning">
                                <MessageSquare size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{t("common.support_card3_title")}</h5>
                            <p className="text-secondary small mb-0">
                                {t("common.support_card3_desc")}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Accordion FAQ Area */}
                <Col xs={12} lg={6}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <HelpCircle size={22} className="text-primary" /> {t("common.support_faq_title")}
                    </h4>
                    <Accordion defaultActiveKey="0" className="border-0 rounded-4 overflow-hidden shadow-sm">
                        <Accordion.Item eventKey="0" className="border-light">
                            <Accordion.Header className="fw-semibold">
                                {t("common.support_faq_q1")}
                            </Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                {t("common.support_faq_a1")}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="border-light">
                            <Accordion.Header className="fw-semibold">
                                {t("common.support_faq_q2")}
                            </Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                {t("common.support_faq_a2")}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="border-light">
                            <Accordion.Header className="fw-semibold">
                                {t("common.support_faq_q3")}
                            </Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                {t("common.support_faq_a3")}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" className="border-light">
                            <Accordion.Header className="fw-semibold">
                                {t("common.support_faq_q4")}
                            </Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                {t("common.support_faq_a4")}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

                {/* Support Form */}
                <Col xs={12} lg={6}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <AlertCircle size={22} className="text-primary" /> {t("common.support_ticket_title")}
                    </h4>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                        <Form onSubmit={handleSubmitTicket}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">{t("common.support_ticket_category")}</Form.Label>
                                <Form.Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="rounded-3 border-light py-2"
                                >
                                    <option value="Technical">{t("common.support_ticket_cat_tech")}</option>
                                    <option value="Billing">{t("common.support_ticket_cat_billing")}</option>
                                    <option value="Academic">{t("common.support_ticket_cat_academic")}</option>
                                    <option value="Other">{t("common.support_ticket_cat_other")}</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">{t("common.support_ticket_subject")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder={t("common.support_ticket_subject_placeholder")}
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-secondary">{t("common.support_ticket_message")}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t("common.support_ticket_msg_placeholder")}
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm w-100 justify-content-center"
                            >
                                <Send size={16} /> {t("common.support_ticket_submit_btn")}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HelpSupportPage;
