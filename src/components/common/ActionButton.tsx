import { ReactNode, ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-warning" | "outline-danger";
    children: ReactNode;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const ActionButton = ({ variant = "primary", children, icon, fullWidth = true, className = "", style, ...props }: ActionButtonProps) => {
    return (
        <button
            className={`btn btn-${variant} d-flex align-items-center justify-content-center gap-2 ${fullWidth ? 'flex-grow-1' : ''} py-2 fw-semibold ${className}`}
            style={{ fontSize: "0.85rem", ...style }}
            {...props}
        >
            {icon}
            {children}
        </button>
    );
};

export default ActionButton;
