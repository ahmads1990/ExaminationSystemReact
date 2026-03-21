// Authentication-related type definitions

export interface User
{
    uid: number;
    name: string;
    email: string;
    role: string;
}

export interface AuthState
{
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthContextType extends AuthState
{
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}
