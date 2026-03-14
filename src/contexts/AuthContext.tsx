import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType } from '../types/auth';
import { saveToken, getToken, saveUser, getUser, clearAuth } from '../utils/storage';
import { extractUserFromToken, isTokenExpired } from '../utils/jwt';

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
                    // Token valid, restore auth state
                    setState({
                        user: storedUser,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        loadAuthData();
    }, []);

    const login = (token: string) => {
        // Extract user from token
        const user = extractUserFromToken(token);
        
        if (!user) {
            console.error('Failed to extract user from token');
            return;
        }

        // Save to localStorage
        saveToken(token);
        saveUser(user);

        // Update state
        setState({
            user,
            token,
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
        setState(prev => ({ ...prev, user }));
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
