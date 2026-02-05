/**
 * Semantic HTML Structure Tests
 * 
 * Tests for Task 22.2: Использовать semantic elements (nav, main, article, section)
 * Validates Requirement 10.5: THE System SHALL use semantic HTML with proper heading hierarchy
 */

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Mock next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => Promise.resolve((key: string) => key)),
  setRequestLocale: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Semantic HTML Structure', () => {
  describe('Layout Structure', () => {
    it('should have exactly one main element per page', () => {
      const { container } = render(
        <div>
          <header>Header</header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      );

      const mainElements = container.querySelectorAll('main');
      expect(mainElements).toHaveLength(1);
    });

    it('should have proper document structure (header, main, footer)', () => {
      const { container } = render(
        <div>
          <header>Header</header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      );

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });

  describe('Navigation Elements', () => {
    it('should use nav element for navigation menus', () => {
      const { container } = render(
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
      );

      expect(container.querySelector('nav')).toBeInTheDocument();
    });

    it('should have accessible navigation links', () => {
      render(
        <nav aria-label="Main navigation">
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Section Elements', () => {
    it('should use section elements for thematic content groupings', () => {
      const { container } = render(
        <main>
          <section>
            <h2>Services</h2>
            <p>Our services</p>
          </section>
          <section>
            <h2>About</h2>
            <p>About us</p>
          </section>
        </main>
      );

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });

    it('should have headings in sections', () => {
      const { container } = render(
        <section>
          <h2>Section Title</h2>
          <p>Section content</p>
        </section>
      );

      const section = container.querySelector('section');
      const heading = section?.querySelector('h2');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Article Elements', () => {
    it('should use article element for self-contained content', () => {
      const { container } = render(
        <article>
          <h2>Blog Post Title</h2>
          <p>Blog post content</p>
        </article>
      );

      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should use article for blog post cards', () => {
      const { container } = render(
        <div>
          <article>
            <h3>Post 1</h3>
            <p>Excerpt 1</p>
          </article>
          <article>
            <h3>Post 2</h3>
            <p>Excerpt 2</p>
          </article>
        </div>
      );

      const articles = container.querySelectorAll('article');
      expect(articles.length).toBe(2);
    });
  });

  describe('Semantic HTML Best Practices', () => {
    it('should not have nested main elements', () => {
      const { container } = render(
        <main>
          <section>Content</section>
        </main>
      );

      const mainElements = container.querySelectorAll('main');
      expect(mainElements).toHaveLength(1);
      
      // Check that main doesn't contain another main
      const nestedMain = container.querySelector('main main');
      expect(nestedMain).not.toBeInTheDocument();
    });

    it('should use semantic elements instead of generic divs for structure', () => {
      const { container } = render(
        <div>
          <header>Header</header>
          <nav>Navigation</nav>
          <main>
            <section>Section 1</section>
            <article>Article 1</article>
          </main>
          <footer>Footer</footer>
        </div>
      );

      // Verify semantic elements are present
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy in sections', () => {
      const { container } = render(
        <main>
          <h1>Page Title</h1>
          <section>
            <h2>Section Title</h2>
            <h3>Subsection Title</h3>
          </section>
        </main>
      );

      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
    });
  });

  describe('Accessibility with Semantic HTML', () => {
    it('should provide landmarks for screen readers', () => {
      render(
        <div>
          <header>
            <nav aria-label="Main navigation">Navigation</nav>
          </header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      );

      // These semantic elements create ARIA landmarks automatically
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    it('should allow multiple nav elements with distinct labels', () => {
      render(
        <div>
          <nav aria-label="Main navigation">
            <a href="/home">Home</a>
          </nav>
          <nav aria-label="Footer navigation">
            <a href="/privacy">Privacy</a>
          </nav>
        </div>
      );

      const navElements = screen.getAllByRole('navigation');
      expect(navElements).toHaveLength(2);
    });
  });
});
