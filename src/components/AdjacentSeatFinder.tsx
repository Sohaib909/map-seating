import { useState, useMemo } from 'react';
import type { Venue, SelectedSeatInfo } from '../types';
import { findAdjacentSeats } from '../utils/findAdjacentSeats';

interface AdjacentSeatFinderProps {
    venue: Venue;
    selectedSeats: SelectedSeatInfo[];
    maxSeats: number;
    onSelectSeats: (seats: SelectedSeatInfo[]) => void;
}

export function AdjacentSeatFinder({ venue, selectedSeats, maxSeats, onSelectSeats }: AdjacentSeatFinderProps) {
    const [seatCount, setSeatCount] = useState(2);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [searchTriggered, setSearchTriggered] = useState(false);

    const selectedSeatIds = useMemo(
        () => new Set(selectedSeats.map((s) => s.id)),
        [selectedSeats]
    );

    const results = useMemo(() => {
        if (!searchTriggered) return [];
        return findAdjacentSeats(venue, seatCount, selectedSeatIds);
    }, [venue, seatCount, selectedSeatIds, searchTriggered]);

    const handleSearch = () => {
        setSearchTriggered(true);
        setCurrentResultIndex(0);
    };

    const handleSelectCurrent = () => {
        if (results.length > 0 && results[currentResultIndex]) {
            const seatsToSelect = results[currentResultIndex].seats;

            // Check if selecting these seats would exceed the max
            const totalAfterSelection = selectedSeats.length + seatsToSelect.length;
            if (totalAfterSelection > maxSeats) {
                alert(`Cannot select ${seatsToSelect.length} seats. Maximum is ${maxSeats} seats total.`);
                return;
            }

            onSelectSeats(seatsToSelect);
            setSearchTriggered(false);
        }
    };

    const handleNext = () => {
        setCurrentResultIndex((prev) => (prev + 1) % results.length);
    };

    const handlePrevious = () => {
        setCurrentResultIndex((prev) => (prev - 1 + results.length) % results.length);
    };

    const handleReset = () => {
        setSearchTriggered(false);
        setCurrentResultIndex(0);
    };

    const currentResult = results[currentResultIndex];
    const remainingCapacity = maxSeats - selectedSeats.length;

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-0">Find Adjacent Seats</h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="seat-count" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of seats
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="seat-count"
                            type="number"
                            min="2"
                            max={remainingCapacity > 0 ? remainingCapacity : 2}
                            value={seatCount}
                            onChange={(e) => {
                                setSeatCount(Math.max(2, Math.min(remainingCapacity, parseInt(e.target.value) || 2)));
                                setSearchTriggered(false);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline focus:outline-2 focus:outline-blue-500"
                            aria-describedby="seat-count-help"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={remainingCapacity < 2}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                            aria-label={`Search for ${seatCount} adjacent seats`}
                        >
                            Search
                        </button>
                    </div>
                    <p id="seat-count-help" className="text-xs text-gray-500 mt-1">
                        {remainingCapacity < 2
                            ? 'Clear some seats to search for adjacent seats'
                            : `Find ${seatCount} consecutive available seats`
                        }
                    </p>
                </div>

                {searchTriggered && (
                    <div className="border-t border-gray-200 pt-4">
                        {results.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No {seatCount} adjacent seats found
                            </p>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-700">
                                        Found <strong>{results.length}</strong> option{results.length !== 1 ? 's' : ''}
                                    </p>
                                    {results.length > 1 && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={handlePrevious}
                                                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                                aria-label="Previous result"
                                            >
                                                ◀
                                            </button>
                                            <span className="px-2 text-sm text-gray-600">
                                                {currentResultIndex + 1} / {results.length}
                                            </span>
                                            <button
                                                onClick={handleNext}
                                                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                                aria-label="Next result"
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {currentResult && (
                                    <div className="bg-gray-50 rounded p-3">
                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>{currentResult.sectionLabel}</strong>
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Row {currentResult.rowIndex}, Seats {currentResult.seats[0].col}-{currentResult.seats[currentResult.seats.length - 1].col}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSelectCurrent}
                                                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors focus:outline focus:outline-2 focus:outline-green-500 focus:outline-offset-2"
                                            >
                                                ✓ Select These Seats
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                                                aria-label="Cancel search"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
