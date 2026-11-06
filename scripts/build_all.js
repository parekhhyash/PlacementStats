// Master Site Build Script
// Rebuilds all HTML pages from templates, configs, and datasets

const fs = require('fs');
const path = require('path');

console.log('--- Starting Placed ’27 Site Build ---');

try {
  // Sync static assets from public/ to root for static hosts (Vercel, Cloudflare, Netlify)
  const publicDir = path.join(__dirname, '..', 'public');
  const rootDir = path.join(__dirname, '..');

  if (fs.existsSync(publicDir)) {
    // 1. Copy logos
    const srcLogos = path.join(publicDir, 'logos');
    const destLogos = path.join(rootDir, 'logos');
    if (fs.existsSync(srcLogos)) {
      if (!fs.existsSync(destLogos)) fs.mkdirSync(destLogos, { recursive: true });
      fs.cpSync(srcLogos, destLogos, { recursive: true });
    }

    // 2. Copy root icons and meta assets
    const assetsToSync = ['favicon.ico', 'icon.svg', 'apple-touch-icon.png', 'og.png', 'manifest.webmanifest'];
    assetsToSync.forEach(file => {
      const srcFile = path.join(publicDir, file);
      const destFile = path.join(rootDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    });
  }

  console.log('1. Building Home Page...');
  require('./build_home.js');

  console.log('2. Building Companies Directory & Detail pages...');
  require('./build_companies.js');

  console.log('3. Building Branches Page...');
  require('./build_branches.js');

  console.log('4. Building Recap Page...');
  require('./build_recap.js');

  console.log('5. Building Pay Page...');
  require('./build_pay.js');

  console.log('6. Building Selections Page...');
  require('./build_selections.js');

  console.log('7. Building Timeline Page...');
  require('./build_timeline.js');

  console.log('9. Building Updates Page...');
  require('./build_updates.js');

  console.log('10. Building About & Support Pages...');
  require('./build_about_and_forms.js');

  console.log('11. Building Admin Dashboard...');
  require('./build_admin.js');

  console.log('✔ All pages compiled successfully!');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
