# Interactive Event Seating Map

A high-performance React + TypeScript application for interactive event seat selection, supporting up to 15,000 seats with smooth 60fps rendering.

## Getting Started

```bash
pnpm install
pnpm dev
```

The application will start at `http://localhost:5173`

## Architecture

### Core Design Decisions

**Component Structure**: The app follows a modular component architecture with clear separation of concerns:
- `SeatMap` handles SVG rendering and coordinate mapping
- `Seat` is a memoized component for individual seat rendering
- Custom hooks (`useSeatSelection`, `useVenue`) manage state and side effects
- Presentation components (`SeatDetails`, `SelectionSummary`, `Legend`) handle UI display

**Performance Optimization**: To handle 15,000+ seats smoothly:
- Used SVG for hardware-accelerated rendering (better than Canvas for this use case)
- Applied `React.memo` to prevent unnecessary re-renders of individual seats
- Utilized `useMemo` for expensive computations (selected seat IDs set lookup)
- Implemented `useCallback` to stabilize event handler references
- Kept seat state flat and normalized for O(1) lookups

**State Management**: Chose React hooks over external state libraries for simplicity:
- `useSeatSelection` encapsulates selection logic and localStorage persistence
- `useVenue` handles async data fetching with proper loading/error states
- Focused seat state is local to App component (doesn't need global state)

**Accessibility**: WCAG 2.1 AA compliant with:
- Full keyboard navigation (Tab, Enter, Space)
- ARIA labels and live regions for screen readers
- Focus indicators meeting contrast requirements
- Semantic HTML and proper role attributes

**Responsive Design**: Mobile-first CSS Grid layout that adapts:
- Desktop: side-by-side map and sidebar
- Tablet: stacked layout with sidebar first
- Mobile: optimized touch targets and compact spacing

### Technology Choices

- **React 19**: Latest features with improved performance
- **TypeScript (strict mode)**: Type safety and better DX
- **Vite**: Fast dev server and optimized production builds
- **SVG over Canvas**: Declarative, accessible, hardware-accelerated
- **No external UI library**: Keeps bundle small and provides full control

### Trade-offs

**SVG vs Canvas**: SVG was chosen for accessibility (each seat is a DOM element) and easier event handling. For venues with 50k+ seats, Canvas with manual hit detection would be more performant but would require more complex accessibility implementation.

**localStorage vs URL state**: localStorage provides persistence across sessions and is simpler to implement. Trade-off: selections aren't shareable via URL.

**No virtualization**: Since all seats render at once, extremely large venues (100k+ seats) might need viewport-based virtualization. Current implementation handles 15k seats well on mid-range hardware.

## Features Implemented

✅ Load and render venue data from JSON  
✅ Smooth 60fps performance with 15,000+ seats  
✅ Click and keyboard seat selection  
✅ Display seat details on hover/focus/click  
✅ Max 8 seat selection with live subtotal  
✅ localStorage persistence  
✅ Full keyboard navigation and ARIA labels  
✅ Responsive design (desktop + mobile)  
✅ Visual legend for seat statuses  
✅ Clear selection functionality  
✅ Comprehensive unit tests (41 test cases)

## Incomplete Features / TODOs

- **WebSocket integration**: Live seat status updates would require a WebSocket client and animation for seat status changes
- **Heat map toggle**: Price tier visualization could be added as a view mode toggle
- **Adjacent seat finder**: Algorithm to find N consecutive available seats in a row
- **Touch gestures**: Pinch-zoom and pan for mobile (could use a library like `use-gesture`)
- **Dark mode**: Color scheme variables are ready, needs theme toggle and dark palette
- **E2E tests**: Playwright tests for critical user flows

## Project Structure

```
src/
├── components/
│   ├── Seat.tsx           # Memoized seat circle component
│   ├── SeatMap.tsx        # SVG container and section rendering
│   ├── SeatDetails.tsx    # Focused seat information panel
│   ├── SelectionSummary.tsx # Selected seats list and subtotal
│   └── Legend.tsx         # Status color legend
├── hooks/
│   ├── useSeatSelection.ts # Selection logic and persistence
│   └── useVenue.ts        # Venue data fetching
├── types.ts               # TypeScript interfaces
├── constants.ts           # Price tiers and color mappings
├── App.tsx                # Main application component
├── App.css                # Application styles
└── index.css              # Global styles

public/
└── venue.json             # Venue seating data
```

## Running Tests

The project includes comprehensive test coverage using Vitest and React Testing Library.

### Run all tests
```bash
npm test
# or
pnpm test
```

### Run tests in watch mode
```bash
npm test -- --watch
# or
pnpm test -- --watch
```

### Run tests with coverage
```bash
npm run test:coverage
# or
pnpm test:coverage
```

### Test Coverage

- **41 test cases** covering all major functionality
- **7 test suites** for components and hooks

**Hooks:**
- `useSeatSelection.test.ts` - Selection state management, localStorage persistence, max seats limit
- `useVenue.test.ts` - Data fetching, loading states, error handling

**Components:**
- `Seat.test.tsx` - Click/keyboard interaction, ARIA attributes, seat states
- `SeatDetails.test.tsx` - Seat information display, price tiers, empty state
- `SelectionSummary.test.tsx` - Selection list, subtotal calculation, clear functionality
- `Legend.test.tsx` - Status indicators rendering
- `App.test.tsx` - Integration tests, loading/error states, initial render

All tests verify:
- ✅ Functionality and user interactions
- ✅ Keyboard navigation and accessibility
- ✅ ARIA attributes and semantic HTML
- ✅ State management and side effects
- ✅ Error handling

## Performance Testing

To verify 60fps performance with 15,000 seats, see **[PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md)**.

Quick test:
```bash
npm run generate:large-venue  # Generate 15,000 seat venue
# Then update useVenue.ts to use '/venue-large.json'
npm run dev
```
