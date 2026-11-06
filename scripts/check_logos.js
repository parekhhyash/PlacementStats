const fs = require('fs');

const companies = [
  'Aspect Ratio', 'Auxo AI', 'Axis Mutual Fund', 'BNY', 'Baker Hughes',
  'Barclays', 'BlackRock', 'Capgemini', 'Colgate-Palmolive', 'EdraLabs',
  'Futures First', 'GEP', 'IDFC', 'ISS / STOXX', 'InCred', 'InSync Analytics',
  'Infosys', 'JPMC', 'Mahindra Finance', 'Nomura', 'Nomura Kakushin',
  'Nouryon', 'Pfizer', 'PhonePe', 'Quantiphi', 'Revvity', 'Russell Investments',
  'TransUnion', 'UBS', 'Wissen', 'WorkIndia'
];

const existingLogos = fs.readdirSync('public/logos');

console.log('Existing logos count:', existingLogos.length);

companies.forEach(name => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const found = existingLogos.find(l => l.startsWith(slug) || l.includes(slug.split('-')[0]));
  console.log(`${name} -> slug: ${slug} -> match: ${found || 'NONE'}`);
});
