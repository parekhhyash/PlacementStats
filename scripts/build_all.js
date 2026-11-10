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
    const assetsToSync = ['favicon.ico', 'icon.svg', 'apple-touch-icon.png', 'og.png', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml'];
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

  console.log('3. Building Branchwise Page...');
  require('./build_branches.js');

  console.log('4. Building Highlights Page...');
  require('./build_highlights.js');

  console.log('5. Building Offers Page...');
  require('./build_offers.js');

  console.log('6. Building Pay Redirect Stub...');
  require('./build_pay.js');

  // Maintain redirect stubs for old selections & recap URLs
  const redirectHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Redirecting...</title><meta http-equiv="refresh" content="0; url=/highlights/"><script>window.location.replace('/highlights/' + window.location.search);</script></head><body></body></html>`;
  fs.writeFileSync(path.join(rootDir, 'selections', 'index.html'), redirectHtml);
  fs.writeFileSync(path.join(rootDir, 'recap', 'index.html'), redirectHtml);

  console.log('7. Building Timeline Page...');
  require('./build_timeline.js');

  console.log('9. Building Updates Page...');
  require('./build_updates.js');

  console.log('10. Building About & Support Pages...');
  require('./build_about_and_forms.js');

  console.log('11. Building Admin Dashboard...');
  require('./build_admin.js');

  console.log('12. Generating SEO files (sitemap.xml & robots.txt)...');
  const { generateSeoFiles } = require('./generate_seo_files.js');
  generateSeoFiles();

  console.log('✔ All pages compiled successfully!');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
