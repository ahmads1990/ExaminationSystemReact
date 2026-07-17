import { Globe, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import UserMenu from "./UserMenu";

interface NavbarProps {
    onToggleSidebar?: () => void;
}

const languagesList = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" }
];

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();

    const toggleNavbar = () => setIsOpen(!isOpen);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("app_lang", lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

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
                        {/* Language Selector Dropdown */}
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                as="button"
                                className="btn btn-link text-decoration-none text-secondary p-0 d-flex align-items-center justify-content-center border-0 shadow-none btn-theme-toggle no-caret"
                                id="languageDropdown"
                                title="Change Language"
                            >
                                <Globe size={18} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-custom shadow border-0 p-1">
                                {languagesList.map((lang) => (
                                    <Dropdown.Item
                                        key={lang.code}
                                        className={`d-flex align-items-center gap-2 rounded-2 ${i18n.language === lang.code ? "active bg-primary-subtle text-primary" : ""}`}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        <span>{lang.flag}</span> {lang.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="btn-theme-toggle"
                            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-auth-outline text-decoration-none">
                                    {t("navbar.login")}
                                </Link>
                                <Link to="/register" className="btn btn-auth-primary text-decoration-none">
                                    {t("navbar.get_started")}
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
