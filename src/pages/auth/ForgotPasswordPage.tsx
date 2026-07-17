import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import passwordSecurityLottieUrl from "../../assets/lottie-animations/passwordSecurity.lottie?url";
import AuthService from "../../services/authService";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError(t("auth.enter_email_error", "Please enter your email address."));
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.forgotPassword(email);

            if (response.success) {
                // Navigate to Reset Password
                navigate("/reset-password", { state: { email } });
            } else {
                setError(response.message || t("auth.failed_send_code_error", "Failed to send reset code. Please try again."));
            }
        } catch (err: any) {
            setError(t("auth.generic_error", "An error occurred. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in mx-auto" style={{ maxWidth: "400px" }}>
            <div className="text-center mb-4">
                {/* Lottie Animation Header */}
                <div
                    className="d-flex justify-content-center align-items-center mb-2 mx-auto"
                    style={{ height: "160px", width: "160px" }}
                >
                    <DotLottieReact src={passwordSecurityLottieUrl} loop autoplay />
                </div>

                <h2 className="fw-bold mb-2">{t("auth.forgot_pass_title")}</h2>
                <p className="text-muted px-2">
                    {t("auth.forgot_pass_desc")}
                </p>
            </div>

            {error && (
                <Alert variant="danger" className="small py-2 text-center" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleForgotSubmit} className="d-flex flex-column gap-3">
                <Form.Group>
                    <Form.Label
                        className="text-start mb-2 ms-1 fw-semibold text-secondary"
                        style={{ fontSize: "0.9rem" }}
                    >
                        {t("auth.email")}
                    </Form.Label>
                    <Form.Control
                        type="email"
                        placeholder={t("login.email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="py-2"
                        autoComplete="email"
                    />
                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2"
                    disabled={isSubmitting || !email}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> {t("auth.sending")}
                        </>
                    ) : (
                        t("auth.btn_send_code")
                    )}
                </Button>

                <hr className="text-muted opacity-25 my-1" />

                <div className="text-center">
                    <p className="text-muted small mb-0">
                        {t("auth.remembered_pass")}{" "}
                        <Link to="/login" className="text-primary fw-bold text-decoration-none">
                            {t("auth.back_to_login")}
                        </Link>
                    </p>
                    <div className="mt-3">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                            onClick={() => navigate("/reset-password", { state: { email: email || "admin@exam.com" } })}
                            style={{ borderStyle: "dashed" }}
                            type="button"
                        >
                            {t("auth.skip_to_reset")}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default ForgotPasswordPage;
