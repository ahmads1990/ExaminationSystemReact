import { FloatingLabel, Form } from "react-bootstrap";

type SelectInputProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    error?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
};

const SelectInput = ({
    id,
    name,
    label,
    value,
    onChange,
    options,
    error,
    required = false,
    disabled = false,
    placeholder = "Select an option"
}: SelectInputProps) => {
    return (
        <div className="mb-3">
            <FloatingLabel controlId={id} label={label}>
                <Form.Select
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={!!error}
                    required={required}
                    disabled={disabled}
                    className="bg-light border-light-subtle focus-ring"
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Form.Select>
                {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
            </FloatingLabel>
        </div>
    );
};

export default SelectInput;
