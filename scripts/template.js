const fs = require('fs');
const path = require('path');

// Helper to wrap pages with head, header, footer, and scripts
function pageTemplate({ title, activePath = '/', content, extraHead = '', extraScript = '' }) {
  return `<!DOCTYPE html>
<html lang="en" class="h-full bg-bg text-fg CWomsa_variable Z1YhAq_variable _0T2Ldq_variable">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="Campus recruitment, roles, pay and selection analytics." />
  <meta name="theme-color" content="#000000" />
  
  <!-- Google Fonts Preconnect & Stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Geist:wght@300..800&family=Geist+Mono:wght@400..700&display=swap" rel="stylesheet" />

  <!-- Local Font Preloads -->
  <link rel="preload" href="/fonts/FunnelDisplay-s.p.2xty_ze311ap2.woff2" as="font" type="font/woff2" crossorigin="" />
  <link rel="preload" href="/fonts/Geist-s.p.2xgg6xh-upisd.woff2" as="font" type="font/woff2" crossorigin="" />
  <link rel="preload" href="/fonts/GeistMono-s.p.1r21m8mjt8-gs.woff2" as="font" type="font/woff2" crossorigin="" />
  
  <!-- Styles -->
  <link rel="stylesheet" href="/css/styles.css" />
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ${extraHead}
</head>
<body class="min-h-full bg-bg font-sans text-fg antialiased flex flex-col justify-between selection:bg-fg selection:text-bg">
  <div id="site-header-root"></div>

  <main class="flex-1">
    ${content}
  </main>

  <div id="site-footer-root"></div>
  <div id="story-modal-root"></div>

  <!-- Shared Application Scripts -->
  <script type="module">
    import { siteConfig } from '/src/config/site.js';
    import { renderHeader, initHeader } from '/src/components/header.js';
    import { renderFooter, initFooter } from '/src/components/footer.js';
    import { renderStoryModal, initStoryModal } from '/src/components/story-modal.js';

    document.getElementById('site-header-root').innerHTML = renderHeader('${activePath}');
    document.getElementById('site-footer-root').innerHTML = renderFooter();
    document.getElementById('story-modal-root').innerHTML = renderStoryModal();

    initHeader();
    initFooter();
    initStoryModal();

    ${extraScript}
  </script>
</body>
</html>`;
}

module.exports = { pageTemplate };
