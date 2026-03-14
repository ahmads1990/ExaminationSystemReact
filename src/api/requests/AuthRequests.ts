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