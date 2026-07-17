import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "react-bootstrap";
import { ApiErrorCode } from "../../api/contracts/apiErrorCode";

interface ErrorDialogProps {
    show: boolean;
    onHide: () => void;
    error?: unknown; // raw Axios error — parsed automatically
    message?: string; // plain message when no Axios error
    details?: string[];
    variant?: "error" | "success";
}

function parseApiError(error: unknown, t: any): { message: string; details: string[] } {
    const data = (error as any)?.response?.data;
    if (!data) return { message: (error as any)?.message ?? t("common.unexpected_error", "An unexpected error occurred."), details: [] };

    const details: string[] = [];
    if (data.errorCode === ApiErrorCode.ValidationFailed && data.data && typeof data.data === "object") {
        Object.entries(data.data as Record<string, unknown>).forEach(([field, val]) => {
            if (Array.isArray(val)) val.forEach((msg) => details.push(`${field}: ${msg}`));
            else if (typeof val === "string") details.push(`${field}: ${val}`);
        });
    }

    return { message: data.message ?? t("common.occurred_error", "An error occurred."), details };
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ show, onHide, error, message, details = [], variant = "error" }) => {
    const { t } = useTranslation();
    const parsed = useMemo(
        () => (error ? parseApiError(error, t) : { message: message ?? "", details }),
        [error, message, details, t]
    );

    return (
        <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
            <Modal.Body className="p-4 text-center">
                <p className="mb-3">{parsed.message}</p>

                {parsed.details.length > 0 && (
                    <div
                        className="text-start bg-light p-3 rounded-3 mb-3 overflow-auto border border-light-subtle"
                        style={{ maxHeight: 180 }}
                    >
                        <ul className="mb-0 ps-3 small text-secondary">
                            {parsed.details.map((d, i) => (
                                <li key={i} className="mb-1">
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button
                    variant={variant === "success" ? "success" : "danger"}
                    className="px-5 rounded-3 fw-medium"
                    onClick={onHide}
                >
                    {t("common.ok", "OK")}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ErrorDialog;
