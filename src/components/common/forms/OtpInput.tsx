import React, { ClipboardEvent, KeyboardEvent, useRef, useState } from "react";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange, error }) => {
    // Fill array with digits from value or empty strings
    const [otp, setOtp] = useState<string[]>(
        Array(length)
            .fill("")
            .map((_, i) => value[i] || "")
    );
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1); // Keep only the last typed character
        setOtp(newOtp);

        // Join array and call parent handler
        const combined = newOtp.join("");
        onChange(combined);

        // Auto focus to the next input
        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        // Handle Backspace deleting and focusing previous
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle Arrow movements
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < length; i++) {
                newOtp[i] = pastedData[i] || "";
            }
            setOtp(newOtp);
            onChange(newOtp.join(""));

            // Auto focus to the next empty box or the last box
            const focusIndex = Math.min(pastedData.length, length - 1);
            if (inputRefs.current[focusIndex]) {
                inputRefs.current[focusIndex]?.focus();
            }
        }
    };

    return (
        <div className="d-flex justify-content-center gap-2" dir="ltr">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`form-control text-center fw-bold fs-4 user-select-all transition-all duration-200 ${
                        error ? "border-danger bg-danger-subtle text-danger" : "border-primary-subtle"
                    }`}
                    style={{
                        width: "3.5rem",
                        height: "4rem",
                        borderRadius: "0.75rem",
                        boxShadow: digit ? "0 0 0 0.25rem rgba(13, 110, 253, 0.1)" : "none",
                        outline: "none"
                    }}
                    onFocus={(e) => {
                        e.target.select();
                        e.target.style.boxShadow = error
                            ? "0 0 0 0.25rem rgba(220, 53, 69, 0.25)"
                            : "0 0 0 0.25rem rgba(13, 110, 253, 0.25)";
                    }}
                    onBlur={(e) => {
                        e.target.style.boxShadow = digit ? "0 0 0 0.25rem rgba(13, 110, 253, 0.1)" : "none";
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInput;
