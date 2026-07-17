import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import contactUsLottieUrl from "../../assets/lottie-animations/contactUs.lottie?url";
import OtpInput from "../../components/common/forms/OtpInput";
import AuthService from "../../services/authService";

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Expected to be passed from RegisterPage after successful registration
    const email = location.state?.email || "";
    const userId = location.state?.userId || 0;

    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [countdown, setCountdown] = useState(30);

    // Countdown Timer Logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    const handleVerifySubmit = async () => {
        if (!email) {
            setError(t("auth.session_expired_register_error", "Session expired. Please register again or login."));
            return;
        }

        if (otp.length < 6) {
            setError(t("auth.complete_code_error", "Please enter the complete 6-digit code."));
            return;
        }

        setError("");
        setSuccessMsg("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.verifyEmail(email, otp);

            if (response.success) {
                // Navigate to Login
                navigate("/login", { state: { message: t("auth.email_verified_success", "Email verified successfully! You can now login.") } });
            } else {
                setError(response.message || t("auth.failed_verify_code_error", "Failed to verify code. Please try again."));
                setOtp("");
            }
        } catch (err: any) {
            setError(t("auth.invalid_code_error", "Invalid code or an error occurred."));
            setOtp(""); // Clear OTP on error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        if (!userId) {
            setError(t("auth.resend_missing_info_error", "Unable to resend: Missing user info."));
            return;
        }

        setError("");
        setSuccessMsg("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.resendVerification(userId);
            if (response.success) {
                setSuccessMsg(t("auth.code_resent_success", "Verification code resent successfully!"));
                setCountdown(30); // Reset timer
            } else {
                setError(response.message || t("auth.failed_resend_error", "Failed to resend code."));
            }
        } catch (err) {
            setError(t("auth.resend_error", "An error occurred while trying to resend the code."));
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
                    <DotLottieReact src={contactUsLottieUrl} loop autoplay />
                </div>

                <h2 className="fw-bold mb-2">{t("auth.verify_title")}</h2>
                <p className="text-muted px-2">
                    {t("auth.verify_desc", { email })}
                </p>
            </div>

            {error && (
                <Alert variant="danger" className="small py-2 text-center" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            {successMsg && (
                <Alert
                    variant="success"
                    className="small py-2 text-center"
                    onClose={() => setSuccessMsg("")}
                    dismissible
                >
                    {successMsg}
                </Alert>
            )}

            <div className="d-flex flex-column gap-4">
                {/* OTP Input Component */}
                <div>
                    <div className="text-start mb-2 ms-1 fw-semibold text-secondary" style={{ fontSize: "0.9rem" }}>
                        {t("auth.enter_code")}
                    </div>
                    <OtpInput length={6} value={otp} onChange={setOtp} error={!!error} />
                </div>

                <Button
                    variant="primary"
                    className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2"
                    disabled={isSubmitting || otp.length < 6}
                    onClick={handleVerifySubmit}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> {t("auth.verifying")}
                        </>
                    ) : (
                        t("auth.btn_verify_account")
                    )}
                </Button>

                <hr className="text-muted opacity-25 my-1" />

                {/* Resend Timer section */}
                <div className="text-center">
                    <p className="text-muted small mb-0">
                        {t("auth.no_code")}{" "}
                        {countdown > 0 ? (
                            <span className="fw-semibold text-secondary">
                                {t("auth.resend_in", { seconds: countdown.toString().padStart(2, "0") })}
                            </span>
                        ) : (
                            <span
                                className="text-primary fw-bold text-decoration-none cursor-pointer"
                                style={{ cursor: "pointer" }}
                                onClick={handleResend}
                            >
                                {t("auth.btn_resend_code")}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
