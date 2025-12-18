import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SECTIONS = 10;
const ROWS_PER_SECTION = 50;
const SEATS_PER_ROW = 30;
const TOTAL_SEATS = SECTIONS * ROWS_PER_SECTION * SEATS_PER_ROW;

console.log(`Generating venue with ${TOTAL_SEATS.toLocaleString()} seats...`);

const seatStatuses = ['available', 'available', 'available', 'available', 'reserved', 'sold', 'held'];
const priceTiers = [1, 1, 1, 2, 2, 3];

const sections = [];

for (let s = 0; s < SECTIONS; s++) {
  const sectionId = String.fromCharCode(65 + s); // A, B, C, etc.
  const sectionX = (s % 5) * 200;
  const sectionY = Math.floor(s / 5) * 400;
  
  const rows = [];
  
  for (let r = 0; r < ROWS_PER_SECTION; r++) {
    const seats = [];
    
    for (let c = 0; c < SEATS_PER_ROW; c++) {
      const seatId = `${sectionId}-${r + 1}-${String(c + 1).padStart(2, '0')}`;
      
      seats.push({
        id: seatId,
        col: c + 1,
        x: sectionX + 20 + (c * 25),
        y: sectionY + 20 + (r * 25),
        priceTier: priceTiers[Math.floor(Math.random() * priceTiers.length)],
        status: seatStatuses[Math.floor(Math.random() * seatStatuses.length)]
      });
    }
    
    rows.push({
      index: r + 1,
      seats
    });
  }
  
  sections.push({
    id: sectionId,
    label: `Section ${sectionId}`,
    transform: { x: 0, y: 0, scale: 1 },
    rows
  });
}

const venue = {
  venueId: 'large-arena-01',
  name: 'Large Test Arena',
  map: { width: 2048, height: 2048 },
  sections
};

const outputPath = join(__dirname, '..', 'public', 'venue-large.json');
writeFileSync(outputPath, JSON.stringify(venue, null, 2));

console.log(`✓ Generated ${TOTAL_SEATS.toLocaleString()} seats`);
console.log(`✓ Saved to: public/venue-large.json`);
console.log(`\nTo test with this venue, update src/hooks/useVenue.ts:`);
console.log(`  fetch('/venue-large.json')`);
