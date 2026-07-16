import { Card, Container } from "react-bootstrap";
import { FileText } from "lucide-react";

const TermsOfServicePage = () => {
    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-primary-subtle p-3 text-primary">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">Terms of Service</h1>
                        <span className="text-secondary small">Last Updated: July 16, 2026</span>
                    </div>
                </div>

                <div className="text-secondary d-flex flex-column gap-4" style={{ lineHeight: 1.6 }}>
                    <section>
                        <h5 className="fw-bold text-dark">1. Acceptance of Terms</h5>
                        <p>
                            By accessing and using the ExamSys examination system, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">2. Academic Integrity</h5>
                        <p>
                            All examinations conducted through this platform are subject to strict academic integrity policies. Any attempt to cheat, share answers, utilize unauthorized materials, or bypass the application's environment will result in immediate disqualification and disciplinary action.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">3. Account Safety & Security</h5>
                        <p>
                            You are responsible for safeguarding your login credentials. You agree to notify us immediately of any unauthorized use of your account. ExamSys will not be held liable for any loss arising from unauthorized account access.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">4. Termination of Access</h5>
                        <p>
                            We reserve the right to suspend or terminate your access to the platform at any time, without prior notice, if we believe you are in breach of these Terms of Service.
                        </p>
                    </section>
                </div>
            </Card>
        </Container>
    );
};

export default TermsOfServicePage;
