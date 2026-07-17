import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    const { t } = useTranslation();

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <h1 className="display-1 fw-bold text-danger mb-3">403</h1>
            <h2 className="mb-4">{t("common.unauthorized_title")}</h2>
            <p className="text-muted mb-4 text-center" style={{ maxWidth: "400px" }}>
                {t("common.unauthorized_desc")}
            </p>
            <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
                {t("common.not_found_btn")}
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
