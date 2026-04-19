import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
