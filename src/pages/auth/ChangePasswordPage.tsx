import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import PasswordInput from "../../components/common/forms/PasswordInput";
import UserService from "../../services/userService";

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChangePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            setError("Please enter your current password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setError("");
        setSuccessMsg("");
        setIsSubmitting(true);

        try {
            const response = await UserService.changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            if (response.success) {
                setSuccessMsg(response.message || "Password updated successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(response.message || "Failed to update password. Please try again.");
            }
        } catch (err: any) {
            setError("Current password is incorrect or an error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-4 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4 p-md-5">
                            <h3 className="fw-bold mb-1">Change Password</h3>
                            <p className="text-muted mb-4">
                                Secure your account by updating your password periodically.
                            </p>

                            {error && (
                                <Alert variant="danger" className="small py-2" onClose={() => setError("")} dismissible>
                                    {error}
                                </Alert>
                            )}
                            {successMsg && (
                                <Alert
                                    variant="success"
                                    className="small py-2"
                                    onClose={() => setSuccessMsg("")}
                                    dismissible
                                >
                                    {successMsg}
                                </Alert>
                            )}

                            <Form onSubmit={handleChangePasswordSubmit} className="d-flex flex-column gap-3">
                                <PasswordInput
                                    id="currentPassword"
                                    name="currentPassword"
                                    label="Current Password"
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(value: string) => setCurrentPassword(value)}
                                    required
                                />

                                <hr className="my-2 opacity-50 text-muted" />

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
                                    label="Confirm New Password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(value: string) => setConfirmPassword(value)}
                                    required
                                />

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-3 fw-bold shadow-sm mt-3"
                                    disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" /> Updating...
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
