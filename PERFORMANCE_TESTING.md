# Performance Testing Guide

## Testing with 15,000 Seats

A large venue with 15,000 seats has been generated for performance testing.

### Quick Start

1. **Switch to large venue:**
   
   Edit `src/hooks/useVenue.ts` line 11:
   ```typescript
   fetch('/venue-large.json')  // Change from '/venue.json'
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Open Chrome DevTools Performance Monitor:**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type "Show frames per second (FPS) meter"
   - Enable it

4. **Test interactions:**
   - Hover rapidly over seats
   - Click to select multiple seats
   - Use Tab key to navigate
   - Resize browser window

### Performance Metrics to Verify

✅ **Target: 60 FPS** (16.67ms per frame)

**Expected Results:**
- Initial render: < 2 seconds
- Hover interactions: 60 FPS maintained
- Click/selection: < 50ms response time
- Memory usage: < 200MB
- Frame drops: None during normal interaction

### Chrome DevTools Analysis

1. **Performance Tab:**
   ```
   - Open DevTools → Performance
   - Enable CPU throttling (4× slowdown)
   - Record while interacting
   - Check frame rate chart (green = good)
   ```

2. **React DevTools Profiler:**
   ```
   - Install React DevTools extension
   - Open Profiler tab
   - Record interaction session
   - Check component render times
   ```

3. **Memory Profiling:**
   ```
   - Open DevTools → Memory
   - Take heap snapshot
   - Check total size
   - Look for memory leaks
   ```

### Venue Configurations

- **Small venue** (`venue.json`): 40 seats - For development/testing
- **Large venue** (`venue-large.json`): 15,000 seats - For performance testing

### Regenerate Large Venue

```bash
npm run generate:large-venue
```

This creates a new `venue-large.json` with:
- 10 sections (A-J)
- 50 rows per section
- 30 seats per row
- Random distribution of seat statuses and price tiers

### Performance Optimizations Used

1. **React.memo** on Seat component - Prevents unnecessary re-renders
2. **useMemo** for seat selection lookup - O(1) instead of O(n)
3. **useCallback** for event handlers - Stable function references
4. **SVG rendering** - Hardware accelerated
5. **CSS transforms** - GPU accelerated transitions
6. **Flat state structure** - No deep nesting

### Troubleshooting

**If FPS drops below 60:**
- Check browser console for errors
- Disable browser extensions
- Close other tabs
- Check CPU/GPU usage in Activity Monitor
- Try without CPU throttling first

**If memory usage is high:**
- Check for console warnings
- Ensure React DevTools shows memoization working
- Verify no memory leaks with heap snapshots
