import { FloatingLabel, Form } from "react-bootstrap";

type FormPasswordInputProps = {
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
};

const FormPasswordInput = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    minLength
}: FormPasswordInputProps) => {
    return (
        <div className="mb-3">
            <FloatingLabel controlId={id} label={label}>
                <Form.Control
                    type="password"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={!!error}
                    required={required}
                    disabled={disabled}
                    minLength={minLength}
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

export default FormPasswordInput;
