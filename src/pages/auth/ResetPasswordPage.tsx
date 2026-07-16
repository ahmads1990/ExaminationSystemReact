import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

import OtpInput from "../../components/common/forms/OtpInput";
import PasswordInput from "../../components/common/forms/PasswordInput";
import AuthService from "../../services/authService";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
            setError("Session expired. Please request a new code.");
            return;
        }

        if (otp.length < 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
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
                navigate("/login", { state: { message: "Password reset successfully! You can now login." } });
            } else {
                setError(response.message || "Failed to reset password. Please try again.");
            }
        } catch (err: any) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in mx-auto" style={{ maxWidth: "400px" }}>
            <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">Reset Password ✨</h2>
                <p className="text-muted px-2">
                    Enter the 6-digit code we sent to your email and choose a new password.
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
                        Enter 6-digit code
                    </Form.Label>
                    <OtpInput length={6} value={otp} onChange={setOtp} error={!!error} />
                </div>

                {/* Password Inputs */}
                <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(value: string) => setNewPassword(value)}
                    required
                />

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm new password"
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
                            <Spinner animation="border" size="sm" /> Resetting...
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </Button>

                <hr className="text-muted opacity-25 my-1" />

                <div className="text-center">
                    <p className="text-muted small mb-0">
                        Remembered your password?{" "}
                        <Link to="/login" className="text-primary fw-bold text-decoration-none">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;
