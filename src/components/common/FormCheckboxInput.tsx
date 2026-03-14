import { Form } from "react-bootstrap";

type FormCheckboxInputProps = {
    id: string;
    name: string;
    label: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
};

const FormCheckboxInput = ({
    id,
    name,
    label,
    checked,
    onChange,
    error,
    required = false,
    disabled = false
}: FormCheckboxInputProps) => {
    return (
        <div className="mb-3">
            <Form.Check
                type="checkbox"
                id={id}
                name={name}
                label={label}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                isInvalid={!!error}
                required={required}
                disabled={disabled}
            />
            {error && (
                <Form.Control.Feedback type="invalid" className="d-block">
                    {error}
                </Form.Control.Feedback>
            )}
        </div>
    );
};

export default FormCheckboxInput;
