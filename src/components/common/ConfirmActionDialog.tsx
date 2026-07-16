import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";

interface ConfirmActionDialogProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description?: string;
    confirmLabel?: string;
    confirmVariant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    icon?: React.ReactNode;
    iconBgColor?: string;
}

const ConfirmActionDialog = ({
    show,
    onHide,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    confirmVariant = "primary",
    icon,
    iconBgColor = "#fef3c7" // light yellow/warning by default
}: ConfirmActionDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Body className="p-4 text-center">
                {/* Icon Container */}
                {icon && (
                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                        style={{ width: 56, height: 56, backgroundColor: iconBgColor }}
                    >
                        {icon}
                    </div>
                )}

                <h5 className="fw-bold mb-1">{title}</h5>
                {description && <p className="text-muted small mb-4">{description}</p>}

                <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-secondary px-4" onClick={onHide} disabled={isLoading}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`btn btn-${confirmVariant} px-4`}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {confirmLabel}...
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmActionDialog;
