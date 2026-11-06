const fs = require('fs');
const path = require('path');

// Ensure destination directories exist
const dirs = ['companies', 'recap', 'pay', 'selections', 'branches', 'eligibility', 'timeline', 'updates', 'about', 'feedback', 'corrections', 'contact'];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('Directories verified.');
