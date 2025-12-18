export const PRICE_TIERS: Record<number, number> = {
    1: 150,
    2: 100,
    3: 75,
};

export const SEAT_COLORS = {
    available: '#10b981',
    reserved: '#f59e0b',
    sold: '#ef4444',
    held: '#8b5cf6',
    selected: '#3b82f6',
} as const;
