import { Award, Cpu, Info, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, Col, Container, Row } from "react-bootstrap";

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <Container className="py-4" style={{ maxWidth: "900px" }}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-info-subtle p-3 text-info">
                        <Info size={28} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">{t("common.about_title")}</h1>
                        <span className="text-secondary small">{t("common.about_subtitle")}</span>
                    </div>
                </div>

                <div className="text-secondary d-flex flex-column gap-4" style={{ lineHeight: 1.6 }}>
                    <p>
                        {t("common.about_para")}
                    </p>

                    <Row className="g-4 mt-2">
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-primary mb-2">
                                    <Cpu size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">{t("common.about_card1_title")}</h6>
                                <p className="small mb-0 text-secondary">
                                    {t("common.about_card1_desc")}
                                </p>
                            </Card>
                        </Col>
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-success mb-2">
                                    <Award size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">{t("common.about_card2_title")}</h6>
                                <p className="small mb-0 text-secondary">
                                    {t("common.about_card2_desc")}
                                </p>
                            </Card>
                        </Col>
                        <Col xs={12} md={4}>
                            <Card className="border p-3 rounded-3 text-center h-100 bg-light-subtle">
                                <div className="text-warning mb-2">
                                    <ShieldAlert size={24} />
                                </div>
                                <h6 className="fw-bold text-dark">{t("common.about_card3_title")}</h6>
                                <p className="small mb-0 text-secondary">
                                    {t("common.about_card3_desc")}
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Container>
    );
};

export default AboutPage;
