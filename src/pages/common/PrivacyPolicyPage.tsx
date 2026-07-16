import { Card, Container } from "react-bootstrap";
import { Shield } from "lucide-react";

const PrivacyPolicyPage = () => {
    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-success-subtle p-3 text-success">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">Privacy Policy</h1>
                        <span className="text-secondary small">Last Updated: July 16, 2026</span>
                    </div>
                </div>

                <div className="text-secondary d-flex flex-column gap-4" style={{ lineHeight: 1.6 }}>
                    <section>
                        <h5 className="fw-bold text-dark">1. Data Collection</h5>
                        <p>
                            We collect basic information required for educational administration, including your name, email, credentials, and course enrollments. Additionally, during exams, system telemetry, start/stop timestamps, and answers are saved to ensure integrity.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">2. How We Use Your Data</h5>
                        <p>
                            Collected data is strictly used to compile grades, manage student enrollments, maintain test history, and prevent fraudulent actions during exam execution. We do not sell or trade user data to third-party advertisers.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">3. Information Storage & Safety</h5>
                        <p>
                            All database records are encrypted in transit and at rest. Access control policies ensure that student exam answers are only viewable by verified instructors and course administrators.
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">4. Cookies and Cache</h5>
                        <p>
                            We use cookies to maintain your login session. During exam taking, browser local storage is utilized to cache current selections to prevent progress loss from unexpected page reloads or network drops.
                        </p>
                    </section>
                </div>
            </Card>
        </Container>
    );
};

export default PrivacyPolicyPage;
