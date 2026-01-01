import { useState } from "react";
import FormCheckbox from "../common/FormCheckboxInput";
import FormInput from "../common/FormInput";
import FormSwitch from "../common/FormSwitchInput";

export default function Registration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "Student",
        agreeToTerms: false
    });

    // State for validation errors
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    // State for form submission
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    return (
        <section className="p-3 p-md-4 p-xl-5">
            <div className="container" style={{ maxWidth: "85%" }}>
                <div className="card shadow-sm">
                    <div className="row g-0">
                        {/* Left Image */}
                        <div className="col-md-6">
                            <img
                                className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                                loading="lazy"
                                src="https://placehold.co/400"
                                alt="Welcome back you've been missed!"
                            />
                        </div>

                        {/* Right Form */}
                        <div className="col-md-6 d-flex align-items-center justify-content-center">
                            <div className="card-body p-2 p-md-3 p-xl-4 w-100">
                                {/* Heading */}
                                <div className="text-center mb-4">
                                    <h2 className="h3 fw-bold">Create account</h2>
                                    <span>Start your journey with us today</span>
                                </div>

                                {/* Google Sign In */}
                                <a href="#!" className="btn btn-lg btn-outline-dark w-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-google"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 
                                        2.434-.87 4.492-2.384 5.885h.002C11.978 
                                        15.292 10.158 16 8 16A8 8 0 1 1 8 
                                        0a7.689 7.689 0 0 1 5.352 2.082l-2.284 
                                        2.284A4.347 4.347 0 0 0 8 3.166c-2.087 
                                        0-3.86 1.408-4.492 3.304a4.792 4.792 
                                        0 0 0 0 3.063h.003c.635 1.893 2.405 
                                        3.301 4.492 3.301 1.078 0 
                                        2.004-.276 2.722-.764h-.003a3.702 
                                        3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                                        />
                                    </svg>
                                    <span className="ms-2 fs-6">Continue with Google</span>
                                </a>

                                {/* Divider */}
                                <div className="d-flex align-items-center my-4">
                                    <hr className="flex-grow-1" />
                                    <span className="px-2 text-secondary">Or continue with email</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                {/* Form */}
                                <form>
                                    <div className="row">
                                        <div className="row mb-3">
                                            <div className="col-6">
                                                <FormInput
                                                    id="firstName"
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    label="First Name"
                                                    value={formData.firstName}
                                                    onChange={(value) => handleInputChange("firstName", value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <FormInput
                                                    id="lastName"
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    label="Last Name"
                                                    value={formData.lastName}
                                                    onChange={(value) => handleInputChange("lastName", value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <FormInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                label="Email Address"
                                                value={formData.email}
                                                onChange={(value) => handleInputChange("email", value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <FormSwitch
                                                id="role"
                                                optionLeft="Student"
                                                optionRight="Instructor"
                                                value={formData.role}
                                                onChange={(value) => handleInputChange("role", value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <FormInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                label="Password"
                                                value={formData.password}
                                                onChange={(value) => handleInputChange("password", value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <FormCheckbox
                                                id="iAgree"
                                                name="iAgree"
                                                required
                                                label={
                                                    <>
                                                        I agree to the{" "}
                                                        <a href="#!" className="link-primary text-decoration-none">
                                                            Terms of service
                                                        </a>{" "}
                                                        and{" "}
                                                        <a href="#!" className="link-primary text-decoration-none">
                                                            Privacy Policy
                                                        </a>
                                                    </>
                                                }
                                                checked={formData.agreeToTerms}
                                                onChange={(value) => handleInputChange("agreeToTerms", value)}
                                            />
                                        </div>
                                        <div className="col-12 d-grid">
                                            <button className="btn btn-dark btn-lg" type="submit" disabled={isLoading}>
                                                {isLoading ? "Creating..." : "Create account"}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Footer */}
                                <p className="mb-0 mt-3 text-secondary text-center">
                                    Already have an account?{" "}
                                    <a href="#!" className="link-primary text-decoration-none">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
