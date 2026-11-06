const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/SPIT_placement_classified.csv');
const text = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    if (c === '"') {
      if (inQuotes && next === '"') { row[row.length - 1] += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') p.push(row);
  return p;
}

const parsed = parseCSV(text);
const headers = parsed[0];
const rawRows = parsed.slice(1);

console.log('Headers:', headers);
console.log('Rows count:', rawRows.length);

const entries = rawRows.filter(r => r[0] && r[0].trim() && r[2] !== 'NA').map((r, i) => {
  return {
    index: i + 1,
    company: r[0]?.trim(),
    role: r[1]?.trim(),
    offersRaw: r[2]?.trim(),
    type: r[3]?.trim(),
    ctcStipend: r[4]?.trim(),
    visitDate: r[5]?.trim(),
    funnelRaw: r[6]?.trim(),
    cgpaRaw: r[7]?.trim(),
    boardsRaw: r[8]?.trim(),
    notes: r[9]?.trim() || ''
  };
});

console.log('Valid company entries:', entries.length);
fs.writeFileSync('src/data/spit_classified_raw.json', JSON.stringify(entries, null, 2));
console.log('Exported to src/data/spit_classified_raw.json');
