import { useState, useEffect, useCallback } from 'react';
import type { SelectedSeatInfo } from '../types';

const STORAGE_KEY = 'seating-map-selection';
const MAX_SEATS = 8;

export function useSeatSelection() {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeatInfo[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSeats));
        } catch (error) {
            console.error('Failed to save selection:', error);
        }
    }, [selectedSeats]);

    const toggleSeat = useCallback((seat: SelectedSeatInfo) => {
        setSelectedSeats((current) => {
            const index = current.findIndex((s) => s.id === seat.id);

            if (index !== -1) {
                return current.filter((s) => s.id !== seat.id);
            }

            if (current.length >= MAX_SEATS) {
                return current;
            }

            return [...current, seat];
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedSeats([]);
    }, []);

    const isSelected = useCallback(
        (seatId: string) => selectedSeats.some((s) => s.id === seatId),
        [selectedSeats]
    );

    return {
        selectedSeats,
        toggleSeat,
        clearSelection,
        isSelected,
        canSelectMore: selectedSeats.length < MAX_SEATS,
        maxSeats: MAX_SEATS,
    };
}
