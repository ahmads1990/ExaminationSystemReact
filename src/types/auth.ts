// Authentication-related type definitions

export enum UserRole {
    Instructor = "Instructor",
    Student = "Student"
}

export interface User {
    uid: number;
    name: string;
    email: string;
    role: UserRole | string;
    tenantId?: number;
    tenantName?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (accessToken: string, refreshToken: string, tenantId?: number, tenantName?: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}
