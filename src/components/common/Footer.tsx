import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-premium mt-auto">
            <div className="container-fluid px-4 px-lg-5">
                <div className="row align-items-center justify-content-between g-3">
                    <div className="col-12 col-md-auto text-center text-md-start">
                        <Link to="/" className="text-decoration-none fw-bold fs-5 text-white">
                            Exam<span style={{ color: "var(--color-primary-500)" }}>Sys</span>
                        </Link>
                        <span className="ms-3" style={{ fontSize: "0.85rem" }}>
                            &copy; {currentYear} {t("common.footer_rights")}
                        </span>
                    </div>
                    <div className="col-12 col-md-auto">
                        <div
                            className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 gap-md-4"
                            style={{ fontSize: "0.85rem" }}
                        >
                            <Link to="/about" className="text-decoration-none">
                                {t("common.footer_about")}
                            </Link>
                            <Link to="/contact" className="text-decoration-none">
                                {t("common.footer_contact")}
                            </Link>
                            <Link to="/support" className="text-decoration-none">
                                {t("common.footer_help")}
                            </Link>
                            <Link to="/privacy" className="text-decoration-none">
                                {t("common.footer_privacy")}
                            </Link>
                            <Link to="/terms" className="text-decoration-none">
                                {t("common.footer_terms")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
