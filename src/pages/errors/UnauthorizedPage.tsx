import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <h1 className="display-1 fw-bold text-danger mb-3">403</h1>
            <h2 className="mb-4">Access Denied</h2>
            <p className="text-muted mb-4 text-center" style={{ maxWidth: "400px" }}>
                You don't have permission to access this page. Please contact your administrator if you believe this is
                a mistake.
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
