import type { SelectedSeatInfo } from '../types';
import { PRICE_TIERS } from '../constants';

interface SeatDetailsProps {
    seat: SelectedSeatInfo | null;
}

export function SeatDetails({ seat }: SeatDetailsProps) {
    if (!seat) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-center min-h-[150px] text-gray-500" aria-live="polite">
                <p>Hover, click or focus on a seat to see details</p>
            </div>
        );
    }

    const price = PRICE_TIERS[seat.priceTier] || 0;

    const statusColors = {
        available: 'text-emerald-500',
        reserved: 'text-amber-500',
        sold: 'text-red-500',
        held: 'text-purple-500',
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm" aria-live="polite">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-0">Seat Details</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 m-0">
                <dt className="font-semibold text-gray-700">Section:</dt>
                <dd className="text-gray-500 m-0">{seat.sectionLabel}</dd>

                <dt className="font-semibold text-gray-700">Row:</dt>
                <dd className="text-gray-500 m-0">{seat.rowIndex}</dd>

                <dt className="font-semibold text-gray-700">Seat:</dt>
                <dd className="text-gray-500 m-0">{seat.col}</dd>

                <dt className="font-semibold text-gray-700">Price:</dt>
                <dd className="text-gray-500 m-0">${price}</dd>

                <dt className="font-semibold text-gray-700">Status:</dt>
                <dd className={`m-0 ${statusColors[seat.status]}`}>{seat.status}</dd>
            </dl>
        </div>
    );
}
