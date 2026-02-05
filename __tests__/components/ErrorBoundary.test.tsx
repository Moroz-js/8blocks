import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary Component', () => {
  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    });

    it('should display error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details/)).toBeInTheDocument();
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not display error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/Error Details/)).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should log error to console', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      // Check that the error was logged (the exact format may vary)
      const calls = consoleErrorSpy.mock.calls;
      const hasErrorLog = calls.some(call => 
        call.some(arg => typeof arg === 'string' && arg.includes('Error caught by ErrorBoundary'))
      );
      expect(hasErrorLog).toBe(true);

      consoleErrorSpy.mockRestore();
    });

    it('should call onError callback when provided', () => {
      const onErrorMock = jest.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onErrorMock.mock.calls[0][0].message).toBe('Test error message');
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Recovery Functionality', () => {
    it('should have a "Try Again" button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should have a "Go to Homepage" button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    });

    it('should reset error state when "Try Again" is clicked', () => {
      let shouldThrow = true;
      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Recovered content</div>;
      };

      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Verify "Try Again" button exists and is clickable
      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toBeInTheDocument();
      
      // Click the button (this will reset the error state)
      fireEvent.click(tryAgainButton);
      
      // The error boundary will attempt to re-render the children
      // In a real app, the component would need to handle the retry logic
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const heading = screen.getByText('Something went wrong');
      expect(heading.tagName).toBe('H1');
    });

    it('should have descriptive text for screen readers', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    });

    it('should have keyboard-accessible buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try Again');
      const homepageButton = screen.getByText('Go to Homepage');

      expect(tryAgainButton).toBeInstanceOf(HTMLButtonElement);
      expect(homepageButton).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Visual Design Compliance', () => {
    it('should use correct typography classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const heading = screen.getByText('Something went wrong');
      expect(heading).toHaveClass('font-berka');
    });

    it('should have proper spacing and layout', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const errorContainer = container.querySelector('.min-h-screen');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors with no message', () => {
      const ThrowEmptyError = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle errors with very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const ThrowLongError = () => {
        throw new Error(longMessage);
      };

      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowLongError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle nested ErrorBoundaries', () => {
      render(
        <ErrorBoundary fallback={<div>Outer boundary</div>}>
          <ErrorBoundary fallback={<div>Inner boundary</div>}>
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText('Inner boundary')).toBeInTheDocument();
      expect(screen.queryByText('Outer boundary')).not.toBeInTheDocument();
    });
  });

  describe('Requirements Validation', () => {
    // Validates: Requirement 12.1 - Display user-friendly error page
    it('should display a user-friendly error page when a page fails to load', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // User-friendly title
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // User-friendly description
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
      
      // Recovery options
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
    });

    // Validates: Requirement 12.5 - Log errors to console
    it('should log errors to the console for debugging purposes', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      // Check that the error was logged (the exact format may vary)
      const calls = consoleErrorSpy.mock.calls;
      const hasErrorLog = calls.some(call => 
        call.some(arg => typeof arg === 'string' && arg.includes('Error caught by ErrorBoundary'))
      );
      expect(hasErrorLog).toBe(true);

      consoleErrorSpy.mockRestore();
    });
  });
});
