import { useState } from 'react';
import { useVenue } from './hooks/useVenue';
import { useSeatSelection } from './hooks/useSeatSelection';
import { SeatMap } from './components/SeatMap';
import { SeatDetails } from './components/SeatDetails';
import { SelectionSummary } from './components/SelectionSummary';
import { Legend } from './components/Legend';
import type { SelectedSeatInfo } from './types';

function App() {
  const { venue, loading, error } = useVenue();
  const { selectedSeats, toggleSeat, clearSelection, canSelectMore, maxSeats } = useSeatSelection();
  const [focusedSeat, setFocusedSeat] = useState<SelectedSeatInfo | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        <p>Loading venue...</p>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        <p>Error loading venue: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white px-4 py-4 sm:px-6 sm:py-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 m-0">{venue.name}</h1>
        <Legend />
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 sm:gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
        <aside className="flex flex-col gap-4 sm:gap-6 lg:order-2">
          <SeatDetails seat={focusedSeat} />
          <SelectionSummary
            selectedSeats={selectedSeats}
            maxSeats={maxSeats}
            onClear={clearSelection}
          />
        </aside>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm overflow-hidden lg:order-1">
          <SeatMap
            venue={venue}
            selectedSeats={selectedSeats}
            canSelectMore={canSelectMore}
            onSeatToggle={toggleSeat}
            onSeatFocus={setFocusedSeat}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
