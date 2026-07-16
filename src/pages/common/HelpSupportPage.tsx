import { useState } from "react";
import { Card, Row, Col, Form, Button, Accordion } from "react-bootstrap";
import { HelpCircle, Mail, MessageSquare, AlertCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const HelpSupportPage = () => {
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("Technical");
    const [message, setMessage] = useState("");

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Support ticket submitted! We will contact you shortly.");
        setSubject("");
        setMessage("");
    };

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Help & Support Desk</h1>
                <p className="text-secondary">Get answers to frequently asked questions or submit a support ticket</p>
            </div>

            <Row className="g-4 mb-5">
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-primary-subtle p-3 text-primary">
                                <HelpCircle size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">FAQ Base</h5>
                            <p className="text-secondary small mb-0">Browse common inquiries on exam operations and profiles.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-success-subtle p-3 text-success">
                                <Mail size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Email Support</h5>
                            <p className="text-secondary small mb-0">Reach us directly at support@examsys.com for urgent issues.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white text-center p-4 h-100">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3">
                            <div className="rounded-circle bg-warning-subtle p-3 text-warning">
                                <MessageSquare size={28} />
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Community Forum</h5>
                            <p className="text-secondary small mb-0">Join discussions with fellow students and academic staff.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Accordion FAQ Area */}
                <Col xs={12} lg={6}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <HelpCircle size={22} className="text-primary" /> Frequently Asked Questions
                    </h4>
                    <Accordion defaultActiveKey="0" className="border-0 rounded-4 overflow-hidden shadow-sm">
                        <Accordion.Item eventKey="0" className="border-light">
                            <Accordion.Header className="fw-semibold">How do I start a scheduled exam?</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                Navigate to your student **Dashboard**, browse under the **Available Exams** list, and select **Start Exam**. Read the rules carefully before starting.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="border-light">
                            <Accordion.Header className="fw-semibold">What happens if my connection drops mid-exam?</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                The system local-caches your responses automatically inside the browser cache. Once your internet connection restores, your progress updates and you can submit successfully.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="border-light">
                            <Accordion.Header className="fw-semibold">How are subjective exams graded?</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                Subjective exams containing text questions are reviewed and graded manually by your course instructor. Results will display as "Pending" until final grades are entered.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" className="border-light">
                            <Accordion.Header className="fw-semibold">How can I change my profile name?</Accordion.Header>
                            <Accordion.Body className="text-secondary">
                                Go to the top-right user profile menu, select **Settings**, edit your name under the profile details tab, and click **Save Changes**.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

                {/* Support Form */}
                <Col xs={12} lg={6}>
                    <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <AlertCircle size={22} className="text-primary" /> Submit Support Ticket
                    </h4>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                        <Form onSubmit={handleSubmitTicket}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">Inquiry Category</Form.Label>
                                <Form.Select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="rounded-3 border-light py-2"
                                >
                                    <option value="Technical">Technical Issue (Bug / Crash)</option>
                                    <option value="Billing">Enrollment / Access Issues</option>
                                    <option value="Academic">Exam Policy / Question Discrepancies</option>
                                    <option value="Other">General Feedback</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold text-secondary">Subject</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={subject} 
                                    onChange={(e) => setSubject(e.target.value)} 
                                    placeholder="Brief summary of your issue"
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-secondary">Detailed Message</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={4}
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    placeholder="Describe your issue with exact steps to replicate"
                                    required
                                    className="rounded-3 border-light py-2"
                                />
                            </Form.Group>

                            <Button type="submit" className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm w-100 justify-content-center">
                                <Send size={16} /> Submit Ticket
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HelpSupportPage;
