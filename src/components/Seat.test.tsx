import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Seat } from './Seat';
import type { Seat as SeatType } from '../types';

describe('Seat', () => {
    const mockSeat: SeatType = {
        id: 'A-1-01',
        col: 1,
        x: 100,
        y: 100,
        priceTier: 1,
        status: 'available',
    };

    it('should render a seat circle', () => {
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        const { container } = render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const circle = container.querySelector('circle');
        expect(circle).toBeInTheDocument();
        expect(circle).toHaveAttribute('cx', '100');
        expect(circle).toHaveAttribute('cy', '100');
        expect(circle).toHaveAttribute('r', '10');
    });

    it('should have proper ARIA attributes', () => {
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Section Lower Bowl A, Row 1, Seat 1, available');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).toHaveAttribute('tabindex', '0');
    });

    it('should call onSeatClick when clicked', async () => {
        const user = userEvent.setup();
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        expect(onSeatClick).toHaveBeenCalledWith(mockSeat, 'A', 'Lower Bowl A', 1);
    });

    it('should call onSeatFocus when focused', async () => {
        const user = userEvent.setup();
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        await user.tab();

        expect(onSeatFocus).toHaveBeenCalledWith(mockSeat, 'A', 'Lower Bowl A', 1);
    });

    it('should handle keyboard navigation with Enter key', async () => {
        const user = userEvent.setup();
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        button.focus();
        await user.keyboard('{Enter}');

        expect(onSeatClick).toHaveBeenCalled();
    });

    it('should handle keyboard navigation with Space key', async () => {
        const user = userEvent.setup();
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        button.focus();
        await user.keyboard(' ');

        expect(onSeatClick).toHaveBeenCalled();
    });

    it('should not be clickable when sold', () => {
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={{ ...mockSeat, status: 'sold' }}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={true}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('should show selected state', () => {
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={true}
                    canSelect={false}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).toHaveAttribute('aria-label', expect.stringContaining('selected'));
    });

    it('should not allow selection when canSelect is false and not selected', () => {
        const onSeatClick = vi.fn();
        const onSeatFocus = vi.fn();

        render(
            <svg>
                <Seat
                    seat={mockSeat}
                    sectionId="A"
                    sectionLabel="Lower Bowl A"
                    rowIndex={1}
                    isSelected={false}
                    canSelect={false}
                    onSeatClick={onSeatClick}
                    onSeatFocus={onSeatFocus}
                />
            </svg>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('tabindex', '-1');
    });
});
