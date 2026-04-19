export interface RegisterInstructorRequest
{
    name: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    specialization: string
}

export interface RegisterStudentRequest
{
    name: string;
    username: string;
    email: string;
    password: string;
    level: string;
    group: string
}

export interface LoginRequest
{
    email: string;
    password: string;
}

export interface VerifyEmailRequest
{
    userId: number,
    token: string
}

export interface ResendVerificationEmailRequest
{
    userId: number
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserTokensDto {
    jwtToken: string;
    refreshToken: string;
}
