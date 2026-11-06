const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/SPIT_2027_company_offers_ctc_stipend.csv');
const content = fs.readFileSync(csvPath, 'utf8');

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

const parsed = parseCSV(content);
const headers = parsed[0];
const rows = parsed.slice(1);

console.log('Headers:', headers);
console.log('Total rows:', rows.length);

const entries = rows.map((r, i) => {
  return {
    index: i + 1,
    company: r[0]?.trim(),
    role: r[1]?.trim(),
    offersRaw: r[2]?.trim(),
    type: r[3]?.trim(),
    ctcRaw: r[4]?.trim(),
    stipendRaw: r[5]?.trim(),
    notes: r[6]?.trim() || ''
  };
});

fs.writeFileSync('src/data/spit_raw_parsed.json', JSON.stringify(entries, null, 2));
console.log('Written to src/data/spit_raw_parsed.json');
