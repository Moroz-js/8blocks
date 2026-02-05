'use client';

import { Component, ReactNode } from 'react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component catches React errors and displays user-friendly error messages
 * 
 * Features:
 * - Catches React rendering errors
 * - Displays fallback UI when errors occur
 * - Logs errors for debugging
 * - Provides retry functionality
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @example With custom fallback
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // Reset error state to retry rendering
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center px-[20px] py-[50px] bg-black">
          <div className="max-w-[600px] w-full text-center">
            {/* Error Icon */}
            <div className="mb-[30px] flex justify-center">
              <div 
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-white"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="font-berka text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.25] text-white mb-[15px]">
              Something went wrong
            </h1>

            {/* Error Description */}
            <p className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/50 mb-[40px]">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div 
                className="mb-[40px] p-[20px] rounded-[8px] text-left overflow-auto"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <p className="font-berka text-[13px] leading-[1.5] text-white/70 mb-[10px] font-medium">
                  Error Details (Development Only):
                </p>
                <pre className="font-mono text-[12px] leading-[1.5] text-white/50 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-[15px] justify-center">
              <Button 
                variant="primary" 
                onClick={this.handleReset}
                className="min-w-[160px]"
              >
                Try Again
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/'}
                className="min-w-[160px]"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
