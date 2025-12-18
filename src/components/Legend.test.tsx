import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Legend } from './Legend';

describe('Legend', () => {
    it('should render all seat status types', () => {
        render(<Legend />);

        expect(screen.getByText('Available')).toBeInTheDocument();
        expect(screen.getByText('Selected')).toBeInTheDocument();
        expect(screen.getByText('Reserved')).toBeInTheDocument();
        expect(screen.getByText('Sold')).toBeInTheDocument();
        expect(screen.getByText('Held')).toBeInTheDocument();
    });

    it('should have proper ARIA role', () => {
        const { container } = render(<Legend />);

        const legend = container.querySelector('[role="list"]');
        expect(legend).toBeInTheDocument();
        expect(legend).toHaveAttribute('aria-label', 'Seat status legend');
    });

    it('should render color indicators', () => {
        const { container } = render(<Legend />);

        const colorSpans = container.querySelectorAll('.w-4.h-4.rounded-full');
        expect(colorSpans).toHaveLength(5);
    });
});
