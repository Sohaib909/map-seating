import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVenue } from './useVenue';
import type { Venue } from '../types';

const mockVenue: Venue = {
    venueId: 'test-venue',
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
                        {
                            id: 'A-1-01',
                            col: 1,
                            x: 100,
                            y: 100,
                            priceTier: 1,
                            status: 'available',
                        },
                    ],
                },
            ],
        },
    ],
};

describe('useVenue', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('should start with loading state', () => {
        vi.mocked(fetch).mockImplementation(() => new Promise(() => { }));

        const { result } = renderHook(() => useVenue());

        expect(result.current.loading).toBe(true);
        expect(result.current.venue).toBe(null);
        expect(result.current.error).toBe(null);
    });

    it('should load venue data successfully', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        const { result } = renderHook(() => useVenue());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.venue).toEqual(mockVenue);
        expect(result.current.error).toBe(null);
    });

    it('should handle fetch errors', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useVenue());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.venue).toBe(null);
        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe('Network error');
    });

    it('should handle HTTP errors', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
        } as Response);

        const { result } = renderHook(() => useVenue());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.venue).toBe(null);
        expect(result.current.error).toBeTruthy();
        expect(result.current.error?.message).toBe('Failed to load venue data');
    });
});
