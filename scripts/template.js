const fs = require('fs');
const path = require('path');

function getHeaderHtml(activePath = '/') {
  const navLinks = [
    { label: "Highlights", href: "/highlights/", glow: true },
    { label: "Companies", href: "/companies/" },
    { label: "Pay", href: "/pay/" },
    { label: "Branches", href: "/branches/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Submit Data", href: "/corrections/" },
    { label: "About", href: "/about/" }
  ];

  const normPath = activePath.endsWith('/') ? activePath : activePath + '/';

  const navItems = navLinks.map(link => {
    const isActive = normPath === link.href || (link.href !== '/' && normPath.startsWith(link.href));
    if (link.glow || isActive) {
      return `<a class="nav-glow rounded-full px-3 py-2 ${isActive ? 'text-fg font-medium' : ''}" href="${link.href}"><span class="nav-glow-text">${link.label}</span></a>`;
    }
    return `<a class="rounded-full px-3 py-2 transition-colors text-muted hover:text-fg" href="${link.href}">${link.label}</a>`;
  }).join('');

  const mobileNavItems = navLinks.map(link => {
    const isActive = normPath === link.href || (link.href !== '/' && normPath.startsWith(link.href));
    return `<a class="flex items-center justify-between rounded-xl px-4 py-3 text-[16px] transition-colors ${isActive ? 'bg-line-strong text-fg font-medium' : 'text-muted hover:bg-line hover:text-fg'}" href="${link.href}"><span>${link.label}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2l4 4-4 4"/></svg></a>`;
  }).join('');

  return `
    <header class="wrap sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md [view-transition-name:site-header]">
      <div class="flex h-16 items-center justify-between gap-4">
        <a aria-label="Placed ’27 · SPIT, home" class="group -my-2 py-2 shrink-0" href="/">
          <span class="flex items-center gap-3">
            <span aria-hidden="true" class="p27-mark size-8 shrink-0">
              <span class="p27-float">
                <span class="p27-card">
                  <svg viewBox="0 0 32 32" class="p27-layer p27-tile">
                    <defs>
                      <linearGradient id="p27-tile-fill" x1="0" y1="0" x2="0.6" y2="1">
                        <stop offset="0" stop-color="#262626"></stop>
                        <stop offset="0.6" stop-color="#0b0b0b"></stop>
                      </linearGradient>
                      <linearGradient id="p27-tile-rim" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#fff" stop-opacity="0.32"></stop>
                        <stop offset="0.55" stop-color="#fff" stop-opacity="0.05"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M7 0H32V25L25 32H0V7Z" fill="url(#p27-tile-fill)" stroke="url(#p27-tile-rim)" stroke-width="1"></path>
                    <path class="p27-footprint" d="M9 7H13.5V25H9Z M9 7H24V15L19 20H9Z M13.5 11.5V15.5H17.14L19.5 13.14V11.5Z" fill="#ededed" fill-rule="evenodd"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span class="font-display text-[18px] font-medium tracking-tight text-fg flex items-center gap-1.5">
              <span>Placed</span>
              <span id="header-batch-mark" class="text-fg font-bold" style="cursor:pointer;" title="Click to switch batch">’27</span>
              <span class="text-faint text-[13px] font-mono">· SPIT</span>
            </span>
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav aria-label="Main" class="label -mx-1 flex gap-1 max-lg:hidden">
          ${navItems}
        </nav>

        <!-- Right Side: Batch Switcher & Mobile Menu Button -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Batch Switcher Pill (Always visible in Header on desktop AND mobile!) -->
          <div class="batch-switcher-container inline-flex items-center rounded-full border border-line-strong bg-panel p-1 text-[12px] shadow-sm shrink-0" role="group" aria-label="Placement Batch">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn flex items-center gap-1.5 rounded-full bg-fg px-3 py-1 text-[12px] font-semibold text-bg shadow-sm transition-all duration-200 cursor-pointer">
              <span>Batch '27</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-muted hover:text-fg transition-all duration-200 cursor-pointer">
              <span>Batch '28</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
          </div>

          <a href="/admin/" title="Admin Portal" class="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg max-sm:hidden" aria-label="Admin Portal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
            </svg>
          </a>

          <button id="mobile-menu-btn" type="button" aria-label="Toggle navigation menu" class="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg lg:hidden">
            <svg id="menu-icon-bars" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M2 4h12M2 8h12M2 12h12"/>
            </svg>
            <svg id="menu-icon-close" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" class="hidden">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation Drawer -->
      <div id="mobile-drawer" class="hidden pb-6 pt-3 border-t border-line lg:hidden">
        <div class="flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl bg-panel border border-line-strong">
          <span class="text-[13px] font-medium text-muted">Placement Batch:</span>
          <div class="inline-flex items-center rounded-full border border-line bg-bg p-0.5 text-[12px]" role="group">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn rounded-full px-3 py-1 text-[12px] transition-all bg-fg font-semibold text-bg">Batch '27</button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn rounded-full px-3 py-1 text-[12px] transition-all text-muted">Batch '28</button>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          ${mobileNavItems}
        </div>
      </div>
    </header>
  `;
}

// Helper to wrap pages with head, header, footer, and scripts
function pageTemplate({ title, activePath = '/', content, extraHead = '', extraScript = '' }) {
  const preRenderedHeader = getHeaderHtml(activePath);

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
  <div id="site-header-root">${preRenderedHeader}</div>

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

    if (!document.getElementById('site-header-root').firstElementChild) {
      document.getElementById('site-header-root').innerHTML = renderHeader('${activePath}');
    }
    if (!document.getElementById('site-footer-root').firstElementChild) {
      document.getElementById('site-footer-root').innerHTML = renderFooter();
    }
    document.getElementById('story-modal-root').innerHTML = renderStoryModal();

    initHeader();
    initFooter();
    initStoryModal();
  </script>

  ${extraScript ? `
  <!-- Page Specific Module -->
  <script type="module">
${extraScript}
  </script>` : ''}
</body>
</html>`;
}

module.exports = { pageTemplate };

module.exports = { pageTemplate };
