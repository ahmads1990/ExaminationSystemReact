import { FloatingLabel, Form } from "react-bootstrap";

type TextInputProps = {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    minLength?: number;
    maxLength?: number;
};

const TextInput = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    minLength,
    maxLength
}: TextInputProps) => {
    return (
        <div className="mb-3">
            <FloatingLabel controlId={id} label={label}>
                <Form.Control
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={!!error}
                    required={required}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    className="bg-light border-light-subtle focus-ring"
                />
                {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
            </FloatingLabel>
        </div>
    );
};

export default TextInput;
