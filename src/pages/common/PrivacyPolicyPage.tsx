import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, Container } from "react-bootstrap";

const PrivacyPolicyPage = () => {
    const { t } = useTranslation();

    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <Card className="border-0 shadow-sm rounded-4 bg-white p-5">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-success-subtle p-3 text-success">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">{t("common.privacy_title")}</h1>
                        <span className="text-secondary small">{t("common.privacy_updated")}</span>
                    </div>
                </div>

                <div className="text-secondary d-flex flex-column gap-4" style={{ lineHeight: 1.6 }}>
                    <section>
                        <h5 className="fw-bold text-dark">{t("common.privacy_h1")}</h5>
                        <p>
                            {t("common.privacy_p1")}
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">{t("common.privacy_h2")}</h5>
                        <p>
                            {t("common.privacy_p2")}
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">{t("common.privacy_h3")}</h5>
                        <p>
                            {t("common.privacy_p3")}
                        </p>
                    </section>

                    <section>
                        <h5 className="fw-bold text-dark">{t("common.privacy_h4")}</h5>
                        <p>
                            {t("common.privacy_p4")}
                        </p>
                    </section>
                </div>
            </Card>
        </Container>
    );
};

export default PrivacyPolicyPage;
