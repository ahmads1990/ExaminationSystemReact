import { ArrowLeft, Compass } from "lucide-react";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
            <Card className="border-0 shadow-lg rounded-4 bg-white p-5 text-center" style={{ maxWidth: "500px" }}>
                <div
                    className="rounded-circle bg-light p-4 text-primary mb-4 d-inline-flex align-items-center justify-content-center mx-auto"
                    style={{ width: "90px", height: "90px" }}
                >
                    <Compass
                        size={44}
                        className="text-primary animate-spin-slow"
                        style={{ animation: "spin 12s linear infinite" }}
                    />
                </div>

                <h1 className="display-4 fw-extrabold text-dark mb-2" style={{ letterSpacing: "-0.03em" }}>
                    404
                </h1>
                <h4 className="fw-bold text-dark mb-3">Page Not Found</h4>
                <p className="text-secondary small mb-4 px-3" style={{ lineHeight: 1.6 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily
                    unavailable.
                </p>

                <div className="d-flex flex-column gap-2">
                    <Link
                        to="/"
                        className="btn btn-primary rounded-3 px-4 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0"
                    >
                        <ArrowLeft size={16} /> Return to Dashboard
                    </Link>
                </div>
            </Card>
        </Container>
    );
};

export default NotFoundPage;
