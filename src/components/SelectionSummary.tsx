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
        <div className="bg-white rounded-lg p-6 shadow-sm" aria-live="polite" aria-atomic="true">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 m-0">Selected Seats ({selectedSeats.length}/{maxSeats})</h3>
                {selectedSeats.length > 0 && (
                    <button
                        onClick={onClear}
                        className="bg-red-500 text-white border-none px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-red-600 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                        aria-label="Clear all selected seats"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {selectedSeats.length === 0 ? (
                <p className="text-gray-500 text-center py-8 m-0">No seats selected</p>
            ) : (
                <>
                    <ul className="list-none p-0 m-0 mb-4 max-h-[300px] overflow-y-auto">
                        {selectedSeats.map((seat) => (
                            <li key={seat.id} className="flex justify-between p-3 border-b border-gray-200 last:border-b-0">
                                <span className="text-gray-700 text-sm">
                                    {seat.sectionLabel} - Row {seat.rowIndex}, Seat {seat.col}
                                </span>
                                <span className="text-gray-900 font-semibold">
                                    ${PRICE_TIERS[seat.priceTier]}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between pt-4 border-t-2 border-gray-200 text-lg text-gray-900">
                        <strong>Subtotal:</strong>
                        <strong>${subtotal}</strong>
                    </div>
                </>
            )}

            {selectedSeats.length >= maxSeats && (
                <p className="mt-4 mb-0 p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-900 text-sm text-center" role="status">
                    Maximum seats selected
                </p>
            )}
        </div>
    );
}
