// localStorage utility for persisting authentication data

const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user'
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
    removeUser();
};
