import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthContext();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout API failed, continuing local cleanup", error);
        } finally {
            logout(); // Synchronously clear state in AuthContext
        }
    };

    // Use context user, fallback to dummy data if missing
    const displayUser = {
        name: user?.name || "Admin",
        avatar: "https://ui-avatars.com/api/?name=" + (user?.name || "Admin") + "&background=4f46e5&color=fff&rounded=true"
    };

    return (
        <div className="dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <a
                href="#"
                className={`d-flex align-items-center text-decoration-none dropdown-toggle no-arrow gap-2 ${isOpen ? "show" : ""}`}
                role="button"
                aria-expanded={isOpen}
                style={{ cursor: "pointer" }}
            >
                <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="rounded-circle border border-2 border-white shadow-sm"
                    width="40"
                    height="40"
                />
                <div className="d-none d-lg-block text-start">
                    <div className="fw-bold text-dark small">{displayUser.name}</div>
                    {/* Optional: Add role or status here */}
                </div>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-custom border-0 shadow-lg ${isOpen ? "show" : ""}`} style={{ marginTop: 0 }}>
                <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/profile">
                        <i className="bi bi-person me-2"></i>Profile
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/settings">
                        <i className="bi bi-gear me-2"></i>Settings
                    </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                    <a href="#" className="dropdown-item dropdown-item-custom text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Log Out
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default UserMenu;
