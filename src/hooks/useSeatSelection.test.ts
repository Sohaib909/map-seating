import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSeatSelection } from './useSeatSelection';
import type { SelectedSeatInfo } from '../types';

describe('useSeatSelection', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should initialize with empty selection', () => {
        const { result } = renderHook(() => useSeatSelection());

        expect(result.current.selectedSeats).toEqual([]);
        expect(result.current.canSelectMore).toBe(true);
        expect(result.current.maxSeats).toBe(8);
    });

    it('should add a seat to selection', () => {
        const { result } = renderHook(() => useSeatSelection());

        const seat: SelectedSeatInfo = {
            id: 'A-1-01',
            col: 1,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        };

        act(() => {
            result.current.toggleSeat(seat);
        });

        expect(result.current.selectedSeats).toHaveLength(1);
        expect(result.current.selectedSeats[0].id).toBe('A-1-01');
        expect(result.current.isSelected('A-1-01')).toBe(true);
    });

    it('should remove a seat from selection when toggled again', () => {
        const { result } = renderHook(() => useSeatSelection());

        const seat: SelectedSeatInfo = {
            id: 'A-1-01',
            col: 1,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        };

        act(() => {
            result.current.toggleSeat(seat);
        });

        expect(result.current.selectedSeats).toHaveLength(1);

        act(() => {
            result.current.toggleSeat(seat);
        });

        expect(result.current.selectedSeats).toHaveLength(0);
        expect(result.current.isSelected('A-1-01')).toBe(false);
    });

    it('should not exceed maximum of 8 seats', () => {
        const { result } = renderHook(() => useSeatSelection());

        for (let i = 1; i <= 10; i++) {
            const seat: SelectedSeatInfo = {
                id: `A-1-0${i}`,
                col: i,
                x: 100,
                y: 100,
                priceTier: 1,
                status: 'available',
                sectionId: 'A',
                sectionLabel: 'Lower Bowl A',
                rowIndex: 1,
            };

            act(() => {
                result.current.toggleSeat(seat);
            });
        }

        expect(result.current.selectedSeats).toHaveLength(8);
        expect(result.current.canSelectMore).toBe(false);
    });

    it('should clear all selections', () => {
        const { result } = renderHook(() => useSeatSelection());

        const seat1: SelectedSeatInfo = {
            id: 'A-1-01',
            col: 1,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        };

        const seat2: SelectedSeatInfo = {
            id: 'A-1-02',
            col: 2,
            x: 130,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        };

        act(() => {
            result.current.toggleSeat(seat1);
            result.current.toggleSeat(seat2);
        });

        expect(result.current.selectedSeats).toHaveLength(2);

        act(() => {
            result.current.clearSelection();
        });

        expect(result.current.selectedSeats).toHaveLength(0);
    });

    it('should persist selection to localStorage', () => {
        const { result } = renderHook(() => useSeatSelection());

        const seat: SelectedSeatInfo = {
            id: 'A-1-01',
            col: 1,
            x: 100,
            y: 100,
            priceTier: 1,
            status: 'available',
            sectionId: 'A',
            sectionLabel: 'Lower Bowl A',
            rowIndex: 1,
        };

        act(() => {
            result.current.toggleSeat(seat);
        });

        const stored = localStorage.getItem('seating-map-selection');
        expect(stored).toBeTruthy();

        const parsed = JSON.parse(stored!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe('A-1-01');
    });

    it('should restore selection from localStorage', () => {
        const initialSeats: SelectedSeatInfo[] = [
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

        localStorage.setItem('seating-map-selection', JSON.stringify(initialSeats));

        const { result } = renderHook(() => useSeatSelection());

        expect(result.current.selectedSeats).toHaveLength(1);
        expect(result.current.selectedSeats[0].id).toBe('A-1-01');
    });
});
