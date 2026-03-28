import { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";

const MainLayout = () => {
    const { isAuthenticated, isLoading } = useAuthContext();
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
                            <NavLink to="/" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 rounded-2 px-3 py-2 ${isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/questions" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 rounded-2 px-3 py-2 ${isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}>
                                <BookOpen size={18} />
                                <span>Question Bank</span>
                            </NavLink>
                             {/* Add more links here */}
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

