import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Mock translations
const mockMessages = {
  error: {
    title: 'Something went wrong',
    description: 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
    tryAgain: 'Try Again',
    goHome: 'Go to Homepage',
    errorDetails: 'Error Details (Development Only):',
  },
};

// Mock window.location.href
const originalLocation = window.location;

beforeAll(() => {
  delete (window as any).location;
  window.location = { ...originalLocation, href: '' } as any;
});

afterAll(() => {
  window.location = originalLocation;
});

// Dynamically import the Error component to avoid module-level execution issues
let ErrorPage: any;

beforeAll(async () => {
  const module = await import('@/app/[locale]/error');
  ErrorPage = module.default;
});

describe('Error Page', () => {
  const mockReset = jest.fn();
  const mockError = new Error('Test error message');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(); // Suppress console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderErrorPage = (error = mockError) => {
    return render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <ErrorPage error={error} reset={mockReset} />
      </NextIntlClientProvider>
    );
  };

  describe('Basic Rendering', () => {
    it('should render error page with title and description', () => {
      renderErrorPage();

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    });

    it('should render error icon with proper accessibility', () => {
      renderErrorPage();

      const icon = screen.getByRole('img', { name: 'Error Icon' });
      expect(icon).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderErrorPage();

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to Homepage' })).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call reset function when Try Again button is clicked', () => {
      renderErrorPage();

      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
      fireEvent.click(tryAgainButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });

    it('should navigate to homepage when Go to Homepage button is clicked', () => {
      renderErrorPage();

      const goHomeButton = screen.getByRole('button', { name: 'Go to Homepage' });
      fireEvent.click(goHomeButton);

      expect(window.location.href).toBe('/');
    });

    it('should log error to console on mount', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      renderErrorPage();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error caught by error.tsx:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development';
      
      renderErrorPage();

      expect(screen.getByText('Error Details (Development Only):')).toBeInTheDocument();
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production';
      
      renderErrorPage();

      expect(screen.queryByText('Error Details (Development Only):')).not.toBeInTheDocument();
      expect(screen.queryByText(/Test error message/)).not.toBeInTheDocument();
    });

    it('should display error digest if available', () => {
      process.env.NODE_ENV = 'development';
      const errorWithDigest = Object.assign(new Error('Test error'), { digest: 'abc123' });
      
      renderErrorPage(errorWithDigest);

      expect(screen.getByText(/Digest: abc123/)).toBeInTheDocument();
    });

    it('should display error stack if available', () => {
      process.env.NODE_ENV = 'development';
      const errorWithStack = new Error('Test error');
      errorWithStack.stack = 'Error: Test error\n    at test.js:1:1';
      
      renderErrorPage(errorWithStack);

      expect(screen.getByText(/at test\.js:1:1/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on buttons', () => {
      renderErrorPage();

      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
      const goHomeButton = screen.getByRole('button', { name: 'Go to Homepage' });

      expect(tryAgainButton).toHaveAttribute('aria-label', 'Try Again');
      expect(goHomeButton).toHaveAttribute('aria-label', 'Go to Homepage');
    });

    it('should have proper role on error icon', () => {
      renderErrorPage();

      const icon = screen.getByRole('img', { name: 'Error Icon' });
      expect(icon).toBeInTheDocument();
    });

    it('should have proper role on error details region in development', () => {
      process.env.NODE_ENV = 'development';
      
      renderErrorPage();

      const errorDetails = screen.getByRole('region', { name: 'Error details' });
      expect(errorDetails).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive padding classes', () => {
      const { container } = renderErrorPage();

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('px-[clamp(1.25rem,6.25vw,6.25rem)]');
      expect(mainDiv).toHaveClass('py-[clamp(3.125rem,6vw,6.25rem)]');
    });

    it('should apply responsive typography classes', () => {
      renderErrorPage();

      const title = screen.getByText('Something went wrong');
      expect(title).toHaveClass('text-[clamp(1.75rem,2.1875rem,2.1875rem)]');
    });

    it('should have responsive button layout', () => {
      const { container } = renderErrorPage();

      const buttonContainer = container.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe('Design System Compliance', () => {
    it('should use correct background color', () => {
      const { container } = renderErrorPage();

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('bg-black');
    });

    it('should use Berka font', () => {
      renderErrorPage();

      const title = screen.getByText('Something went wrong');
      expect(title).toHaveClass('font-berka');
    });

    it('should apply correct text colors', () => {
      renderErrorPage();

      const title = screen.getByText('Something went wrong');
      const description = screen.getByText(/We encountered an unexpected error/);

      expect(title).toHaveClass('text-white');
      expect(description).toHaveClass('text-white/50');
    });

    it('should apply correct spacing', () => {
      renderErrorPage();

      const title = screen.getByText('Something went wrong');
      expect(title).toHaveClass('mb-[15px]');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle error without message', () => {
      const errorWithoutMessage = new Error();
      errorWithoutMessage.message = '';
      
      renderErrorPage(errorWithoutMessage);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle error without stack', () => {
      process.env.NODE_ENV = 'development';
      const errorWithoutStack = new Error('Test error');
      delete errorWithoutStack.stack;
      
      renderErrorPage(errorWithoutStack);

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });
});
