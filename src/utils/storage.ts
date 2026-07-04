// localStorage utility for persisting authentication data

const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER: 'auth_user',
    EXAM_TOKEN: 'exam_token'
} as const;

// Token management
export const saveToken = (token: string): void =>
{
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = (): string | null =>
{
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = (): void =>
{
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Refresh Token management
export const saveRefreshToken = (token: string): void =>
{
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null =>
{
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const removeRefreshToken = (): void =>
{
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// Exam Token management
export const saveExamToken = (token: string): void =>
{
    localStorage.setItem(STORAGE_KEYS.EXAM_TOKEN, token);
};

export const getExamToken = (): string | null =>
{
    return localStorage.getItem(STORAGE_KEYS.EXAM_TOKEN);
};

export const removeExamToken = (): void =>
{
    localStorage.removeItem(STORAGE_KEYS.EXAM_TOKEN);
};

// User management
export const saveUser = (user: object): void =>
{
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = <T>(): T | null =>
{
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try
    {
        return JSON.parse(userStr) as T;
    } catch
    {
        return null;
    }
};

export const removeUser = (): void =>
{
    localStorage.removeItem(STORAGE_KEYS.USER);
};

// Clear all auth data
export const clearAuth = (): void =>
{
    removeToken();
    removeRefreshToken();
    removeUser();
    removeExamToken();
};
