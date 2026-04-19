import
{
    RegisterStudentRequest,
    RegisterInstructorRequest,
    LoginRequest
} from "../api/requests/AuthRequests";

export interface ValidationErrors
{
    [ key: string ]: string;
}

// ============================================================================
// Field Validators (reusable)
// ============================================================================

const validateRequiredField = (value: string, fieldName: string): string | undefined =>
{
    if (!value || value.trim() === "")
    {
        return `${fieldName} is required.`;
    }
    return undefined;
};

const validateMinLength = (value: string, minLength: number, fieldName: string): string | undefined =>
{
    if (value && value.length < minLength)
    {
        return `${fieldName} must be at least ${minLength} characters long.`;
    }
    return undefined;
};

const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | undefined =>
{
    if (value && value.length > maxLength)
    {
        return `${fieldName} must not exceed ${maxLength} characters.`;
    }
    return undefined;
};

const validateEmailFormat = (email: string): string | undefined =>
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
    {
        return "Invalid email format.";
    }
    return undefined;
};

const validatePasswordStrength = (password: string): string | undefined =>
{
    if (password.length < 8)
    {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password))
    {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password))
    {
        return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password))
    {
        return "Password must contain at least one digit.";
    }
    if (!/[^a-zA-Z0-9]/.test(password))
    {
        return "Password must contain at least one special character.";
    }
    return undefined;
};

// ============================================================================
// Request Validators (match backend structure)
// ============================================================================

export const validateSharedRegistration = (
    request: { name: string; username: string; email: string; password: string },
    confirmPassword?: string
): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Name validation
    const nameRequired = validateRequiredField(request.name, "Name");
    if (nameRequired) {
        errors.name = nameRequired;
    } else {
        const nameMin = validateMinLength(request.name, 3, "Name");
        const nameMax = validateMaxLength(request.name, 100, "Name");
        if (nameMin) errors.name = nameMin;
        else if (nameMax) errors.name = nameMax;
    }

    // Username validation
    const usernameRequired = validateRequiredField(request.username, "Username");
    if (usernameRequired) {
        errors.username = usernameRequired;
    } else {
        const usernameMin = validateMinLength(request.username, 3, "Username");
        const usernameMax = validateMaxLength(request.username, 50, "Username");
        if (usernameMin) errors.username = usernameMin;
        else if (usernameMax) errors.username = usernameMax;
    }

    // Email validation
    const emailRequired = validateRequiredField(request.email, "Email");
    if (emailRequired) {
        errors.email = emailRequired;
    } else {
        const emailFormat = validateEmailFormat(request.email);
        if (emailFormat) errors.email = emailFormat;
    }

    // Password validation
    const passwordRequired = validateRequiredField(request.password, "Password");
    if (passwordRequired) {
        errors.password = passwordRequired;
    } else {
        const passwordStrength = validatePasswordStrength(request.password);
        if (passwordStrength) errors.password = passwordStrength;
    }

    // Confirm password validation (frontend only)
    if (confirmPassword !== undefined) {
        if (!confirmPassword || confirmPassword.trim() === "") {
            errors.confirmPassword = "Please confirm your password.";
        } else if (request.password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }
    }

    return errors;
};

export const validateRegisterStudentRequest = (
    request: RegisterStudentRequest,
    confirmPassword?: string
): ValidationErrors =>
{
    const errors = validateSharedRegistration(request, confirmPassword);

    // Level validation
    const levelRequired = validateRequiredField(request.level, "Level");
    if (levelRequired)
    {
        errors.level = levelRequired;
    } else
    {
        const levelMax = validateMaxLength(request.level, 50, "Level");
        if (levelMax) errors.level = levelMax;
    }

    // Group validation (optional)
    if (request.group)
    {
        const groupMax = validateMaxLength(request.group, 50, "Group");
        if (groupMax) errors.group = groupMax;
    }

    return errors;
};

export const validateRegisterInstructorRequest = (
    request: RegisterInstructorRequest,
    confirmPassword?: string
): ValidationErrors =>
{
    const errors = validateSharedRegistration(request, confirmPassword);

    // Bio validation (optional)
    if (request.bio)
    {
        const bioMax = validateMaxLength(request.bio, 500, "Bio");
        if (bioMax) errors.bio = bioMax;
    }

    // Specialization validation (optional)
    if (request.specialization)
    {
        const specMax = validateMaxLength(request.specialization, 200, "Specialization");
        if (specMax) errors.specialization = specMax;
    }

    return errors;
};

export const validateLoginRequest = (request: LoginRequest): ValidationErrors =>
{
    const errors: ValidationErrors = {};

    // Email validation
    const emailRequired = validateRequiredField(request.email, "Email");
    if (emailRequired)
    {
        errors.email = emailRequired;
    } else
    {
        const emailFormat = validateEmailFormat(request.email);
        if (emailFormat) errors.email = emailFormat;
    }

    // Password validation
    const passwordRequired = validateRequiredField(request.password, "Password");
    if (passwordRequired)
    {
        errors.password = passwordRequired;
    }

    return errors;
};
