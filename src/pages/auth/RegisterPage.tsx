import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Col, Form, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/common/forms/PasswordInput";
import SelectInput from "../../components/common/forms/SelectInput";
import TextAreaInput from "../../components/common/forms/TextAreaInput";
import TextInput from "../../components/common/forms/TextInput";
import AuthService from "../../services/authService";
import {
    validateRegisterInstructorRequest,
    validateRegisterStudentRequest,
    ValidationErrors
} from "../../utils/validation";

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
    const { t } = useTranslation();
    const [key, setKey] = useState<UserType>(UserType.Student);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // Education level options
    const levelOptions = [
        { value: "HighSchool", label: t("auth.high_school") },
        { value: "Bachelor", label: t("auth.bachelor") },
        { value: "Master", label: t("auth.master") }
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
                    setTimeout(
                        () => navigate("/verify-email", { state: { email: studentForm.email, userId: response.data } }),
                        1500
                    );
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
                    setTimeout(
                        () =>
                            navigate("/verify-email", {
                                state: { email: instructorForm.email, userId: response.data }
                            }),
                        1500
                    );
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
                <h2 className="fw-bold mb-1">{t("auth.register_title")}</h2>
                <p className="text-muted">{t("auth.register_subtitle")}</p>
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
                <Tab eventKey={UserType.Student} title={t("auth.student")}>
                    <Form onSubmit={handleRegister} className="mt-3">
                        <Row>
                            <Col md={6}>
                                <TextInput
                                    id="studentName"
                                    name="name"
                                    label={t("auth.fullname")}
                                    placeholder="John Doe"
                                    value={studentForm.name}
                                    onChange={(value: string) => setStudentForm({ ...studentForm, name: value })}
                                    error={studentErrors.name}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </Col>
                            <Col md={6}>
                                <TextInput
                                    id="studentUser"
                                    name="username"
                                    label={t("auth.username")}
                                    placeholder="johndoe"
                                    value={studentForm.username}
                                    onChange={(value: string) => setStudentForm({ ...studentForm, username: value })}
                                    error={studentErrors.username}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <TextInput
                            id="studentEmail"
                            name="email"
                            label={t("auth.email")}
                            placeholder="name@example.com"
                            value={studentForm.email}
                            onChange={(value: string) => setStudentForm({ ...studentForm, email: value })}
                            error={studentErrors.email}
                            required
                        />

                        <Row>
                            <Col md={6}>
                                <PasswordInput
                                    id="studentPass"
                                    name="password"
                                    label={t("auth.password")}
                                    placeholder="Password"
                                    value={studentForm.password}
                                    onChange={(value: string) => setStudentForm({ ...studentForm, password: value })}
                                    error={studentErrors.password}
                                    required
                                    minLength={8}
                                />
                            </Col>
                            <Col md={6}>
                                <PasswordInput
                                    id="studentConfirm"
                                    name="confirmPassword"
                                    label={t("auth.confirm_password")}
                                    placeholder="Confirm Password"
                                    value={studentForm.confirmPassword}
                                    onChange={(value: string) =>
                                        setStudentForm({ ...studentForm, confirmPassword: value })
                                    }
                                    error={studentErrors.confirmPassword}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <SelectInput
                                    id="studentLevel"
                                    name="level"
                                    label={t("auth.edu_level")}
                                    value={studentForm.level}
                                    onChange={(value: string) => setStudentForm({ ...studentForm, level: value })}
                                    options={levelOptions}
                                    error={studentErrors.level}
                                    required
                                    placeholder={t("auth.select_level")}
                                />
                            </Col>
                            <Col md={6}>
                                <TextInput
                                    id="studentGroup"
                                    name="group"
                                    label={t("auth.group_optional")}
                                    placeholder="e.g., Group A"
                                    value={studentForm.group}
                                    onChange={(value: string) => setStudentForm({ ...studentForm, group: value })}
                                    error={studentErrors.group}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-4 mb-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" /> {t("auth.creating_account", "Creating Account...")}
                                </>
                            ) : (
                                t("auth.btn_register_student")
                            )}
                        </Button>
                    </Form>
                </Tab>

                <Tab eventKey={UserType.Instructor} title={t("auth.instructor")}>
                    <Form onSubmit={handleRegister} className="mt-3">
                        <Row>
                            <Col md={6}>
                                <TextInput
                                    id="instrName"
                                    name="name"
                                    label={t("auth.fullname")}
                                    placeholder="Dr. Jane Smith"
                                    value={instructorForm.name}
                                    onChange={(value: string) => setInstructorForm({ ...instructorForm, name: value })}
                                    error={instructorErrors.name}
                                    required
                                    minLength={3}
                                    maxLength={100}
                                />
                            </Col>
                            <Col md={6}>
                                <TextInput
                                    id="instrUser"
                                    name="username"
                                    label={t("auth.username")}
                                    placeholder="janesmith"
                                    value={instructorForm.username}
                                    onChange={(value: string) =>
                                        setInstructorForm({ ...instructorForm, username: value })
                                    }
                                    error={instructorErrors.username}
                                    required
                                    minLength={3}
                                    maxLength={50}
                                />
                            </Col>
                        </Row>

                        <TextInput
                            id="instrEmail"
                            name="email"
                            label={t("auth.email")}
                            placeholder="name@example.com"
                            value={instructorForm.email}
                            onChange={(value: string) => setInstructorForm({ ...instructorForm, email: value })}
                            error={instructorErrors.email}
                            required
                        />

                        <Row>
                            <Col md={6}>
                                <PasswordInput
                                    id="instrPass"
                                    name="password"
                                    label={t("auth.password")}
                                    placeholder="Password"
                                    value={instructorForm.password}
                                    onChange={(value: string) =>
                                        setInstructorForm({ ...instructorForm, password: value })
                                    }
                                    error={instructorErrors.password}
                                    required
                                    minLength={8}
                                />
                            </Col>
                            <Col md={6}>
                                <PasswordInput
                                    id="instrConfirm"
                                    name="confirmPassword"
                                    label={t("auth.confirm_password")}
                                    placeholder="Confirm Password"
                                    value={instructorForm.confirmPassword}
                                    onChange={(value: string) =>
                                        setInstructorForm({ ...instructorForm, confirmPassword: value })
                                    }
                                    error={instructorErrors.confirmPassword}
                                    required
                                />
                            </Col>
                        </Row>

                        <TextAreaInput
                            id="instrBio"
                            name="bio"
                            label={t("auth.bio_optional")}
                            placeholder="Tell us about yourself..."
                            value={instructorForm.bio}
                            onChange={(value: string) => setInstructorForm({ ...instructorForm, bio: value })}
                            error={instructorErrors.bio}
                            rows={3}
                            maxLength={500}
                        />

                        <TextInput
                            id="instrSpecialization"
                            name="specialization"
                            label={t("auth.specialization_optional")}
                            placeholder="e.g., Computer Science"
                            value={instructorForm.specialization}
                            onChange={(value: string) =>
                                setInstructorForm({ ...instructorForm, specialization: value })
                            }
                            error={instructorErrors.specialization}
                            maxLength={200}
                        />

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-4 mb-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" /> {t("auth.creating_account", "Creating Account...")}
                                </>
                            ) : (
                                t("auth.btn_register_instructor")
                            )}
                        </Button>
                    </Form>
                </Tab>
            </Tabs>

            <div className="text-center mt-4">
                <span className="text-muted small">{t("auth.already_account")}</span>
                <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                    {t("login.login")}
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
