type SwitchInputProps = {
    id: string;
    optionLeft: string;
    optionRight: string;
    value: string;
    onChange: (value: string) => void;
};

const SwitchInput = ({ id, optionLeft, optionRight, value, onChange }: SwitchInputProps) => {
    const checked = value === optionRight;

    return (
        <div className="form-check form-switch ps-0 gap-2 d-flex justify-content-start align-items-center">
            <span>{optionLeft}</span>
            <input
                className="form-check-input mx-1"
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked ? optionRight : optionLeft)}
            />
            <span>{optionRight}</span>
        </div>
    );
};

export default SwitchInput;
