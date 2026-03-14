import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    // TODO: Replace with actual auth state from context
    const [isLoggedIn, setIsLoggedIn] = useState(true); 

    const toggleNavbar = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar navbar-expand-lg navbar-premium sticky-top">
            <div className="container-fluid px-4 px-lg-5">
                {/* SECTION 1: LOGO */}
                <Link className="navbar-brand navbar-brand-text" to="/">
                    Exam<span style={{ color: "var(--primary-color)" }}>Sys</span>
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

                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-custom" to="/docs">
                                Docs
                            </NavLink>
                        </li>
                    </ul>

                    {/* SECTION 3: AUTH / USER ACTIONS */}
                    <div className="d-flex align-items-center gap-3">
                        {isLoggedIn ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-auth-outline text-decoration-none">
                                    Log In
                                </Link>
                                <Link to="/registration" className="btn btn-auth-primary text-decoration-none">
                                    Get Started
                                </Link>
                            </>
                        )}
                        {/* Dev Toggle for demo purposes */}
                        <div className="form-check form-switch ms-2 d-none d-md-block" title="Toggle Auth State">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={isLoggedIn}
                                onChange={() => setIsLoggedIn(!isLoggedIn)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
