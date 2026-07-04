import { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, FileText, History } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/auth";

import { LucideIcon } from "lucide-react";

const SidebarLink = ({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) => (
    <NavLink to={to} className={({ isActive }) => `nav-link d-flex align-items-center gap-3 rounded-2 px-3 py-2 ${isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}>
        <Icon size={18} />
        <span>{label}</span>
    </NavLink>
);

const MainLayout = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* TOP NAVIGATION */}
            <Navbar />

            {/* MAIN CONTAINER */}
            <div className="d-flex flex-grow-1">
                {/* SIDEBAR (Desktop) */}
                <aside className="bg-white border-end d-none d-lg-block" style={{ width: "260px", minHeight: "calc(100vh - 60px)" }}>
                    <div className="p-3">
                         <small className="text-uppercase text-muted fw-bold tracking-wider" style={{ fontSize: '0.7rem' }}>Menu</small>
                        <Nav className="flex-column mt-2 gap-1">
                            {user?.role === UserRole.Instructor ? (
                                <SidebarLink to="/instructor/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            ) : (
                                <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
                            )}
                            {/* Student Routes */}
                            {user?.role === UserRole.Student && (
                                <>
                                    <SidebarLink to="/courses" icon={BookOpen} label="Browse Courses" />
                                    <SidebarLink to="/student/history" icon={History} label="Exam History" />
                                </>
                            )}

                             {/* Instructor Routes */}
                            {user?.role === UserRole.Instructor && (
                                <>
                                    <SidebarLink to="/instructor/courses" icon={BookOpen} label="My Courses" />
                                    <SidebarLink to="/instructor/exams" icon={FileText} label="Exams" />
                                    <SidebarLink to="/questions" icon={BookOpen} label="Question Bank" />
                                </>
                            )}
                        </Nav>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-grow-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

