import type { SelectedSeatInfo } from '../types';
import { PRICE_TIERS } from '../constants';

interface SelectionSummaryProps {
    selectedSeats: SelectedSeatInfo[];
    maxSeats: number;
    onClear: () => void;
}

export function SelectionSummary({ selectedSeats, maxSeats, onClear }: SelectionSummaryProps) {
    const subtotal = selectedSeats.reduce((sum, seat) => {
        return sum + (PRICE_TIERS[seat.priceTier] || 0);
    }, 0);

    return (
        <div className="selection-summary" aria-live="polite" aria-atomic="true">
            <div className="summary-header">
                <h3>Selected Seats ({selectedSeats.length}/{maxSeats})</h3>
                {selectedSeats.length > 0 && (
                    <button
                        onClick={onClear}
                        className="clear-button"
                        aria-label="Clear all selected seats"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {selectedSeats.length === 0 ? (
                <p className="empty-message">No seats selected</p>
            ) : (
                <>
                    <ul className="selected-seats-list">
                        {selectedSeats.map((seat) => (
                            <li key={seat.id}>
                                <span className="seat-info">
                                    {seat.sectionLabel} - Row {seat.rowIndex}, Seat {seat.col}
                                </span>
                                <span className="seat-price">
                                    ${PRICE_TIERS[seat.priceTier]}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="subtotal">
                        <strong>Subtotal:</strong>
                        <strong>${subtotal}</strong>
                    </div>
                </>
            )}

            {selectedSeats.length >= maxSeats && (
                <p className="max-seats-message" role="status">
                    Maximum seats selected
                </p>
            )}
        </div>
    );
}
