import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import type { Venue } from './types';

const mockVenue: Venue = {
    venueId: 'test-01',
    name: 'Test Arena',
    map: { width: 1024, height: 768 },
    sections: [
        {
            id: 'A',
            label: 'Lower Bowl A',
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
                        {
                            id: 'A-1-02',
                            col: 2,
                            x: 130,
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

describe('App', () => {
    beforeEach(() => {
        localStorage.clear();
        global.fetch = vi.fn();
    });

    it('should show loading state initially', () => {
        vi.mocked(fetch).mockImplementation(() => new Promise(() => { }));

        render(<App />);

        expect(screen.getByText('Loading venue...')).toBeInTheDocument();
    });

    it('should show error state on fetch failure', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Error loading venue/)).toBeInTheDocument();
        });
    });

    it('should render venue when loaded successfully', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Test Arena')).toBeInTheDocument();
        });

        expect(screen.getByText(/hover, click or focus on a seat/i)).toBeInTheDocument();
        expect(screen.getByText('Selected Seats (0/8)')).toBeInTheDocument();
    });

    it('should render legend', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Available')).toBeInTheDocument();
        });

        expect(screen.getByText('Selected')).toBeInTheDocument();
        expect(screen.getByText('Reserved')).toBeInTheDocument();
        expect(screen.getByText('Sold')).toBeInTheDocument();
        expect(screen.getByText('Held')).toBeInTheDocument();
    });

    it('should render seating map', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        const { container } = render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Test Arena')).toBeInTheDocument();
        });

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-label', 'Seating map for Test Arena');
    });

    it('should show placeholder in seat details when no seat is focused', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/hover, click or focus on a seat/i)).toBeInTheDocument();
        });
    });

    it('should show empty selection summary', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockVenue,
        } as Response);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('No seats selected')).toBeInTheDocument();
        });
    });
});
