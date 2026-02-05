import { render, screen } from '@testing-library/react';
import Partners from '@/components/sections/Partners';

describe('Partners Section', () => {
  it('should render the section title', () => {
    render(<Partners />);
    expect(screen.getByRole('heading', { name: /our partners/i })).toBeInTheDocument();
  });

  it('should render all 5 partner logos', () => {
    render(<Partners />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(5);
  });

  it('should have proper alt text for all logos', () => {
    render(<Partners />);
    expect(screen.getByAltText('Partner 1')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 2')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 3')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 4')).toBeInTheDocument();
    expect(screen.getByAltText('Partner 5')).toBeInTheDocument();
  });

  it('should use responsive grid classes', () => {
    const { container } = render(<Partners />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2');
    expect(grid).toHaveClass('sm:grid-cols-3');
    expect(grid).toHaveClass('lg:grid-cols-5');
  });
});
