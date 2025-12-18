
import { SEAT_COLORS, PRICE_TIERS, PRICE_TIER_COLORS } from '../constants';

interface LegendProps {
    showHeatMap?: boolean;
}

export function Legend({ showHeatMap }: LegendProps) {
    const statusItems = [
        { status: 'available', label: 'Available', color: SEAT_COLORS.available },
        { status: 'selected', label: 'Selected', color: SEAT_COLORS.selected },
        { status: 'reserved', label: 'Reserved', color: SEAT_COLORS.reserved },
        { status: 'sold', label: 'Sold', color: SEAT_COLORS.sold },
        { status: 'held', label: 'Held', color: SEAT_COLORS.held },
    ];

    const priceItems = [
        { tier: 1, label: `$${PRICE_TIERS[1]} - Premium`, color: PRICE_TIER_COLORS[1] },
        { tier: 2, label: `$${PRICE_TIERS[2]} - Standard`, color: PRICE_TIER_COLORS[2] },
        { tier: 3, label: `$${PRICE_TIERS[3]} - Value`, color: PRICE_TIER_COLORS[3] },
    ];

    const items = showHeatMap ? priceItems : statusItems;

    return (
        <div className="flex gap-3 sm:gap-6 flex-wrap" role="list" aria-label={showHeatMap ? 'Price tier legend' : 'Seat status legend'}>
            {items.map((item) => (
                <div key={'status' in item ? item.status : item.tier} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700" role="listitem">
                    <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}
