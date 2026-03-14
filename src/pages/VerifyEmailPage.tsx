import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const VerifyEmailPage = () => {
    return (
        <div className="text-center animate-fade-in">
            <div className="mb-4">
                <div className="email-icon-wrapper mb-4">
                    <Mail size={80} className="text-primary" />
                </div>
                <h2 className="fw-bold mb-3">Check Your Email</h2>
                <p className="text-muted mb-4">
                    We've sent a verification link to your email address.
                    <br />
                    Please verify your email before logging in.
                </p>
            </div>

            <div className="d-grid gap-3">
                <Link to="/login" className="text-decoration-none">
                    <Button variant="primary" className="w-100 py-3 fw-semibold shadow-sm">
                        Go to Login
                    </Button>
                </Link>

                <p className="text-muted small mb-0">
                    Didn't receive the email? Check your spam folder or{" "}
                    <a href="#" className="text-primary text-decoration-none fw-semibold">
                        resend verification email
                    </a>
                </p>
            </div>

            <style>
                {`
                    .email-icon-wrapper {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 140px;
                        height: 140px;
                        background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
                        border-radius: 50%;
                        margin: 0 auto;
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.5s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default VerifyEmailPage;
