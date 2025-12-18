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
        <div className="legend" role="list" aria-label="Seat status legend">
            {items.map((item) => (
                <div key={item.status} className="legend-item" role="listitem">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}
