import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectionSummary } from './SelectionSummary';
import type { SelectedSeatInfo } from '../types';

describe('SelectionSummary', () => {
    it('should show empty state when no seats selected', () => {
        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={[]} maxSeats={8} onClear={onClear} />);

        expect(screen.getByText('Selected Seats (0/8)')).toBeInTheDocument();
        expect(screen.getByText('No seats selected')).toBeInTheDocument();
        expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('should display selected seats', () => {
        const seats: SelectedSeatInfo[] = [
            {
                id: 'A-1-01',
                col: 1,
                x: 100,
                y: 100,
                priceTier: 1,
                status: 'available',
                sectionId: 'A',
                sectionLabel: 'Lower Bowl A',
                rowIndex: 1,
            },
            {
                id: 'B-2-03',
                col: 3,
                x: 350,
                y: 130,
                priceTier: 2,
                status: 'available',
                sectionId: 'B',
                sectionLabel: 'Lower Bowl B',
                rowIndex: 2,
            },
        ];

        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={seats} maxSeats={8} onClear={onClear} />);

        expect(screen.getByText('Selected Seats (2/8)')).toBeInTheDocument();
        expect(screen.getByText(/Lower Bowl A - Row 1, Seat 1/)).toBeInTheDocument();
        expect(screen.getByText(/Lower Bowl B - Row 2, Seat 3/)).toBeInTheDocument();
    });

    it('should calculate correct subtotal', () => {
        const seats: SelectedSeatInfo[] = [
            {
                id: 'A-1-01',
                col: 1,
                x: 100,
                y: 100,
                priceTier: 1,
                status: 'available',
                sectionId: 'A',
                sectionLabel: 'Lower Bowl A',
                rowIndex: 1,
            },
            {
                id: 'C-1-01',
                col: 1,
                x: 100,
                y: 300,
                priceTier: 3,
                status: 'available',
                sectionId: 'C',
                sectionLabel: 'Upper Bowl C',
                rowIndex: 1,
            },
        ];

        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={seats} maxSeats={8} onClear={onClear} />);

        expect(screen.getByText('$225')).toBeInTheDocument();
    });

    it('should show clear button when seats are selected', () => {
        const seats: SelectedSeatInfo[] = [
            {
                id: 'A-1-01',
                col: 1,
                x: 100,
                y: 100,
                priceTier: 1,
                status: 'available',
                sectionId: 'A',
                sectionLabel: 'Lower Bowl A',
                rowIndex: 1,
            },
        ];

        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={seats} maxSeats={8} onClear={onClear} />);

        const clearButton = screen.getByText('Clear All');
        expect(clearButton).toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', async () => {
        const user = userEvent.setup();
        const seats: SelectedSeatInfo[] = [
            {
                id: 'A-1-01',
                col: 1,
                x: 100,
                y: 100,
                priceTier: 1,
                status: 'available',
                sectionId: 'A',
                sectionLabel: 'Lower Bowl A',
                rowIndex: 1,
            },
        ];

        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={seats} maxSeats={8} onClear={onClear} />);

        const clearButton = screen.getByText('Clear All');
        await user.click(clearButton);

        expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should show max seats message when limit reached', () => {
        const seats: SelectedSeatInfo[] = Array.from({ length: 8 }, (_, i) => ({
            id: `A-1-0${i + 1}`,
            col: i + 1,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available' as const,
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        }));

        const onClear = vi.fn();

        render(<SelectionSummary selectedSeats={seats} maxSeats={8} onClear={onClear} />);

        expect(screen.getByText('Maximum seats selected')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
        const { container } = render(<SelectionSummary selectedSeats={[]} maxSeats={8} onClear={vi.fn()} />);

        const summary = container.querySelector('[aria-live="polite"][aria-atomic="true"]');
        expect(summary).toBeInTheDocument();
    });
});
