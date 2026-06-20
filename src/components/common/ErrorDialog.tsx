import React, { useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { ApiErrorCode } from "../../api/contracts/apiErrorCode";

interface ErrorDialogProps {
    show: boolean;
    onHide: () => void;
    error?: unknown;       // raw Axios error — parsed automatically
    message?: string;      // plain message when no Axios error
    details?: string[];
    variant?: "error" | "success";
}

function parseApiError(error: unknown): { message: string; details: string[] } {
    const data = (error as any)?.response?.data;
    if (!data) return { message: (error as any)?.message ?? "An unexpected error occurred.", details: [] };

    const details: string[] = [];
    if (data.errorCode === ApiErrorCode.ValidationFailed && data.data && typeof data.data === "object") {
        Object.entries(data.data as Record<string, unknown>).forEach(([field, val]) => {
            if (Array.isArray(val)) val.forEach((msg) => details.push(`${field}: ${msg}`));
            else if (typeof val === "string") details.push(`${field}: ${val}`);
        });
    }

    return { message: data.message ?? "An error occurred.", details };
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ show, onHide, error, message, details = [], variant = "error" }) => {
    const parsed = useMemo(
        () => (error ? parseApiError(error) : { message: message ?? "", details }),
        [error, message, details]
    );

    return (
        <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
            <Modal.Body className="p-4 text-center">
                <p className="mb-3">{parsed.message}</p>

                {parsed.details.length > 0 && (
                    <div className="text-start bg-light p-3 rounded-3 mb-3 overflow-auto border border-light-subtle" style={{ maxHeight: 180 }}>
                        <ul className="mb-0 ps-3 small text-secondary">
                            {parsed.details.map((d, i) => <li key={i} className="mb-1">{d}</li>)}
                        </ul>
                    </div>
                )}

                <Button variant={variant === "success" ? "success" : "danger"} className="px-5 rounded-3 fw-medium" onClick={onHide}>
                    OK
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ErrorDialog;
