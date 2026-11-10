const fs = require('fs');
const path = require('path');
const { siteConfig } = require('../src/config/site');

function generateSeoFiles() {
  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const siteUrl = siteConfig.siteUrl || 'https://placement-stats.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  // 1. Robots.txt
  const robotsTxt = `# robots.txt for Placed ’27 · SPIT Placement Statistics
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin

# Sitemap & Host
Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
`;

  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
  }
  console.log('✓ robots.txt generated successfully');

  // 2. Core Site Pages for Sitemap
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/highlights/', priority: '0.9', changefreq: 'weekly' },
    { url: '/companies/', priority: '0.9', changefreq: 'daily' },
    { url: '/offers/', priority: '0.9', changefreq: 'weekly' },
    { url: '/branchwise/', priority: '0.9', changefreq: 'weekly' },
    { url: '/timeline/', priority: '0.8', changefreq: 'daily' },
    { url: '/updates/', priority: '0.7', changefreq: 'weekly' },
    { url: '/corrections/', priority: '0.6', changefreq: 'monthly' },
    { url: '/feedback/', priority: '0.5', changefreq: 'monthly' },
    { url: '/contact/', priority: '0.5', changefreq: 'monthly' }
  ];

  // 3. Add Individual Company Pages
  try {
    const compPath = path.join(rootDir, 'src', 'data', 'companies_2027.json');
    if (fs.existsSync(compPath)) {
      const companies = JSON.parse(fs.readFileSync(compPath, 'utf8'));
      companies.forEach(c => {
        if (c.slug) {
          pages.push({
            url: `/companies/company.html?slug=${c.slug}`,
            priority: '0.7',
            changefreq: 'weekly'
          });
        }
      });
    }
  } catch (err) {
    console.warn('Could not read companies for sitemap:', err.message);
  }

  // 4. Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  }
  console.log(`✓ sitemap.xml generated with ${pages.length} URLs`);
}

module.exports = { generateSeoFiles };

if (require.main === module) {
  generateSeoFiles();
}
