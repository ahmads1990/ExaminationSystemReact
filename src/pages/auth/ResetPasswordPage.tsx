import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

import OtpInput from "../../components/common/forms/OtpInput";
import PasswordInput from "../../components/common/forms/PasswordInput";
import AuthService from "../../services/authService";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Expected to be passed from ForgotPasswordPage
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError(t("auth.session_expired_error", "Session expired. Please request a new code."));
            return;
        }

        if (otp.length < 6) {
            setError(t("auth.complete_code_error", "Please enter the complete 6-digit code."));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t("auth.passwords_mismatch_error", "Passwords do not match."));
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.resetPassword({
                email,
                otp,
                newPassword,
                confirmPassword
            });

            if (response.success) {
                // On success → redirect to /login with "Password changed" toast
                navigate("/login", { state: { message: t("auth.reset_success_msg", "Password reset successfully! You can now login.") } });
            } else {
                setError(response.message || t("auth.failed_reset_error", "Failed to reset password. Please try again."));
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
                <h2 className="fw-bold mb-2">{t("auth.reset_pass_title")}</h2>
                <p className="text-muted px-2">
                    {t("auth.reset_pass_desc")}
                </p>
                {email && <div className="fw-bold text-primary mb-2">{email}</div>}
            </div>

            {error && (
                <Alert variant="danger" className="small py-2 text-center" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleResetSubmit} className="d-flex flex-column gap-3">
                {/* OTP Input */}
                <div>
                    <Form.Label
                        className="text-start mb-2 ms-1 fw-semibold text-secondary"
                        style={{ fontSize: "0.9rem" }}
                    >
                        {t("auth.enter_code")}
                    </Form.Label>
                    <OtpInput length={6} value={otp} onChange={setOtp} error={!!error} />
                </div>

                {/* Password Inputs */}
                <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    label={t("auth.enter_new_pass")}
                    placeholder={t("auth.enter_new_pass")}
                    value={newPassword}
                    onChange={(value: string) => setNewPassword(value)}
                    required
                />

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t("auth.confirm_new_pass")}
                    placeholder={t("auth.confirm_new_pass")}
                    value={confirmPassword}
                    onChange={(value: string) => setConfirmPassword(value)}
                    required
                />

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2"
                    disabled={isSubmitting || otp.length < 6 || !newPassword || !confirmPassword}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> {t("auth.resetting")}
                        </>
                    ) : (
                        t("auth.btn_reset_pass")
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
                </div>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;
