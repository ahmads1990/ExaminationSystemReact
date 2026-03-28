import { useState, useEffect } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import OtpInput from "../../components/common/forms/OtpInput";
import AuthService from "../../services/authService";
import contactUsLottieUrl from "../../assets/lottie-animations/contactUs.lottie?url";

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
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
            const timer = setInterval(() => setCountdown(c => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    const handleVerifySubmit = async () => {
        if (!email) {
            setError("Session expired. Please register again or login.");
            return;
        }

        if (otp.length < 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }

        setError("");
        setSuccessMsg("");
        setIsSubmitting(true);

        try {
            const response = await AuthService.verifyEmail(email, otp);
            
            if (response.success) {
                // Navigate to Login
                navigate('/login', { state: { message: "Email verified successfully! You can now login." } });
            } else {
                setError(response.message || "Failed to verify code. Please try again.");
                setOtp("");
            }
        } catch (err: any) {
            setError("Invalid code or an error occurred.");
            setOtp(""); // Clear OTP on error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        if (!userId) {
            setError("Unable to resend: Missing user info.");
            return;
        }
        
        setError("");
        setSuccessMsg("");
        setIsSubmitting(true);
        
        try {
            const response = await AuthService.resendVerification(userId);
            if (response.success) {
                setSuccessMsg("Verification code resent successfully!");
                setCountdown(30); // Reset timer
            } else {
                setError(response.message || "Failed to resend code.");
            }
        } catch (err) {
            setError("An error occurred while trying to resend the code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in mx-auto" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
                
                {/* Lottie Animation Header */}
                <div className="d-flex justify-content-center align-items-center mb-2 mx-auto" style={{ height: '160px', width: '160px' }}>
                    <DotLottieReact src={contactUsLottieUrl} loop autoplay />
                </div>

                <h2 className="fw-bold mb-2">Almost There! ✨</h2>
                <p className="text-muted px-2">
                    We've sent a 6-digit code to <strong>{email}</strong>. <br/>
                    Please enter it below to verify your email and complete your registration!
                </p>
            </div>

            {error && (
                <Alert variant="danger" className="small py-2 text-center" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            {successMsg && (
                <Alert variant="success" className="small py-2 text-center" onClose={() => setSuccessMsg("")} dismissible>
                    {successMsg}
                </Alert>
            )}

            <div className="d-flex flex-column gap-4">
                {/* OTP Input Component */}
                <div>
                    <div className="text-start mb-2 ms-1 fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>
                        Enter 6-digit code
                    </div>
                    <OtpInput 
                        length={6} 
                        value={otp} 
                        onChange={setOtp} 
                        error={!!error}
                    />
                </div>

                <Button 
                    variant="primary" 
                    className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2"
                    disabled={isSubmitting || otp.length < 6}
                    onClick={handleVerifySubmit}
                >
                    {isSubmitting ? (
                        <><Spinner animation="border" size="sm" /> Verifying...</>
                    ) : (
                        "Verify Account"
                    )}
                </Button>

                <hr className="text-muted opacity-25 my-1" />

                {/* Resend Timer section */}
                <div className="text-center">
                    <p className="text-muted small mb-0">
                        Didn't receive the code? {" "}
                        {countdown > 0 ? (
                            <span className="fw-semibold text-secondary">
                                Resend in 00:{countdown.toString().padStart(2, '0')}
                            </span>
                        ) : (
                            <span 
                                className="text-primary fw-bold text-decoration-none cursor-pointer" 
                                style={{ cursor: 'pointer' }}
                                onClick={handleResend}
                            >
                                Resend Code
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
