import { Card, Row, Col } from "react-bootstrap";

interface SkeletonCardProps {
    count?: number;
}

export const SkeletonCard = ({ count = 3 }: SkeletonCardProps) => {
    return (
        <Row className="g-4 mb-4">
            {[...Array(count)].map((_, i) => (
                <Col key={i} xs={12} md={6} xl={4}>
                    <Card className="h-100 border-0 shadow-sm position-relative overflow-hidden skeleton-pulse">
                        {/* Top accent bar placeholder */}
                        <div
                            className="position-absolute top-0 start-0 w-100"
                            style={{ height: "4px", backgroundColor: "#E5E7EB" }}
                        />
                        <Card.Body className="p-4 pt-5 d-flex flex-column gap-3">
                            {/* Title line */}
                            <div className="skeleton-title mb-2" />
                            
                            {/* Description lines */}
                            <div className="d-flex flex-column gap-2 mb-3">
                                <div className="skeleton-line" style={{ width: "100%" }} />
                                <div className="skeleton-line" style={{ width: "92%" }} />
                                <div className="skeleton-line" style={{ width: "85%" }} />
                            </div>

                            {/* Metadata row */}
                            <div className="d-flex gap-3 pt-3 mt-auto border-top">
                                <div className="skeleton-line" style={{ width: "25%", height: "0.875rem" }} />
                                <div className="skeleton-line" style={{ width: "30%", height: "0.875rem" }} />
                                <div className="skeleton-line" style={{ width: "25%", height: "0.875rem" }} />
                            </div>
                        </Card.Body>
                        <Card.Footer className="bg-white border-0 px-4 pb-4 pt-0 d-flex gap-2">
                            <div className="skeleton-line" style={{ width: "70px", height: "36px", borderRadius: "8px" }} />
                            <div className="skeleton-line" style={{ width: "70px", height: "36px", borderRadius: "8px" }} />
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default SkeletonCard;
