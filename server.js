// Clean, zero-dependency Node.js HTTP server
// Serves static files, clean URL routes, and Admin API endpoints

const http = require('http');
const fs = require('fs');
const path = require('path');
const dataManager = require('./scripts/data_manager');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // --- API Endpoints for Admin Dashboard ---
  if (pathname.startsWith('/api/')) {
    try {
      // 1. GET /api/companies?batch=2027
      if (pathname === '/api/companies' && req.method === 'GET') {
        const batch = parsedUrl.searchParams.get('batch') || '2027';
        const companies = dataManager.getCompanies(batch);
        return sendJson(res, 200, { success: true, batch, count: companies.length, companies });
      }

      // 2. GET /api/company?slug=xyz&batch=2027
      if (pathname === '/api/company' && req.method === 'GET') {
        const slug = parsedUrl.searchParams.get('slug') || '';
        const batch = parsedUrl.searchParams.get('batch') || '2027';
        const company = dataManager.getCompany(slug, batch);
        if (!company) {
          return sendJson(res, 404, { success: false, error: 'Company not found' });
        }
        return sendJson(res, 200, { success: true, batch, company });
      }

      // 3. POST /api/company
      if (pathname === '/api/company' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const batch = body.batch || '2027';
        const companyData = body.company;

        if (!companyData || !companyData.name) {
          return sendJson(res, 400, { success: false, error: 'Company name is required' });
        }

        const result = dataManager.saveCompany(companyData, batch);
        return sendJson(res, 200, { 
          success: true, 
          batch, 
          message: `Company '${result.company.name}' saved and site rebuilt successfully.`, 
          company: result.company,
          count: result.count
        });
      }

      // 4. DELETE /api/company?slug=xyz&batch=2027
      if (pathname === '/api/company' && (req.method === 'DELETE' || req.method === 'POST')) {
        let slug = parsedUrl.searchParams.get('slug');
        let batch = parsedUrl.searchParams.get('batch') || '2027';

        if (!slug && req.method === 'POST') {
          const body = await parseJsonBody(req);
          slug = body.slug;
          if (body.batch) batch = body.batch;
        }

        if (!slug) {
          return sendJson(res, 400, { success: false, error: 'Slug parameter is required' });
        }

        const result = dataManager.deleteCompany(slug, batch);
        if (!result.success) {
          return sendJson(res, 404, { success: false, error: result.message || 'Company not found' });
        }
        return sendJson(res, 200, { success: true, message: `Company '${slug}' deleted and site rebuilt.`, count: result.count });
      }

      // 4b. GET /api/branch-distribution?batch=2027
      if (pathname === '/api/branch-distribution' && req.method === 'GET') {
        const batch = parsedUrl.searchParams.get('batch') || '2027';
        const items = dataManager.getBranchDistribution(batch);
        return sendJson(res, 200, { success: true, batch, count: items.length, items });
      }

      // 4c. POST /api/branch-distribution
      if (pathname === '/api/branch-distribution' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const batch = body.batch || '2027';
        const item = body.item || body;

        if (!item || !item.company) {
          return sendJson(res, 400, { success: false, error: 'Company name is required' });
        }

        const result = dataManager.saveBranchDistributionItem(item, batch);
        return sendJson(res, 200, {
          success: true,
          batch,
          message: `Branch distribution for '${item.company}' saved and site rebuilt.`,
          item: result.item,
          count: result.count
        });
      }

      // 4d. DELETE /api/branch-distribution
      if (pathname === '/api/branch-distribution' && (req.method === 'DELETE' || req.method === 'POST')) {
        let target = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('rawName');
        let batch = parsedUrl.searchParams.get('batch') || '2027';

        if (!target && req.method === 'POST') {
          const body = await parseJsonBody(req);
          target = body.id || body.rawName || body.slug;
          if (body.batch) batch = body.batch;
        }

        if (!target) {
          return sendJson(res, 400, { success: false, error: 'Target identifier is required' });
        }

        const result = dataManager.deleteBranchDistributionItem(target, batch);
        if (!result.success) {
          return sendJson(res, 404, { success: false, error: result.message || 'Branch record not found' });
        }
        return sendJson(res, 200, { success: true, message: `Branch record deleted.`, count: result.count });
      }

      // 5. GET /api/logos
      if (pathname === '/api/logos' && req.method === 'GET') {
        const logosDir = path.join(__dirname, 'public', 'logos');
        let logos = [];
        if (fs.existsSync(logosDir)) {
          logos = fs.readdirSync(logosDir)
            .filter(f => /\.(svg|png|jpg|jpeg|webp)$/i.test(f))
            .map(f => `/logos/${f}`);
        }
        return sendJson(res, 200, { success: true, logos });
      }

      // 6. POST /api/upload-logo
      if (pathname === '/api/upload-logo' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        if (!body.filename || !body.content) {
          return sendJson(res, 400, { success: false, error: 'Filename and content are required' });
        }
        const cleanName = path.basename(body.filename).toLowerCase().replace(/[^a-z0-9._-]/g, '-');
        const logosDir = path.join(__dirname, 'public', 'logos');
        if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

        const targetPath = path.join(logosDir, cleanName);
        if (body.isBase64) {
          fs.writeFileSync(targetPath, Buffer.from(body.content, 'base64'));
        } else {
          fs.writeFileSync(targetPath, body.content, 'utf8');
        }

        return sendJson(res, 200, { success: true, path: `/logos/${cleanName}` });
      }

      // 7. POST /api/rebuild
      if (pathname === '/api/rebuild' && req.method === 'POST') {
        const { execSync } = require('child_process');
        execSync('node scripts/build_all.js', { cwd: __dirname, stdio: 'pipe' });
        return sendJson(res, 200, { success: true, message: 'All pages recompiled successfully' });
      }

      return sendJson(res, 404, { success: false, error: 'API route not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, error: err.message || 'Internal server error' });
    }
  }

  // --- Static File Server ---
  let reqUrl = pathname;
  if (reqUrl === '/') {
    reqUrl = '/index.html';
  } else if (reqUrl.endsWith('/')) {
    reqUrl = reqUrl + 'index.html';
  }

  // File resolution candidates
  let filePath = path.join(__dirname, reqUrl);

  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(__dirname, 'public', reqUrl);
    if (fs.existsSync(publicPath) && !fs.statSync(publicPath).isDirectory()) {
      filePath = publicPath;
    } else {
      const dirIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(dirIndex)) {
        filePath = dirIndex;
      } else {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
          filePath = htmlPath;
        }
      }
    }
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Placed '27 portal and Admin Dashboard running at http://localhost:${PORT}`);
});
