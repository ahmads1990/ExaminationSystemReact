import { Trash2 } from "lucide-react";
import { useState } from "react";
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
    description = "This action cannot be undone.",
    confirmLabel = "Delete"
}: ConfirmDeleteDialogProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

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
                <p className="text-muted small mb-4">{description}</p>

                <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-secondary px-4" onClick={onHide} disabled={isDeleting}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-danger px-4" onClick={handleConfirm} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {confirmLabel}ing...
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

export default ConfirmDeleteDialog;
