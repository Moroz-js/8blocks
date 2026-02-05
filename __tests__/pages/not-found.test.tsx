import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import NotFound from '@/app/[locale]/not-found';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock translations
const mockMessages = {
  notFound: {
    title: '404 - Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    goHome: 'Go to Homepage',
    goBack: 'Go Back',
    popularPages: 'Popular Pages',
    home: 'Home',
    blog: 'Blog',
    services: 'Services',
    contact: 'Contact',
  },
};

describe('NotFound Page', () => {
  const mockBack = jest.fn();
  const mockRouter = {
    back: mockBack,
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderNotFound = () => {
    return render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <NotFound />
      </NextIntlClientProvider>
    );
  };

  describe('Content Display', () => {
    it('should render 404 title', () => {
      renderNotFound();
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    });

    it('should render description text', () => {
      renderNotFound();
      expect(
        screen.getByText("The page you're looking for doesn't exist or has been moved.")
      ).toBeInTheDocument();
    });

    it('should render error icon with proper ARIA label', () => {
      renderNotFound();
      const icon = screen.getByRole('img', { name: '404 Error Icon' });
      expect(icon).toBeInTheDocument();
    });

    it('should render popular pages heading', () => {
      renderNotFound();
      expect(screen.getByText('Popular Pages')).toBeInTheDocument();
    });
  });

  describe('Navigation Options', () => {
    it('should render "Go to Homepage" button', () => {
      renderNotFound();
      const homeButton = screen.getByRole('button', { name: 'Go to Homepage' });
      expect(homeButton).toBeInTheDocument();
    });

    it('should render "Go Back" button', () => {
      renderNotFound();
      const backButton = screen.getByRole('button', { name: 'Go Back' });
      expect(backButton).toBeInTheDocument();
    });

    it('should call router.back() when "Go Back" is clicked', () => {
      renderNotFound();
      const backButton = screen.getByRole('button', { name: 'Go Back' });
      fireEvent.click(backButton);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('should render link to homepage', () => {
      renderNotFound();
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render link to blog', () => {
      renderNotFound();
      const blogLink = screen.getByRole('link', { name: 'Blog' });
      expect(blogLink).toHaveAttribute('href', '/blog');
    });

    it('should render link to services', () => {
      renderNotFound();
      const servicesLink = screen.getByRole('link', { name: 'Services' });
      expect(servicesLink).toHaveAttribute('href', '/#services');
    });

    it('should render link to contact', () => {
      renderNotFound();
      const contactLink = screen.getByRole('link', { name: 'Contact' });
      expect(contactLink).toHaveAttribute('href', '/#contact');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderNotFound();
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveTextContent('404 - Page Not Found');
      expect(h2).toHaveTextContent('Popular Pages');
    });

    it('should have navigation landmark for popular pages', () => {
      renderNotFound();
      const nav = screen.getByRole('navigation', { name: 'Popular pages navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('should have ARIA labels on buttons', () => {
      renderNotFound();
      expect(screen.getByRole('button', { name: 'Go to Homepage' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
    });

    it('should have focusable interactive elements', () => {
      renderNotFound();
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
      
      links.forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Design System Compliance', () => {
    it('should use Berka font class', () => {
      const { container } = renderNotFound();
      const title = screen.getByText('404 - Page Not Found');
      expect(title).toHaveClass('font-berka');
    });

    it('should use fluid typography with clamp()', () => {
      const { container } = renderNotFound();
      const title = screen.getByText('404 - Page Not Found');
      expect(title.className).toContain('clamp');
    });

    it('should have proper color scheme (white text on black background)', () => {
      const { container } = renderNotFound();
      const mainContainer = container.querySelector('.bg-black');
      expect(mainContainer).toBeInTheDocument();
      
      const title = screen.getByText('404 - Page Not Found');
      expect(title).toHaveClass('text-white');
    });

    it('should have responsive padding with clamp()', () => {
      const { container } = renderNotFound();
      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer?.className).toContain('clamp');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive button layout', () => {
      const { container } = renderNotFound();
      const buttonContainer = container.querySelector('.flex.flex-col.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have responsive gap spacing', () => {
      const { container } = renderNotFound();
      const buttonContainer = container.querySelector('.gap-\\[15px\\]');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should have full width buttons on mobile', () => {
      renderNotFound();
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.className).toContain('w-full');
        expect(button.className).toContain('sm:w-auto');
      });
    });
  });

  describe('SEO and Metadata', () => {
    it('should have semantic HTML structure', () => {
      const { container } = renderNotFound();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have descriptive text content', () => {
      renderNotFound();
      expect(screen.getByText(/doesn't exist or has been moved/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should call router.back() without errors', () => {
      renderNotFound();
      const backButton = screen.getByRole('button', { name: 'Go Back' });
      
      expect(() => {
        fireEvent.click(backButton);
      }).not.toThrow();
      
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('should render with all translations present', () => {
      expect(() => {
        renderNotFound();
      }).not.toThrow();
      
      // Verify key translations are rendered
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
      expect(screen.getByText('Popular Pages')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should have hover states on navigation links', () => {
      const { container } = renderNotFound();
      const navLinks = container.querySelectorAll('nav a');
      
      navLinks.forEach(link => {
        expect(link.className).toContain('hover:text-white');
      });
    });

    it('should have transition effects on navigation links', () => {
      const { container } = renderNotFound();
      const navLinks = container.querySelectorAll('nav a');
      
      navLinks.forEach(link => {
        expect(link.className).toContain('transition-colors');
      });
    });
  });

  describe('Visual Design', () => {
    it('should render icon container with proper styling', () => {
      const { container } = renderNotFound();
      const iconContainer = container.querySelector('[role="img"]');
      
      expect(iconContainer).toHaveClass('rounded-full');
      expect(iconContainer).toHaveClass('flex');
      expect(iconContainer).toHaveClass('items-center');
      expect(iconContainer).toHaveClass('justify-center');
    });

    it('should have proper spacing between sections', () => {
      const { container } = renderNotFound();
      const sections = container.querySelectorAll('.mb-\\[30px\\], .mb-\\[40px\\], .mb-\\[50px\\]');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('should use design system colors for text', () => {
      renderNotFound();
      const description = screen.getByText(/doesn't exist or has been moved/i);
      expect(description.className).toContain('text-white/50');
    });
  });
});
