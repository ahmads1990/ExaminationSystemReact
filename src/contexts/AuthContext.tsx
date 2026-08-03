import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContextType, AuthState, User } from "../types/auth";
import { extractUserFromToken, isTokenExpired } from "../utils/jwt";
import { clearAuth, getTenantId, getTenantName, getToken, getUser, saveRefreshToken, saveTenantId, saveTenantName, saveToken, saveUser } from "../utils/storage";

// Create and export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true
    });

    // Load auth data from localStorage on mount
    useEffect(() => {
        const loadAuthData = () => {
            const token = getToken();
            const storedUser = getUser<User>();

            if (token && storedUser) {
                // Check if token is expired
                if (isTokenExpired(token)) {
                    // Token expired, clear auth
                    clearAuth();
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false
                    });
                } else {
                    const tenantIdStr = getTenantId();
                    const tenantName = getTenantName();
                    if (tenantIdStr) storedUser.tenantId = parseInt(tenantIdStr);
                    if (tenantName) storedUser.tenantName = tenantName;

                    // Token valid, restore auth state
                    setState({
                        user: storedUser,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        };

        loadAuthData();
    }, []);

    const login = (accessToken: string, refreshToken: string, tenantId?: number, tenantName?: string) => {
        // Extract user from token
        const user = extractUserFromToken(accessToken);

        if (!user) {
            console.error("Failed to extract user from token");
            return;
        }

        if (tenantId !== undefined && tenantId !== null) {
            user.tenantId = tenantId;
            saveTenantId(tenantId);
        }
        if (tenantName) {
            user.tenantName = tenantName;
            saveTenantName(tenantName);
        }

        // Save to localStorage
        saveToken(accessToken);
        saveRefreshToken(refreshToken);
        saveUser(user);

        // Update state
        setState({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false
        });
    };

    const logout = () => {
        // Clear localStorage
        clearAuth();

        // Update state
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
        });
    };

    const updateUser = (user: User) => {
        saveUser(user);
        setState((prev) => ({ ...prev, user }));
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
