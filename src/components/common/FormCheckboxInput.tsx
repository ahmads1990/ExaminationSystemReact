type FormCheckboxProps = {
    id: string;
    name: string;
    label: React.ReactNode;
    checked?: boolean;
    required?: boolean;
    onChange?: (checked: boolean) => void;
};

const FormCheckbox = ({ id, name, label, checked = false, required = false, onChange }: FormCheckboxProps) => {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                name={name}
                id={id}
                checked={checked}
                required={required}
                onChange={(e) => onChange?.(e.target.checked)}
            />
            <label className="form-check-label text-secondary" htmlFor={id}>
                {label}
            </label>
        </div>
    );
};

export default FormCheckbox;
