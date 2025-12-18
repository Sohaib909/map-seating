import { describe, it, expect } from 'vitest';
import { findAdjacentSeats } from './findAdjacentSeats';
import type { Venue } from '../types';

const mockVenue: Venue = {
    venueId: 'test-01',
    name: 'Test Arena',
    map: { width: 1024, height: 768 },
    sections: [
        {
            id: 'A',
            label: 'Section A',
            transform: { x: 0, y: 0, scale: 1 },
            rows: [
                {
                    index: 1,
                    seats: [
                        { id: 'A-1-01', col: 1, x: 100, y: 100, priceTier: 1, status: 'available' },
                        { id: 'A-1-02', col: 2, x: 120, y: 100, priceTier: 1, status: 'available' },
                        { id: 'A-1-03', col: 3, x: 140, y: 100, priceTier: 1, status: 'sold' },
                        { id: 'A-1-04', col: 4, x: 160, y: 100, priceTier: 1, status: 'available' },
                        { id: 'A-1-05', col: 5, x: 180, y: 100, priceTier: 1, status: 'available' },
                        { id: 'A-1-06', col: 6, x: 200, y: 100, priceTier: 1, status: 'available' },
                    ],
                },
                {
                    index: 2,
                    seats: [
                        { id: 'A-2-01', col: 1, x: 100, y: 120, priceTier: 2, status: 'available' },
                        { id: 'A-2-02', col: 2, x: 120, y: 120, priceTier: 2, status: 'available' },
                        { id: 'A-2-03', col: 3, x: 140, y: 120, priceTier: 2, status: 'available' },
                    ],
                },
            ],
        },
    ],
};

describe('findAdjacentSeats', () => {
    it('should find 2 adjacent seats', () => {
        const results = findAdjacentSeats(mockVenue, 2, new Set());

        expect(results.length).toBeGreaterThan(0);
        expect(results[0].seats.length).toBe(2);
    });

    it('should find 3 adjacent seats', () => {
        const results = findAdjacentSeats(mockVenue, 3, new Set());

        const threeInRow1 = results.find(r => r.rowIndex === 1 && r.seats.length === 3);
        expect(threeInRow1).toBeDefined();
        expect(threeInRow1?.seats[0].id).toBe('A-1-04');
        expect(threeInRow1?.seats[2].id).toBe('A-1-06');

        const threeInRow2 = results.find(r => r.rowIndex === 2 && r.seats.length === 3);
        expect(threeInRow2).toBeDefined();
        expect(threeInRow2?.seats[0].id).toBe('A-2-01');
        expect(threeInRow2?.seats[2].id).toBe('A-2-03');
    });

    it('should not include sold seats', () => {
        const results = findAdjacentSeats(mockVenue, 2, new Set());

        results.forEach(result => {
            result.seats.forEach(seat => {
                expect(seat.status).toBe('available');
            });
        });
    });

    it('should not include already selected seats', () => {
        const selectedIds = new Set(['A-1-04', 'A-1-05']);
        const results = findAdjacentSeats(mockVenue, 2, selectedIds);

        results.forEach(result => {
            result.seats.forEach(seat => {
                expect(selectedIds.has(seat.id)).toBe(false);
            });
        });
    });

    it('should return empty array when no adjacent seats available', () => {
        const results = findAdjacentSeats(mockVenue, 10, new Set());

        expect(results).toEqual([]);
    });

    it('should include section and row information', () => {
        const results = findAdjacentSeats(mockVenue, 2, new Set());

        expect(results[0].sectionId).toBe('A');
        expect(results[0].sectionLabel).toBe('Section A');
        expect(results[0].rowIndex).toBeGreaterThan(0);
    });

    it('should return seats with complete SelectedSeatInfo', () => {
        const results = findAdjacentSeats(mockVenue, 2, new Set());

        const firstSeat = results[0].seats[0];
        expect(firstSeat).toHaveProperty('id');
        expect(firstSeat).toHaveProperty('col');
        expect(firstSeat).toHaveProperty('x');
        expect(firstSeat).toHaveProperty('y');
        expect(firstSeat).toHaveProperty('priceTier');
        expect(firstSeat).toHaveProperty('status');
        expect(firstSeat).toHaveProperty('sectionId');
        expect(firstSeat).toHaveProperty('sectionLabel');
        expect(firstSeat).toHaveProperty('rowIndex');
    });
});
