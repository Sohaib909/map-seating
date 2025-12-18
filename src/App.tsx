import { useState } from 'react';
import './App.css';
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
      <div className="app-container loading">
        <p>Loading venue...</p>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="app-container error">
        <p>Error loading venue: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{venue.name}</h1>
        <Legend />
      </header>

      <main className="app-main">
        <div className="map-section">
          <SeatMap
            venue={venue}
            selectedSeats={selectedSeats}
            canSelectMore={canSelectMore}
            onSeatToggle={toggleSeat}
            onSeatFocus={setFocusedSeat}
          />
        </div>

        <aside className="sidebar">
          <SeatDetails seat={focusedSeat} />
          <SelectionSummary
            selectedSeats={selectedSeats}
            maxSeats={maxSeats}
            onClear={clearSelection}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
