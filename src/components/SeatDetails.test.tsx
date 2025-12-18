import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeatDetails } from './SeatDetails';
import type { SelectedSeatInfo } from '../types';

describe('SeatDetails', () => {
    it('should show placeholder when no seat is selected', () => {
        render(<SeatDetails seat={null} />);

        expect(screen.getByText(/hover, click or focus on a seat/i)).toBeInTheDocument();
    });

    it('should display seat information', () => {
        const seat: SelectedSeatInfo = {
            id: 'A-1-01',
            col: 5,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 3,
        };

        render(<SeatDetails seat={seat} />);

        expect(screen.getByText('Seat Details')).toBeInTheDocument();
        expect(screen.getByText('Lower Bowl A')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('$150')).toBeInTheDocument();
        expect(screen.getByText('available')).toBeInTheDocument();
    });

    it('should display correct price for different tiers', () => {
        const seat: SelectedSeatInfo = {
            id: 'C-1-01',
            col: 1,
            x: 100,
            y: 300,
            priceTier: 3,
            status: 'available',
            sectionId: 'C',
            sectionLabel: 'Upper Bowl C',
            rowIndex: 1,
        };

        render(<SeatDetails seat={seat} />);

        expect(screen.getByText('$75')).toBeInTheDocument();
    });

    it('should have proper ARIA live region', () => {
        const { container } = render(<SeatDetails seat={null} />);

        const liveRegion = container.querySelector('[aria-live="polite"]');
        expect(liveRegion).toBeInTheDocument();
    });
});
