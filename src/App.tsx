import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import AboutPage from "./pages/common/AboutPage";
import ContactPage from "./pages/common/ContactPage";
import HelpSupportPage from "./pages/common/HelpSupportPage";
import PrivacyPolicyPage from "./pages/common/PrivacyPolicyPage";
import ProfilePage from "./pages/common/ProfilePage";
import SettingsPage from "./pages/common/SettingsPage";
import TermsOfServicePage from "./pages/common/TermsOfServicePage";
import UnauthorizedPage from "./pages/errors/UnauthorizedPage";
import AnalyticsPage from "./pages/instructor/AnalyticsPage";
import CoursesPage from "./pages/instructor/CoursesPage";
import DashboardPage from "./pages/instructor/DashboardPage";
import ExamQuestionsPage from "./pages/instructor/ExamQuestionsPage";
import ExamsPage from "./pages/instructor/ExamsPage";
import GradingPage from "./pages/instructor/GradingPage";
import SubmissionsPage from "./pages/instructor/SubmissionsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CalendarPage from "./pages/student/CalendarPage";
import StudentCoursesPage from "./pages/student/CoursesPage";
import StudentDashboardPage from "./pages/student/DashboardPage";
import ExamHistoryPage from "./pages/student/ExamHistoryPage";
import ExamResultPage from "./pages/student/ExamResultPage";
import ExamStartPage from "./pages/student/ExamStartPage";
import ExamTakingPage from "./pages/student/ExamTakingPage";
import { UserRole } from "./types/auth";
import LandingPage from "./pages/landing/LandingPage";

const RootRoute = () => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return null;
    }

    if (isAuthenticated && user) {
        if (user.role === UserRole.Instructor) {
            return <Navigate to="/instructor/dashboard" replace />;
        }
        return <Navigate to="/student/dashboard" replace />;
    }

    return <LandingPage />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<RootRoute />} />

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
                    {/* Publicly accessible pages in MainLayout */}
                    <Route path="support" element={<HelpSupportPage />} />
                    <Route path="terms" element={<TermsOfServicePage />} />
                    <Route path="privacy" element={<PrivacyPolicyPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="change-password" element={<ChangePasswordPage />} />
                        <Route path="settings" element={<SettingsPage />} />
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
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
