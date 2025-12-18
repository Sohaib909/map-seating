import { SEAT_COLORS } from '../constants';

export function Legend() {
    const items = [
        { status: 'available', label: 'Available', color: SEAT_COLORS.available },
        { status: 'selected', label: 'Selected', color: SEAT_COLORS.selected },
        { status: 'reserved', label: 'Reserved', color: SEAT_COLORS.reserved },
        { status: 'sold', label: 'Sold', color: SEAT_COLORS.sold },
        { status: 'held', label: 'Held', color: SEAT_COLORS.held },
    ];

    return (
        <div className="flex gap-3 sm:gap-6 flex-wrap" role="list" aria-label="Seat status legend">
            {items.map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700" role="listitem">
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
