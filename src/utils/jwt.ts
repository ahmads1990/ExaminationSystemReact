// JWT decoding utility to extract user claims
import { User } from "../types/auth";

interface JWTPayload {
    [key: string]: string | number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        // JWT structure: header.payload.signature
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (base64url)
        const payload = parts[1];
        let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

        // Pad with '=' to make it a multiple of 4
        while (base64.length % 4 !== 0) {
            base64 += "=";
        }

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

export const extractUserFromToken = (token: string): User | null => {
    const payload = decodeJWT(token);
    if (!payload) return null;

    try {
        const user: User = {
            uid: parseInt(
                (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string) ||
                    (payload["nameid"] as string) ||
                    (payload["sub"] as string) ||
                    "0"
            ),
            name:
                (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) ||
                (payload["name"] as string) ||
                "",
            email:
                (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string) ||
                (payload["email"] as string) ||
                "",
            role:
                (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string) ||
                (payload["role"] as string) ||
                ""
        };

        return user;
    } catch (error) {
        console.error("Failed to extract user from token:", error);
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    const expirationTime = (payload.exp as number) * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
};
