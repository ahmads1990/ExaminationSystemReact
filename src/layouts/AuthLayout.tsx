import { Container, Row, Col, Card } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const AuthLayout = () => {
    return (
        <>
            <Navbar />
            <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light position-relative overflow-hidden">
            {/* Background Decorative Elements (Lucid Focus Brand) */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
                <div className="position-absolute top-0 start-0 bg-primary opacity-10 rounded-circle" style={{ width: '600px', height: '600px', transform: 'translate(-20%, -20%) blur(100px)' }}></div>
                <div className="position-absolute bottom-0 end-0 bg-info opacity-10 rounded-circle" style={{ width: '500px', height: '500px', transform: 'translate(20%, 20%) blur(80px)' }}></div>
            </div>

            <Container className="position-relative" style={{ zIndex: 1 }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="border-0 shadow-lg position-relative overflow-hidden glass-card">
                            <div className="position-absolute top-0 start-0 w-100 h-1 bg-gradient-primary"></div>
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
            
            <style>
                {`
                    .glass-card {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        transition: transform 0.3s ease;
                    }
                    .bg-gradient-primary {
                        background: linear-gradient(90deg, #2563EB 0%, #0EA5E9 100%);
                    }
                `}
            </style>
            </div>
        </>
    );
};

export default AuthLayout;
