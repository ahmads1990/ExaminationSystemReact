import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole } from "../../types/auth";
import { Menu } from "lucide-react";

interface NavbarProps {
    onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    const toggleNavbar = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar navbar-expand-lg navbar-premium sticky-top">
            <div className="container-fluid px-4 px-lg-5">
                {/* Mobile Sidebar Toggle Button */}
                {isAuthenticated && onToggleSidebar && (
                    <button
                        type="button"
                        className="btn btn-link text-dark p-0 me-3 d-lg-none border-0 shadow-none d-flex align-items-center"
                        onClick={onToggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>
                )}

                {/* SECTION 1: LOGO */}
                <Link className="navbar-brand navbar-brand-text fw-bold fs-4" to="/">
                    Exam<span style={{ color: "var(--color-primary-500)" }}>Sys</span>
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    onClick={toggleNavbar}
                    aria-controls="mainNavbar"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Content */}
                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="mainNavbar">
                    {/* SECTION 2: CENTERED LINKS REMOVED */}
                    <div className="mx-auto" />


                    {/* SECTION 3: AUTH / USER ACTIONS */}
                    <div className="d-flex align-items-center gap-3">
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-auth-outline text-decoration-none">
                                    Log In
                                </Link>
                                <Link to="/register" className="btn btn-auth-primary text-decoration-none">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
