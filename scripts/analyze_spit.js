const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('src/data/spit_raw_parsed.json', 'utf8'));

// Helper to extract numeric offers count
function parseOfferCount(str) {
  if (!str) return 0;
  if (str.includes('finalists (not offers)')) return 0;
  // e.g. "16 (one report says 13)" -> 16
  // e.g. "8 (7 SDE + 1 Aladdin Data)" -> 8
  // e.g. "4–5" -> 5
  // e.g. "8 reported" -> 8
  // e.g. "15 (12 initially + 3 later)" -> 15
  // e.g. "3 offers (+4 waitlisted)" -> 3
  const match = str.match(/^(\d+)(?:[–-](\d+))?/);
  if (match) {
    if (match[2]) return parseInt(match[2], 10);
    return parseInt(match[1], 10);
  }
  return 0;
}

// Helper to extract numeric CTC in LPA
function parseCTC(str) {
  if (!str || str.toLowerCase().includes('not disclosed') || str.toLowerCase().includes('not reported')) return null;
  // e.g. "12 LPA" -> 12
  // e.g. "15.5 LPA base..." -> 15.5
  // e.g. "₹8,22,651 (CTC)" -> 8.23
  // e.g. "15.05 LPA" -> 15.05
  // e.g. "18.10 LPA" -> 18.1
  // e.g. "33–33.5 LPA reported" -> 33.5
  // e.g. "8.5–9.5 LPA" -> 9.0
  if (str.includes('8,22,651')) return 8.23;
  const matchRange = str.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*LPA/i);
  if (matchRange) {
    return (parseFloat(matchRange[1]) + parseFloat(matchRange[2])) / 2;
  }
  const matchSingle = str.match(/(\d+(?:\.\d+)?)\s*LPA/i);
  if (matchSingle) {
    return parseFloat(matchSingle[1]);
  }
  return null;
}

// Helper to extract numeric monthly stipend in INR
function parseStipend(str) {
  if (!str || str.toLowerCase().includes('not reported') || str.toLowerCase().includes('not disclosed') || str.toLowerCase().includes('not applicable')) return null;
  // e.g. "₹60,000/month" -> 60000
  // e.g. "₹1,35,000/month" -> 135000
  // e.g. "₹1,60,000/month" -> 160000
  const clean = str.replace(/,/g, '');
  const match = clean.match(/₹?\s*(\d+)\s*(?:\/|\s*per\s*)month/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

const companiesMap = new Map();
let totalOffersCount = 0;
let fulltimeOffersCount = 0;
let internOffersCount = 0;
let dualOffersCount = 0;

const ctcList = [];
const stipendList = [];

raw.forEach(r => {
  const count = parseOfferCount(r.offersRaw);
  const ctc = parseCTC(r.ctcRaw);
  const stipend = parseStipend(r.stipendRaw);
  const isHackathon = r.type.toLowerCase().includes('hackathon');

  if (!isHackathon) {
    totalOffersCount += count;
    const typeLower = r.type.toLowerCase();
    if (typeLower.includes('full-time') && typeLower.includes('internship')) {
      dualOffersCount += count;
    } else if (typeLower.includes('internship')) {
      internOffersCount += count;
    } else if (typeLower.includes('full-time')) {
      fulltimeOffersCount += count;
    }
  }

  if (ctc !== null && !isHackathon) {
    ctcList.push({ company: r.company, ctc, count });
  }
  if (stipend !== null && !isHackathon) {
    stipendList.push({ company: r.company, stipend, count });
  }

  // Company grouping
  const compKey = r.company.trim();
  if (!companiesMap.has(compKey)) {
    companiesMap.set(compKey, {
      name: compKey,
      roles: [],
      totalOffers: 0,
      types: new Set(),
      ctcs: [],
      stipends: []
    });
  }
  const compObj = companiesMap.get(compKey);
  compObj.roles.push(r);
  compObj.totalOffers += count;
  compObj.types.add(r.type);
  if (ctc) compObj.ctcs.push(ctc);
  if (stipend) compObj.stipends.push(stipend);
});

// Calculate medians and averages
const numericCtcs = ctcList.map(c => c.ctc).sort((a, b) => a - b);
const numericStipends = stipendList.map(s => s.stipend).sort((a, b) => a - b);

const highestCTC = Math.max(...numericCtcs);
const lowestCTC = Math.min(...numericCtcs);
const medianCTC = numericCtcs[Math.floor(numericCtcs.length / 2)];
const avgCTC = (numericCtcs.reduce((a, b) => a + b, 0) / numericCtcs.length).toFixed(2);

const highestStipend = Math.max(...numericStipends);
const medianStipend = numericStipends[Math.floor(numericStipends.length / 2)];
const avgStipend = Math.round(numericStipends.reduce((a, b) => a + b, 0) / numericStipends.length);

console.log('=== SPIT 2027 Placement Stats Summary ===');
console.log('Unique Companies:', companiesMap.size);
console.log('Total Roles/Drives Listed:', raw.length);
console.log('Total Confirmed Offers:', totalOffersCount);
console.log('Dual (Internship + Full-time) Offers:', dualOffersCount);
console.log('Direct Full-time Offers:', fulltimeOffersCount);
console.log('Internship Only Offers:', internOffersCount);
console.log('Highest CTC:', highestCTC, 'LPA (PhonePe)');
console.log('Median CTC:', medianCTC, 'LPA');
console.log('Average CTC:', avgCTC, 'LPA');
console.log('Highest Stipend:', '₹' + (highestStipend / 1000) + 'k / month (JPMC CTC Risk: ₹1,60,000/mo)');
console.log('Median Stipend:', '₹' + (medianStipend / 1000) + 'k / month');
console.log('Average Stipend:', '₹' + Math.round(avgStipend / 1000) + 'k / month');
console.log('\nDistinct Companies List:');
console.log([...companiesMap.keys()]);
