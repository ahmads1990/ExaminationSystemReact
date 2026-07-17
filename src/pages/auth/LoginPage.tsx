import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../components/common/forms/PasswordInput";
import TextInput from "../../components/common/forms/TextInput";
import { useAuth } from "../../contexts/AuthContext";
import AuthService from "../../services/authService";
import { validateLoginRequest, ValidationErrors } from "../../utils/validation";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<ValidationErrors>({});

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        // Validate form
        const validationErrors = validateLoginRequest(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            const response = await AuthService.login(formData);

            if (response.success && response.data) {
                // Login successful, save token and redirect
                const { jwtToken, refreshToken } = response.data;
                login(jwtToken, refreshToken);
                navigate("/");
            } else {
                setError(response.message || "Login failed. Please try again.");
            }
        } catch (err: any) {
            console.error("Login error:", err);

            // Check for EmailNotVerified
            if (err.response?.data?.errorCode === 1002) {
                const userId = err.response.data.data; // Assumption: backend returns userId in data
                if (userId) {
                    navigate(`/verify-email?userId=${userId}&email=${encodeURIComponent(formData.email)}`);
                    return; // Stop execution
                }
            }

            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">{t("login.welcome")}</h2>
                <p className="text-muted">{t("login.signin")}</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <div
                className="demo-credentials-card border rounded-3 p-3 mb-4 shadow-sm"
                style={{ backgroundColor: "#fffdf0", borderColor: "#ffe69c" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-warning-emphasis fw-bold">🚀 {t("login.demo_access")}</h6>
                    <span className="badge bg-success rounded-pill px-2">Good with it! ✨</span>
                </div>
                <div className="row g-2">
                    <div className="col-6">
                        <div
                            className="p-2 border rounded bg-white cursor-pointer hover-shadow transition-all"
                            style={{ fontSize: "0.8rem", cursor: "pointer" }}
                            onClick={() => setFormData({ email: "admin@exam.com", password: "Password123!" })}
                        >
                            <div className="fw-bold text-primary">{t("navbar.instructor")}</div>
                            <code>admin@exam.com</code>
                        </div>
                    </div>
                    <div className="col-6">
                        <div
                            className="p-2 border rounded bg-white cursor-pointer hover-shadow transition-all"
                            style={{ fontSize: "0.8rem", cursor: "pointer" }}
                            onClick={() => setFormData({ email: "student@exam.com", password: "Password123!" })}
                        >
                            <div className="fw-bold text-info">{t("navbar.student")}</div>
                            <code>student@exam.com</code>
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {t("login.autofill_hint")}
                    </small>
                </div>
            </div>

            <Form onSubmit={handleLogin}>
                <TextInput
                    id="loginEmail"
                    name="email"
                    label={t("login.email")}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(value: string) => setFormData({ ...formData, email: value })}
                    error={errors.email}
                    required
                />

                <PasswordInput
                    id="loginPassword"
                    name="password"
                    label={t("login.password")}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(value: string) => setFormData({ ...formData, password: value })}
                    error={errors.password}
                    required
                />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label={t("login.remember_me")} id="rememberMe" className="small text-muted" />
                    <Link
                        to="/forgot-password"
                        className="text-decoration-none small fw-semibold text-primary hover-opacity"
                    >
                        {t("login.forgot_password")}
                    </Link>
                </div>

                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-4"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> {t("login.signing_in")}
                        </>
                    ) : (
                        t("login.login")
                    )}
                </Button>

                <div className="text-center">
                    <span className="text-muted small">{t("login.no_account")}</span>
                    <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                        {t("login.create_account")}
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;
