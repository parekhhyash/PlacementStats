const fs = require('fs');

const sec5 = fs.readFileSync('dump/sec_5.html', 'utf8');
const svg5 = sec5.match(/<svg[\s\S]*?<\/svg>/i)?.[0];
fs.writeFileSync('dump/chart_timeline.svg', svg5 || '');

const sec6 = fs.readFileSync('dump/sec_6.html', 'utf8');
// match the dot plot svg
const svg6Matches = [...sec6.matchAll(/<svg[\s\S]*?<\/svg>/gi)].map(m => m[0]);
console.log('sec6 SVGs count:', svg6Matches.length);
if (svg6Matches.length > 0) {
  // Find the largest svg (the dot plot)
  const dotPlot = svg6Matches.find(s => s.includes('Dot plot of advertised CTC'));
  fs.writeFileSync('dump/chart_pay.svg', dotPlot || svg6Matches[svg6Matches.length - 1]);
}

console.log('Charts extracted successfully.');
