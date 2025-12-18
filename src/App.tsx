import { useState } from 'react';
import { useVenue } from './hooks/useVenue';
import { useSeatSelection } from './hooks/useSeatSelection';
import { SeatMap } from './components/SeatMap';
import { SeatDetails } from './components/SeatDetails';
import { SelectionSummary } from './components/SelectionSummary';
import { AdjacentSeatFinder } from './components/AdjacentSeatFinder';
import { Legend } from './components/Legend';
import type { SelectedSeatInfo } from './types';

function App() {
  const { venue, loading, error } = useVenue();
  const { selectedSeats, toggleSeat, clearSelection, selectMultipleSeats, canSelectMore, maxSeats } = useSeatSelection();
  const [focusedSeat, setFocusedSeat] = useState<SelectedSeatInfo | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);

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
        <h1 className="text-2xl sm:text-3xl font-semibold text-green-600 m-0">{venue.name}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2`}
            aria-label={showHeatMap ? 'Show status view' : 'Show price heat map'}
            aria-pressed={showHeatMap}
          >
            {showHeatMap ? 'Status View' : 'Heat Map'}
          </button>
          <Legend showHeatMap={showHeatMap} />
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 sm:gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
        <aside className="flex flex-col gap-4 sm:gap-6 lg:order-2">
          <SeatDetails seat={focusedSeat} />
          <AdjacentSeatFinder
            venue={venue}
            selectedSeats={selectedSeats}
            maxSeats={maxSeats}
            onSelectSeats={selectMultipleSeats}
          />
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
            showHeatMap={showHeatMap}
            onSeatToggle={toggleSeat}
            onSeatFocus={setFocusedSeat}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
