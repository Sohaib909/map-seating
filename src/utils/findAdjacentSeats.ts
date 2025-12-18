import type { Venue, Seat, SelectedSeatInfo } from '../types';

export interface AdjacentSeatsResult {
    seats: SelectedSeatInfo[];
    sectionId: string;
    sectionLabel: string;
    rowIndex: number;
}

export function findAdjacentSeats(venue: Venue, count: number, selectedSeatIds: Set<string>): AdjacentSeatsResult[] {
    const results: AdjacentSeatsResult[] = [];

    for (const section of venue.sections) {
        for (const row of section.rows) {
            const seats = row.seats;

            // Look for consecutive available seats
            for (let i = 0; i <= seats.length - count; i++) {
                const consecutiveSeats: Seat[] = [];
                let isValid = true;

                // Check if we have N consecutive available seats
                for (let j = 0; j < count; j++) {
                    const seat = seats[i + j];
                    if (!seat || seat.status !== 'available' || selectedSeatIds.has(seat.id)) {
                        isValid = false;
                        break;
                    }
                    consecutiveSeats.push(seat);
                }

                // If we found a valid sequence, add it to results
                if (isValid && consecutiveSeats.length === count) {
                    results.push({
                        seats: consecutiveSeats.map(seat => ({
                            ...seat,
                            sectionId: section.id,
                            sectionLabel: section.label,
                            rowIndex: row.index,
                        })),
                        sectionId: section.id,
                        sectionLabel: section.label,
                        rowIndex: row.index,
                    });
                }
            }
        }
    }

    return results;
}
