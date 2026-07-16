import { ApiErrorCode } from "../contracts/apiErrorCode";

/**
 * Unified API Response structure matching backend
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
    errorCode: ApiErrorCode;
    timestamp: string; // ISO 8601 date string from backend
}
