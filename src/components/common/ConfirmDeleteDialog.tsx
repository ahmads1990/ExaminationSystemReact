import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Spinner } from "react-bootstrap";

interface ConfirmDeleteDialogProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description?: string;
    confirmLabel?: string;
}

const ConfirmDeleteDialog = ({
    show,
    onHide,
    onConfirm,
    title,
    description,
    confirmLabel
}: ConfirmDeleteDialogProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();

    const finalDescription = description || t("common.cannot_undone", "This action cannot be undone.");
    const finalConfirmLabel = confirmLabel || t("common.delete", "Delete");

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="sm">
            <Modal.Body className="p-4 text-center">
                {/* Icon */}
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                    style={{ width: 56, height: 56, backgroundColor: "#fef2f2" }}
                >
                    <Trash2 size={24} style={{ color: "var(--color-error)" }} />
                </div>

                <h5 className="fw-bold mb-1">{title}</h5>
                <p className="text-muted small mb-4">{finalDescription}</p>

                <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-secondary px-4" onClick={onHide} disabled={isDeleting}>
                        {t("common.cancel", "Cancel")}
                    </button>
                    <button type="button" className="btn btn-danger px-4" onClick={handleConfirm} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {finalConfirmLabel}...
                            </>
                        ) : (
                            finalConfirmLabel
                        )}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmDeleteDialog;
