import { FloatingLabel, Form } from "react-bootstrap";

type TextAreaInputProps = {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    maxLength?: number;
};

const TextAreaInput = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 3,
    maxLength
}: TextAreaInputProps) => {
    return (
        <div className="mb-3">
            <FloatingLabel controlId={id} label={label}>
                <Form.Control
                    as="textarea"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={!!error}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    style={{ height: `${rows * 33}px` }}
                    className="bg-light border-light-subtle focus-ring"
                />
                {error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </FloatingLabel>
        </div>
    );
};

export default TextAreaInput;
