import { useEffect, useState, useCallback, useRef } from "react";
import { Nav, Offcanvas } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
    BookOpen, 
    LayoutDashboard, 
    FileText, 
    History, 
    Search, 
    Award, 
    Calendar, 
    Settings, 
    HelpCircle, 
    BarChart2, 
    CheckSquare,
    X
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/auth";

import { LucideIcon } from "lucide-react";

interface NavItem {
    to: string;
    icon: LucideIcon;
    label: string;
}

const SidebarLink = ({ to, icon: Icon, label, onClick }: { to: string; icon: LucideIcon; label: string; onClick?: () => void }) => (
    <NavLink 
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `nav-link d-flex align-items-center gap-3 rounded-2 px-3 py-2 ${isActive ? 'bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
    >
        <Icon size={18} style={{ flexShrink: 0 }} />
        <span className="text-truncate">{label}</span>
    </NavLink>
);

const MainLayout = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();

    // Resizable Sidebar Logic
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const isResizing = useRef(false);

    // Sidebar Search & Mobile Toggle Logic
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
        mouseDownEvent.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }, []);

    const resize = useCallback((mouseMoveEvent: MouseEvent) => {
        if (isResizing.current) {
            // Constrain sidebar width between 200px and 450px
            const newWidth = Math.max(200, Math.min(450, mouseMoveEvent.clientX));
            setSidebarWidth(newWidth);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return null;
    }

    // Student specific links
    const studentItems: NavItem[] = [
        { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/courses", icon: BookOpen, label: "Courses & Enrollment" },
        { to: "/student/history", icon: History, label: "My Exam History" },
        { to: "/student/calendar", icon: Calendar, label: "Academic Calendar" },
        { to: "/support", icon: HelpCircle, label: "Help & Support" }
    ];

    // Instructor specific links
    const instructorItems: NavItem[] = [
        { to: "/instructor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/instructor/courses", icon: BookOpen, label: "My Courses" },
        { to: "/instructor/exams", icon: FileText, label: "Exams" },
        { to: "/instructor/grading", icon: CheckSquare, label: "Grade Submissions" },
        { to: "/instructor/analytics", icon: BarChart2, label: "Analytics & Reports" },
        { to: "/support", icon: HelpCircle, label: "Help & Support" }
    ];

    const currentItems = user?.role === UserRole.Instructor ? instructorItems : studentItems;

    // Filter items based on search input query
    const filteredItems = currentItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSidebarContent = (isMobile = false) => (
        <div className="p-3 h-100 d-flex flex-column gap-2">
            {/* Premium Styled Section Header */}
            <div className="px-1 mb-1 d-flex align-items-center justify-content-between">
                <span className="text-uppercase text-secondary fw-bold tracking-wider" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                    Navigation
                </span>
                <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.62rem', fontWeight: 600 }}>
                    {user?.role === UserRole.Instructor ? "Instructor" : "Student"}
                </span>
            </div>

            {/* Search Bar inside Sidebar */}
            <div className="mb-2">
                <div className="position-relative">
                    <Search 
                        className="position-absolute top-50 start-0 translate-middle-y text-muted opacity-50" 
                        size={14} 
                        style={{ marginLeft: '10px' }}
                    />
                    <input
                        type="text"
                        className="form-control form-control-sm bg-light border-0 rounded-2 text-dark"
                        placeholder="Quick search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            fontSize: '0.8rem',
                            paddingLeft: '2.1rem',
                            paddingRight: searchQuery ? '1.8rem' : '0.5rem',
                            paddingTop: '0.45rem',
                            paddingBottom: '0.45rem',
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                            onClick={() => setSearchQuery("")}
                            style={{ 
                                marginRight: '8px', 
                                width: '18px', 
                                height: '18px',
                                lineHeight: 1
                            }}
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Links List */}
            <Nav className="flex-column gap-1 overflow-auto flex-grow-1">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        <SidebarLink 
                            key={index}
                            to={item.to} 
                            icon={item.icon} 
                            label={item.label} 
                            onClick={isMobile ? () => setShowMobileSidebar(false) : undefined}
                        />
                    ))
                ) : (
                    <div className="text-center py-4 text-muted" style={{ fontSize: '0.8rem' }}>
                        No matches found
                    </div>
                )}
            </Nav>
        </div>
    );

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* TOP NAVIGATION */}
            <Navbar onToggleSidebar={() => setShowMobileSidebar(true)} />

            {/* MOBILE SIDEBAR DRAWERS */}
            <Offcanvas 
                show={showMobileSidebar} 
                onHide={() => setShowMobileSidebar(false)}
                className="d-lg-none"
                style={{ width: "280px" }}
            >
                <Offcanvas.Header closeButton className="border-bottom">
                    <Offcanvas.Title className="fw-bold text-dark fs-5">
                        Exam<span style={{ color: "var(--color-primary-500)" }}>Sys</span>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 bg-white">
                    {renderSidebarContent(true)}
                </Offcanvas.Body>
            </Offcanvas>

            {/* MAIN CONTAINER */}
            <div className="d-flex flex-grow-1">
                {/* SIDEBAR (Desktop) */}
                <aside 
                    className="bg-white border-end d-none d-lg-block position-relative" 
                    style={{ 
                        width: `${sidebarWidth}px`, 
                        minWidth: `${sidebarWidth}px`, 
                        minHeight: "calc(100vh - 60px)",
                        transition: isResizing.current ? 'none' : 'width 0.1s ease'
                    }}
                >
                    {renderSidebarContent(false)}

                    {/* Resize Handle on Right Border */}
                    <div
                        onMouseDown={startResizing}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '4px',
                            height: '100%',
                            cursor: 'col-resize',
                            backgroundColor: 'transparent',
                            transition: 'background-color 0.2s ease',
                            zIndex: 10
                        }}
                        className="sidebar-resize-handle"
                    />
                </aside>

                {/* RIGHT SIDE CONTAINER */}
                <div className="d-flex flex-column flex-grow-1 min-vh-0">
                    {/* CONTENT AREA */}
                    <main className="flex-grow-1 p-4 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default MainLayout;
