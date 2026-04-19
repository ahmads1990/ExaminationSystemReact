import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleNavbar = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar navbar-expand-lg navbar-premium sticky-top">
            <div className="container-fluid px-4 px-lg-5">
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
                    {/* SECTION 2: CENTERED LINKS */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center gap-1">
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom" to="/">
                                Questions
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom" to="/login">
                                Login
                            </NavLink>
                        </li>    <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom" to="/register">
                                Registration
                            </NavLink>
                        </li>

                        {/* Dropdown for Resources (Placeholder) */}
                        <li className="nav-item dropdown" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
                            <a
                                className={`nav-link nav-link-custom dropdown-toggle ${resourcesOpen ? "show" : ""}`}
                                href="#"
                                role="button"
                                aria-expanded={resourcesOpen}
                            >
                                Resources
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-custom ${resourcesOpen ? "show" : ""}`} style={{ marginTop: 0 }}>
                                <li><a className="dropdown-item dropdown-item-custom" href="#">Study Guides</a></li>
                                <li><a className="dropdown-item dropdown-item-custom" href="#">Past Papers</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item dropdown-item-custom" href="#">Community Forum</a></li>
                            </ul>
                        </li>

                        {/* TODO: Delete this temporary link later */}
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom text-warning" to="/verify-email">
                                [TEST OTP]
                            </NavLink>
                        </li>

                        {/* TODO: Delete this temporary link later */}
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom text-warning" to="/forgot-password">
                                [FORGOT PASS]
                            </NavLink>
                        </li>

                        {/* TODO: Delete this temporary link later */}
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom text-warning" to="/change-password">
                                [CHANGE PASS]
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom" to="/docs">
                                Docs
                            </NavLink>
                        </li>
                    </ul>

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
