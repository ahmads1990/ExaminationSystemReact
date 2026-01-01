type FormInputProps = {
    id: string;
    type: string;
    name: string;
    placeholder: string;
    label: string;
    value: any;
    onChange: (value: any) => void;
    required?: boolean;
};

const FormInput = ({ id, type, name, placeholder, label, value, onChange, required = false }: FormInputProps) => {
    return (
        <div className="form-floating">
            <input
                type={type}
                className="form-control form-control-sm"
                name={name}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
                required={required}
            />
            <label htmlFor={id} className="form-label">
                {label}
            </label>
        </div>
    );
};

export default FormInput;
