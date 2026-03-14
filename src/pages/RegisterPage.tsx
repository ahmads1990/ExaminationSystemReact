import { useState } from "react";
import { Form, Button, Tabs, Tab, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import FormInput from "../components/common/FormInput";
import FormPasswordInput from "../components/common/FormPasswordInput";
import FormSelectInput from "../components/common/FormSelectInput";
import FormTextareaInput from "../components/common/FormTextareaInput";
import { 
    validateRegisterStudentRequest, 
    validateRegisterInstructorRequest,
    ValidationErrors 
} from "../utils/validation";

enum UserType {
    Student = "student",
    Instructor = "instructor"
}

interface StudentFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    level: string;
    group: string;
}

interface InstructorFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    bio: string;
    specialization: string;
}

const RegisterPage = () => {
    const navigate = useNavigate();
    const [key, setKey] = useState<UserType>(UserType.Student);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // Education level options
    const levelOptions = [
        { value: "HighSchool", label: "High School" },
        { value: "Bachelor", label: "Bachelor's Degree" },
        { value: "Master", label: "Master's Degree" }
    ];

    // Student form state
    const [studentForm, setStudentForm] = useState<StudentFormData>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        level: "",
        group: ""
    });
    const [studentErrors, setStudentErrors] = useState<ValidationErrors>({});

    // Instructor form state
    const [instructorForm, setInstructorForm] = useState<InstructorFormData>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        bio: "",
        specialization: ""
    });
    const [instructorErrors, setInstructorErrors] = useState<ValidationErrors>({});

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (key === UserType.Student) {
            // Validate using request validator
            const errors = validateRegisterStudentRequest(
                {
                    name: studentForm.name,
                    username: studentForm.username,
                    email: studentForm.email,
                    password: studentForm.password,
                    level: studentForm.level,
                    group: studentForm.group
                },
                studentForm.confirmPassword
            );

            if (Object.keys(errors).length > 0) {
                setStudentErrors(errors);
                return;
            }
            
            setLoading(true);
            try {
                const response = await AuthService.registerStudent({
                    name: studentForm.name,
                    username: studentForm.username,
                    email: studentForm.email,
                    password: studentForm.password,
                    level: studentForm.level,
                    group: studentForm.group
                });
                
                if (response.success) {
                    setTimeout(() => navigate("/verify-email"), 1500);
                } else {
                    setError(response.message || "Registration failed. Please try again.");
                }
            } catch (err) {
                console.error("Registration failed:", err);
                setError("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        } else if (key === UserType.Instructor) {
            // Validate using request validator
            const errors = validateRegisterInstructorRequest(
                {
                    name: instructorForm.name,
                    username: instructorForm.username,
                    email: instructorForm.email,
                    password: instructorForm.password,
                    bio: instructorForm.bio,
                    specialization: instructorForm.specialization
                },
                instructorForm.confirmPassword
            );
            
            if (Object.keys(errors).length > 0) {
                setInstructorErrors(errors);
                return;
            }
            
            setLoading(true);
            try {
                const response = await AuthService.registerInstructor({
                    name: instructorForm.name,
                    username: instructorForm.username,
                    email: instructorForm.email,
                    password: instructorForm.password,
                    bio: instructorForm.bio,
                    specialization: instructorForm.specialization
                });
                
                if (response.success) {
                    setTimeout(() => navigate("/verify-email"), 1500);
                } else {
                    setError(response.message || "Registration failed. Please try again.");
                }
            } catch (err) {
                console.error("Registration failed:", err);
                setError("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted">Join us as a Student or Instructor</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Tabs
                id="registration-tabs"
                activeKey={key}
                onSelect={(k) => setKey((k as UserType) || UserType.Student)}
                className="mb-4 nav-justified custom-tabs"
            >
                <Tab eventKey={UserType.Student} title="Student">
                    <Form onSubmit={handleRegister} className="mt-3">
                        <Row>
                            <Col md={6}>
                                <FormInput
                                    id="studentName"
                                    name="name"
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={studentForm.name}
                                    onChange={(value) => setStudentForm({ ...studentForm, name: value })}
                                    error={studentErrors.name}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    id="studentUser"
                                    name="username"
                                    label="Username"
                                    placeholder="johndoe"
                                    value={studentForm.username}
                                    onChange={(value) => setStudentForm({ ...studentForm, username: value })}
                                    error={studentErrors.username}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <FormInput
                            id="studentEmail"
                            name="email"
                            label="Email Address"
                            placeholder="name@example.com"
                            value={studentForm.email}
                            onChange={(value) => setStudentForm({ ...studentForm, email: value })}
                            error={studentErrors.email}
                            required
                        />

                        <Row>
                            <Col md={6}>
                                <FormPasswordInput
                                    id="studentPass"
                                    name="password"
                                    label="Password"
                                    placeholder="Password"
                                    value={studentForm.password}
                                    onChange={(value) => setStudentForm({ ...studentForm, password: value })}
                                    error={studentErrors.password}
                                    required
                                    minLength={8}
                                />
                            </Col>
                            <Col md={6}>
                                <FormPasswordInput
                                    id="studentConfirm"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={studentForm.confirmPassword}
                                    onChange={(value) => setStudentForm({ ...studentForm, confirmPassword: value })}
                                    error={studentErrors.confirmPassword}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormSelectInput
                                    id="studentLevel"
                                    name="level"
                                    label="Education Level"
                                    value={studentForm.level}
                                    onChange={(value) => setStudentForm({ ...studentForm, level: value })}
                                    options={levelOptions}
                                    error={studentErrors.level}
                                    required
                                    placeholder="Select Level"
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    id="studentGroup"
                                    name="group"
                                    label="Group (Optional)"
                                    placeholder="e.g., Group A"
                                    value={studentForm.group}
                                    onChange={(value) => setStudentForm({ ...studentForm, group: value })}
                                    error={studentErrors.group}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" className="w-100 py-3 fw-semibold shadow-sm mt-2" disabled={loading}>
                            {loading ? "Creating Account..." : "Register as Student"}
                        </Button>
                    </Form>
                </Tab>

                <Tab eventKey={UserType.Instructor} title="Instructor">
                    <Form onSubmit={handleRegister} className="mt-3">
                        <Row>
                            <Col md={6}>
                                <FormInput
                                    id="instrName"
                                    name="name"
                                    label="Full Name"
                                    placeholder="Dr. Jane Smith"
                                    value={instructorForm.name}
                                    onChange={(value) => setInstructorForm({ ...instructorForm, name: value })}
                                    error={instructorErrors.name}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    id="instrUser"
                                    name="username"
                                    label="Username"
                                    placeholder="janesmith"
                                    value={instructorForm.username}
                                    onChange={(value) => setInstructorForm({ ...instructorForm, username: value })}
                                    error={instructorErrors.username}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <FormInput
                            id="instrEmail"
                            name="email"
                            label="Email Address"
                            placeholder="name@example.com"
                            value={instructorForm.email}
                            onChange={(value) => setInstructorForm({ ...instructorForm, email: value })}
                            error={instructorErrors.email}
                            required
                        />

                        <Row>
                            <Col md={6}>
                                <FormPasswordInput
                                    id="instrPass"
                                    name="password"
                                    label="Password"
                                    placeholder="Password"
                                    value={instructorForm.password}
                                    onChange={(value) => setInstructorForm({ ...instructorForm, password: value })}
                                    error={instructorErrors.password}
                                    required
                                    minLength={8}
                                />
                            </Col>
                            <Col md={6}>
                                <FormPasswordInput
                                    id="instrConfirm"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={instructorForm.confirmPassword}
                                    onChange={(value) => setInstructorForm({ ...instructorForm, confirmPassword: value })}
                                    error={instructorErrors.confirmPassword}
                                    required
                                />
                            </Col>
                        </Row>

                        <FormTextareaInput
                            id="instrBio"
                            name="bio"
                            label="Bio (Optional)"
                            placeholder="Tell us about yourself..."
                            value={instructorForm.bio}
                            onChange={(value) => setInstructorForm({ ...instructorForm, bio: value })}
                            error={instructorErrors.bio}
                            rows={3}
                            maxLength={500}
                        />

                        <FormInput
                            id="instrSpecialization"
                            name="specialization"
                            label="Specialization (Optional)"
                            placeholder="e.g., Computer Science"
                            value={instructorForm.specialization}
                            onChange={(value) => setInstructorForm({ ...instructorForm, specialization: value })}
                            error={instructorErrors.specialization}
                            maxLength={200}
                        />

                        <Button variant="primary" type="submit" className="w-100 py-3 fw-semibold shadow-sm mt-2" disabled={loading}>
                            {loading ? "Creating Account..." : "Register as Instructor"}
                        </Button>
                    </Form>
                </Tab>
            </Tabs>

            <div className="text-center mt-4">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                    Sign In
                </Link>
            </div>

            <style>
                {`
                    .custom-tabs .nav-link {
                        color: #64748B;
                        font-weight: 500;
                        border: none;
                        border-bottom: 2px solid transparent;
                        padding-bottom: 1rem;
                    }
                    .custom-tabs .nav-link.active {
                        color: #2563EB;
                        background: transparent;
                        border-bottom-color: #2563EB;
                        font-weight: 600;
                    }
                    .custom-tabs .nav-link:hover {
                        color: #2563EB;
                        border-color: transparent;
                    }
                `}
            </style>
        </div>
    );
};

export default RegisterPage;
