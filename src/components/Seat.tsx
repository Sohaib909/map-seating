import { memo } from 'react';
import type { Seat as SeatType } from '../types';
import { SEAT_COLORS, PRICE_TIER_COLORS } from '../constants';

interface SeatProps {
    seat: SeatType;
    sectionId: string;
    sectionLabel: string;
    rowIndex: number;
    isSelected: boolean;
    canSelect: boolean;
    showHeatMap?: boolean;
    onSeatClick: (seat: SeatType, sectionId: string, sectionLabel: string, rowIndex: number) => void;
    onSeatFocus: (seat: SeatType, sectionId: string, sectionLabel: string, rowIndex: number) => void;
}

export const Seat = memo(function Seat({
    seat,
    sectionId,
    sectionLabel,
    rowIndex,
    isSelected,
    canSelect,
    showHeatMap,
    onSeatClick,
    onSeatFocus,
}: SeatProps) {
    const isInteractive = seat.status === 'available';
    const canBeSelected = isInteractive && (isSelected || canSelect);

    const getColor = () => {
        if (isSelected) return SEAT_COLORS.selected;
        if (showHeatMap) {
            return PRICE_TIER_COLORS[seat.priceTier] || '#6b7280';
        }
        return SEAT_COLORS[seat.status];
    };

    const handleClick = () => {
        if (canBeSelected) {
            onSeatClick(seat, sectionId, sectionLabel, rowIndex);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (canBeSelected) {
                onSeatClick(seat, sectionId, sectionLabel, rowIndex);
            }
        }
    };

    const handleFocus = () => {
        onSeatFocus(seat, sectionId, sectionLabel, rowIndex);
    };

    const handleMouseEnter = () => {
        onSeatFocus(seat, sectionId, sectionLabel, rowIndex);
    };

    const ariaLabel = `Section ${sectionLabel}, Row ${rowIndex}, Seat ${seat.col}, ${seat.status}${isSelected ? ', selected' : ''}`;

    return (
        <circle
            cx={seat.x}
            cy={seat.y}
            r={10}
            fill={getColor()}
            stroke={isSelected ? '#1e40af' : '#000'}
            strokeWidth={isSelected ? 2 : 0.5}
            opacity={canBeSelected ? 1 : 0.6}
            style={{ cursor: canBeSelected ? 'pointer' : 'not-allowed' }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onMouseEnter={handleMouseEnter}
            tabIndex={canBeSelected ? 0 : -1}
            role="button"
            aria-label={ariaLabel}
            aria-pressed={isSelected}
            aria-disabled={!canBeSelected}
        />
    );
});
