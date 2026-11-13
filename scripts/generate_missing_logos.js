const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, '../public/logos');
if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

const companyLogos = [
  { slug: 'jpmc', name: 'JPMC', bg: '#0f2d59', text: 'J.P.Morgan', letter: 'JPM', textColor: '#ffffff' },
  { slug: 'blackrock', name: 'BlackRock', bg: '#000000', text: 'BlackRock', letter: 'BLK', textColor: '#ffffff' },
  { slug: 'ubs', name: 'UBS', bg: '#e60000', text: 'UBS', letter: 'UBS', textColor: '#ffffff' },
  { slug: 'nomura', name: 'Nomura', bg: '#cc0000', text: 'NOMURA', letter: 'NMR', textColor: '#ffffff' },
  { slug: 'nomura-kakushin', name: 'Nomura Kakushin', bg: '#990000', text: 'Kakushin', letter: 'NK', textColor: '#ffffff' },
  { slug: 'infosys', name: 'Infosys', bg: '#007cc3', text: 'Infosys', letter: 'INFY', textColor: '#ffffff' },
  { slug: 'idfc', name: 'IDFC FIRST', bg: '#991b1e', text: 'IDFC', letter: 'IDFC', textColor: '#ffffff' },
  { slug: 'colgate-palmolive', name: 'Colgate', bg: '#e21b23', text: 'Colgate', letter: 'CP', textColor: '#ffffff' },
  { slug: 'gep', name: 'GEP', bg: '#005a9c', text: 'GEP', letter: 'GEP', textColor: '#ffffff' },
  { slug: 'pfizer', name: 'Pfizer', bg: '#0093d0', text: 'Pfizer', letter: 'PFZ', textColor: '#ffffff' },
  { slug: 'quantiphi', name: 'Quantiphi', bg: '#102a45', text: 'Quantiphi', letter: 'QP', textColor: '#00c6ff' },
  { slug: 'revvity', name: 'Revvity', bg: '#25282a', text: 'Revvity', letter: 'RV', textColor: '#00e5a3' },
  { slug: 'russell-investments', name: 'Russell', bg: '#004b87', text: 'Russell', letter: 'RI', textColor: '#ffffff' },
  { slug: 'transunion', name: 'TransUnion', bg: '#00a6ce', text: 'TransUnion', letter: 'TU', textColor: '#ffffff' },
  { slug: 'wissen', name: 'Wissen', bg: '#0b3954', text: 'Wissen', letter: 'WS', textColor: '#ffffff' },
  { slug: 'workindia', name: 'WorkIndia', bg: '#276ef1', text: 'WorkIndia', letter: 'WI', textColor: '#ffffff' },
  { slug: 'auxo-ai', name: 'Auxo AI', bg: '#5856d6', text: 'Auxo', letter: 'AX', textColor: '#ffffff' },
  { slug: 'axis-mutual-fund', name: 'Axis MF', bg: '#97144d', text: 'Axis', letter: 'AMF', textColor: '#ffffff' },
  { slug: 'baker-hughes', name: 'Baker Hughes', bg: '#00332a', text: 'BH', letter: 'BH', textColor: '#00e5a3' },
  { slug: 'edralabs', name: 'EdraLabs', bg: '#1e293b', text: 'Edra', letter: 'EL', textColor: '#38bdf8' },
  { slug: 'iss-stoxx', name: 'ISS / STOXX', bg: '#00205b', text: 'ISS', letter: 'ISS', textColor: '#ffffff' },
  { slug: 'incred', name: 'InCred', bg: '#f26522', text: 'InCred', letter: 'INC', textColor: '#ffffff' },
  { slug: 'insync-analytics', name: 'InSync', bg: '#1e3a8a', text: 'InSync', letter: 'IS', textColor: '#ffffff' },
  { slug: 'mahindra-finance', name: 'Mahindra', bg: '#e31837', text: 'MMFSL', letter: 'MF', textColor: '#ffffff' },
  { slug: 'nouryon', name: 'Nouryon', bg: '#006699', text: 'Nouryon', letter: 'NY', textColor: '#ffffff' },
  { slug: 'here-technologies', name: 'HERE Technologies', bg: '#0c1d2e', text: 'HERE', letter: 'HERE', textColor: '#48dad0' }
];

companyLogos.forEach(item => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect width="80" height="80" rx="16" fill="${item.bg}"/>
  <text x="40" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="${item.letter.length > 3 ? 18 : 22}" font-weight="700" fill="${item.textColor}" text-anchor="middle" dominant-baseline="middle">${item.letter}</text>
</svg>`;
  fs.writeFileSync(path.join(logosDir, `${item.slug}.svg`), svg);
});

console.log('Generated', companyLogos.length, 'crisp SVG brand logos.');
