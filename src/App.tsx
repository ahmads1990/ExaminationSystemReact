import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UnauthorizedPage from "./pages/errors/UnauthorizedPage";
import CoursesPage from "./pages/instructor/CoursesPage";
import ExamsPage from "./pages/instructor/ExamsPage";
import ExamQuestionsPage from "./pages/instructor/ExamQuestionsPage";
import DashboardPage from "./pages/instructor/DashboardPage";
import { UserRole } from "./types/auth";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                    {/* Auth Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Route>

                    {/* Dashboard / Main Routes */}
                    <Route element={<MainLayout />}>
                        {/* Redirect root to dashboard if auth */}
                        <Route path="/" element={<Navigate to="/instructor/dashboard" replace />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="change-password" element={<ChangePasswordPage />} />
                        </Route>

                        {/* Instructor Only Routes */}
                        <Route element={<ProtectedRoute allowedRoles={[UserRole.Instructor]} />}>
                            <Route path="instructor/dashboard" element={<DashboardPage />} />
                            <Route path="instructor/courses" element={<CoursesPage />} />
                            <Route path="instructor/exams" element={<ExamsPage />} />
                            <Route path="instructor/exams/:examId/questions" element={<ExamQuestionsPage />} />
                            <Route path="questions" element={<Navigate to="/instructor/exams" replace />} />
                        </Route>

                        <Route path="unauthorized" element={<UnauthorizedPage />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
