import { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../contexts/AuthContext";

const AuthLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light position-relative overflow-hidden">
            {/* Background Decorative Elements (Lucid Focus Brand) */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
                <div className="position-absolute top-0 start-0 opacity-10 rounded-circle" style={{ backgroundColor: 'var(--color-primary-500)', width: '600px', height: '600px', transform: 'translate(-20%, -20%)', filter: 'blur(100px)' }}></div>
                <div className="position-absolute bottom-0 end-0 opacity-10 rounded-circle" style={{ backgroundColor: 'var(--color-accent-500)', width: '500px', height: '500px', transform: 'translate(20%, 20%)', filter: 'blur(80px)' }}></div>
            </div>

            <Container className="position-relative" style={{ zIndex: 1 }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="border-0 card-custom position-relative overflow-hidden">
                            <div className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: '4px' }}></div>
                            <Card.Body className="p-4 p-md-5">
                                <Outlet />
                            </Card.Body>
                        </Card>

                        <div className="text-center mt-4 text-muted small">
                            &copy; {new Date().getFullYear()} Examination System. All rights reserved.
                        </div>
                    </Col>
                </Row>
            </Container>
            

            </div>
        </>
    );
};

export default AuthLayout;
