import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";

const ContactPage = () => {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmitContact = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t("common.contact_success_toast"));
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <Container className="py-4" style={{ maxWidth: "900px" }}>
            <Row className="g-4">
                {/* Contact Info Panel */}
                <Col xs={12} md={5}>
                    <Card className="border-0 shadow-sm rounded-4 bg-primary text-white p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <h4 className="fw-bold mb-3">{t("common.contact_info_title")}</h4>
                            <p className="text-white-50 small mb-4">
                                {t("common.contact_info_desc")}
                            </p>

                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <Mail size={18} className="text-white-50" />
                                    <span className="small">contact@examsys.com</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <Phone size={18} className="text-white-50" />
                                    <span className="small">+1 (555) 019-2834</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <MapPin size={18} className="text-white-50" />
                                    <span className="small">100 Tech Square, Boston MA</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-top border-white-10 text-white-50 small">
                            {t("common.contact_info_hours")}
                        </div>
                    </Card>
                </Col>

                {/* Contact Form */}
                <Col xs={12} md={7}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                        <h4 className="fw-bold text-dark mb-4">{t("common.contact_form_title")}</h4>
                        <Form onSubmit={handleSubmitContact}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">{t("common.contact_name_label")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("common.contact_name_placeholder")}
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">{t("auth.email_address")}</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("common.contact_email_placeholder")}
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-secondary">{t("common.contact_message_label")}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t("common.contact_message_placeholder")}
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm w-100 justify-content-center"
                            >
                                <Send size={16} /> {t("common.contact_submit_btn")}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactPage;
