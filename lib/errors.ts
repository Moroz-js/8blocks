/**
 * Error handling utilities for the 8Blocks website
 * Provides centralized error logging and user-friendly error messages
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Log an error to the console with context
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const prefix = context ? `[${context}]` : '[Error]';
  
  console.error(`${prefix} ${timestamp}:`, error);
  
  // In production, you could send errors to a logging service here
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Get a user-friendly error message from an error object
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  defaultMessage = 'An unexpected error occurred. Please try again later.'
): string {
  if (error instanceof ApiError) {
    // Handle API-specific errors
    switch (error.statusCode) {
      case 404:
        return 'The requested content was not found.';
      case 403:
        return 'You do not have permission to access this content.';
      case 500:
      case 502:
      case 503:
        return 'The service is temporarily unavailable. Please try again later.';
      default:
        return error.message || defaultMessage;
    }
  }
  
  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return error.message || defaultMessage;
  }
  
  return defaultMessage;
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    );
  }
  return false;
}

/**
 * Check if an error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Handle API errors with logging and user-friendly messages
 */
export function handleApiError(
  error: unknown,
  context: string
): { message: string; statusCode: number } {
  logError(error, context);
  
  const message = getUserFriendlyErrorMessage(error);
  const statusCode = isApiError(error) ? error.statusCode : 500;
  
  return { message, statusCode };
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (isApiError(error) && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
