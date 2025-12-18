import type { SelectedSeatInfo } from '../types';
import { PRICE_TIERS } from '../constants';

interface SeatDetailsProps {
    seat: SelectedSeatInfo | null;
}

export function SeatDetails({ seat }: SeatDetailsProps) {
    if (!seat) {
        return (
            <div className="seat-details empty" aria-live="polite">
                <p>Hover, click or focus on a seat to see details</p>
            </div>
        );
    }

    const price = PRICE_TIERS[seat.priceTier] || 0;

    return (
        <div className="seat-details" aria-live="polite">
            <h3>Seat Details</h3>
            <dl>
                <dt>Section:</dt>
                <dd>{seat.sectionLabel}</dd>

                <dt>Row:</dt>
                <dd>{seat.rowIndex}</dd>

                <dt>Seat:</dt>
                <dd>{seat.col}</dd>

                <dt>Price:</dt>
                <dd>${price}</dd>

                <dt>Status:</dt>
                <dd className={`status-${seat.status}`}>{seat.status}</dd>
            </dl>
        </div>
    );
}
