import { useCallback, useMemo } from 'react';
import type { Venue, SelectedSeatInfo, Seat as SeatType } from '../types';
import { Seat } from './Seat';

interface SeatMapProps {
    venue: Venue;
    selectedSeats: SelectedSeatInfo[];
    canSelectMore: boolean;
    onSeatToggle: (seat: SelectedSeatInfo) => void;
    onSeatFocus: (seat: SelectedSeatInfo | null) => void;
}

export function SeatMap({ venue, selectedSeats, canSelectMore, onSeatToggle, onSeatFocus }: SeatMapProps) {
    const viewBox = `0 0 ${venue.map.width} ${venue.map.height}`;

    const selectedSeatIds = useMemo(
        () => new Set(selectedSeats.map((s) => s.id)),
        [selectedSeats]
    );

    const handleSeatClick = useCallback(
        (seat: SeatType, sectionId: string, sectionLabel: string, rowIndex: number) => {
            const seatInfo: SelectedSeatInfo = {
                ...seat,
                sectionId,
                sectionLabel,
                rowIndex,
            };
            onSeatToggle(seatInfo);
        },
        [onSeatToggle]
    );

    const handleSeatFocus = useCallback(
        (seat: SeatType, sectionId: string, sectionLabel: string, rowIndex: number) => {
            const seatInfo: SelectedSeatInfo = {
                ...seat,
                sectionId,
                sectionLabel,
                rowIndex,
            };
            onSeatFocus(seatInfo);
        },
        [onSeatFocus]
    );

    return (
        <div className="seat-map-container">
            <svg
                viewBox={viewBox}
                className="seat-map-svg"
                aria-label={`Seating map for ${venue.name}`}
                role="application"
            >
                {venue.sections.map((section) => (
                    <g key={section.id} transform={`translate(${section.transform.x}, ${section.transform.y}) scale(${section.transform.scale})`}>
                        {section.rows.map((row) =>
                            row.seats.map((seat) => (
                                <Seat
                                    key={seat.id}
                                    seat={seat}
                                    sectionId={section.id}
                                    sectionLabel={section.label}
                                    rowIndex={row.index}
                                    isSelected={selectedSeatIds.has(seat.id)}
                                    canSelect={canSelectMore}
                                    onSeatClick={handleSeatClick}
                                    onSeatFocus={handleSeatFocus}
                                />
                            ))
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
}
