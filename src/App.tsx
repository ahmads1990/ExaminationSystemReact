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
import SubmissionsPage from "./pages/instructor/SubmissionsPage";
import StudentCoursesPage from "./pages/student/CoursesPage";
import StudentDashboardPage from "./pages/student/DashboardPage";
import ExamStartPage from "./pages/student/ExamStartPage";
import ExamTakingPage from "./pages/student/ExamTakingPage";
import ExamResultPage from "./pages/student/ExamResultPage";
import ExamHistoryPage from "./pages/student/ExamHistoryPage";
import { UserRole } from "./types/auth";
import { useAuth } from "./contexts/AuthContext";
import SettingsPage from "./pages/common/SettingsPage";
import HelpSupportPage from "./pages/common/HelpSupportPage";
import CalendarPage from "./pages/student/CalendarPage";
import AnalyticsPage from "./pages/instructor/AnalyticsPage";
import GradingPage from "./pages/instructor/GradingPage";
import TermsOfServicePage from "./pages/common/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/common/PrivacyPolicyPage";
import AboutPage from "./pages/common/AboutPage";
import ContactPage from "./pages/common/ContactPage";
import ProfilePage from "./pages/common/ProfilePage";

const RootRedirect = () => {
    const { user } = useAuth();
    if (user?.role === UserRole.Instructor) {
        return <Navigate to="/instructor/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
};

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

                    {/* Focused Exam Taking Layout/Page - Outside MainLayout */}
                    <Route element={<ProtectedRoute allowedRoles={[UserRole.Student]} />}>
                        <Route path="student/exams/take" element={<ExamTakingPage />} />
                    </Route>

                    {/* Dashboard / Main Routes */}
                    <Route element={<MainLayout />}>
                        {/* Redirect root to dashboard if auth */}
                        <Route path="/" element={<RootRedirect />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="change-password" element={<ChangePasswordPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="support" element={<HelpSupportPage />} />
                            <Route path="terms" element={<TermsOfServicePage />} />
                            <Route path="privacy" element={<PrivacyPolicyPage />} />
                            <Route path="about" element={<AboutPage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                        </Route>

                        {/* Instructor Only Routes */}
                        <Route element={<ProtectedRoute allowedRoles={[UserRole.Instructor]} />}>
                            <Route path="instructor/dashboard" element={<DashboardPage />} />
                            <Route path="instructor/courses" element={<CoursesPage />} />
                            <Route path="instructor/exams" element={<ExamsPage />} />
                            <Route path="instructor/exams/:examId/questions" element={<ExamQuestionsPage />} />
                            <Route path="instructor/exams/:examId/submissions" element={<SubmissionsPage />} />
                            <Route path="instructor/grading" element={<GradingPage />} />
                            <Route path="instructor/analytics" element={<AnalyticsPage />} />
                            <Route path="questions" element={<Navigate to="/instructor/exams" replace />} />
                        </Route>

                        {/* Student Only Routes */}
                        <Route element={<ProtectedRoute allowedRoles={[UserRole.Student]} />}>
                            <Route path="student/dashboard" element={<StudentDashboardPage />} />
                            <Route path="courses" element={<StudentCoursesPage />} />
                            <Route path="student/exams/:examId/start" element={<ExamStartPage />} />
                            <Route path="student/exams/result" element={<ExamResultPage />} />
                            <Route path="student/history" element={<ExamHistoryPage />} />
                            <Route path="student/calendar" element={<CalendarPage />} />
                        </Route>

                        <Route path="unauthorized" element={<UnauthorizedPage />} />
                    </Route>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
