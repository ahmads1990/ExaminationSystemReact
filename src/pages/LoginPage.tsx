import { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import AuthService from "../services/authService";
import FormInput from "../components/common/FormInput";
import FormPasswordInput from "../components/common/FormPasswordInput";
import { validateLoginRequest, ValidationErrors } from "../utils/validation";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();
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
                login(response.data);
                navigate("/");
            } else {
                setError(response.message || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted">Please sign in to continue</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Form onSubmit={handleLogin}>
                <FormInput
                    id="loginEmail"
                    name="email"
                    label="Email Address"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    error={errors.email}
                    required
                />

                <FormPasswordInput
                    id="loginPassword"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(value) => setFormData({ ...formData, password: value })}
                    error={errors.password}
                    required
                />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label="Remember me" id="rememberMe" className="small text-muted" />
                    <a href="#" className="text-decoration-none small fw-semibold text-primary hover-opacity">Forgot password?</a>
                </div>

                <Button variant="primary" type="submit" className="w-100 py-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" /> Signing In...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>

                <div className="text-center">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                        Create Account
                    </Link>
                </div>
            </Form>

            <style>
                {`
                    .focus-ring:focus {
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                        border-color: #2563EB;
                    }
                    .hover-opacity:hover {
                        opacity: 0.8;
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

export default LoginPage;
