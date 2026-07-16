import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Inbox, LucideIcon } from "lucide-react";

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: LucideIcon;
    ctaText?: string;
    ctaLink?: string;
    onCtaClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon: Icon = Inbox,
    ctaText,
    ctaLink,
    onCtaClick
}) => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center p-5 rounded-4 bg-white border border-dashed border-light-subtle shadow-sm my-4" style={{ minHeight: "320px" }}>
            <div className="rounded-circle bg-light p-4 text-secondary mb-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                <Icon size={36} className="text-secondary" style={{ opacity: 0.7 }} />
            </div>
            
            <h4 className="fw-bold text-dark mb-2">{title}</h4>
            <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: "420px", lineHeight: 1.6 }}>
                {message}
            </p>

            {ctaText && (
                <>
                    {ctaLink ? (
                        <Link to={ctaLink} className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-inline-flex align-items-center shadow-sm">
                            {ctaText}
                        </Link>
                    ) : (
                        <Button 
                            onClick={onCtaClick} 
                            className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-inline-flex align-items-center shadow-sm border-0"
                        >
                            {ctaText}
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default EmptyState;
