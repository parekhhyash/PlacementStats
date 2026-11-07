// Pay Page Redirect Stub
// Redirects all traffic from legacy /pay/ to new /offers/
const fs = require('fs');
const path = require('path');

function generatePayRedirect() {
  const payDir = path.join(__dirname, '..', 'pay');
  if (!fs.existsSync(payDir)) fs.mkdirSync(payDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to Offers...</title>
  <meta http-equiv="refresh" content="0; url=/offers/">
  <link rel="canonical" href="/offers/">
  <script>
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    window.location.replace('/offers/' + search + hash);
  </script>
</head>
<body style="background:#000;color:#888;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p>Redirecting to <a href="/offers/" style="color:#ededed;">Offers &amp; Packages</a>...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(payDir, 'index.html'), html, 'utf8');
  console.log('pay/index.html replaced with redirect to /offers/');
}

generatePayRedirect();
module.exports = { generatePayRedirect };
