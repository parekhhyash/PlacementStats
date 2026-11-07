const fs = require('fs');
const path = require('path');

function getHeaderHtml(activePath = '/') {
  const navLinks = [
    { label: "Highlights", href: "/highlights/", glow: true },
    { label: "Companies", href: "/companies/" },
    { label: "Pay", href: "/pay/" },
    { label: "Branches", href: "/branches/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Submit Data", href: "/corrections/" }
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
    <div id="disclaimer-banner" style="position: relative; width: 100%; border-bottom: 1px solid var(--color-line); background: var(--color-panel); padding: 8px 48px; font-size: 12px; color: var(--color-muted); transition: all 0.3s ease;">
      <div class="wrap flex items-center justify-center gap-2 text-center leading-snug">
        <svg width="13" height="13" style="width: 13px; height: 13px; min-width: 13px; min-height: 13px; display: inline-block; vertical-align: -1px;" class="shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>
          This is not an official website. The data might be incorrect. Report or submit data at <a href="/corrections/" class="text-fg font-semibold underline underline-offset-2 hover:text-intern transition-colors">/corrections/ →</a>
        </span>
      </div>
      <button id="btn-dismiss-disclaimer" type="button" aria-label="Dismiss disclaimer" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; padding: 6px; cursor: pointer; background: transparent; border: none; border-radius: 4px;" class="text-muted/70 hover:text-fg hover:bg-line/40 transition-colors">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="display: block;">
          <path d="M1.5 1.5l9 9M10.5 1.5l-9 9"/>
        </svg>
      </button>
    </div>
    <script>
      try {
        if (sessionStorage.getItem('disclaimer_dismissed') === '1') {
          var b = document.getElementById('disclaimer-banner');
          if (b) b.style.display = 'none';
        }
      } catch(e) {}
    </script>
    <header class="wrap sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md [view-transition-name:site-header]">
      <div class="flex h-16 items-center justify-between gap-4">
        <a id="header-logo-link" aria-label="Placed ’27 · SPIT, home" class="group -my-2 py-2 shrink-0" href="/">
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
                    <path class="p27-logo-s p27-footprint" style="opacity: 1 !important;" d="M22.5 11C22.5 8.6 20.2 6.8 16 6.8C11.5 6.8 9.5 8.8 9.5 11.5C9.5 15.6 22.5 14.5 22.5 20.2C22.5 23.2 19.8 25.2 16 25.2C11.2 25.2 9.5 22.8 9.5 20.2" fill="none" stroke="#ededed" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </span>
            </span>
            <span class="font-display text-[18px] font-medium tracking-tight text-fg flex items-center gap-1.5">
              <span>Placed</span>
              <span id="header-batch-mark" class="text-fg font-bold">’27</span>
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
          <!-- Batch Switcher Pill (Desktop only) -->
          <div class="batch-switcher-container batch-switcher-desktop max-lg:hidden inline-flex items-center rounded-full border border-line-strong bg-panel p-1 text-[12px] shadow-sm shrink-0" role="group" aria-label="Placement Batch">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn flex items-center gap-1.5 rounded-full bg-fg px-3 py-1 text-[12px] font-semibold text-bg shadow-sm transition-all duration-200 cursor-pointer">
              <span>Batch '27</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-muted hover:text-fg transition-all duration-200 cursor-pointer">
              <span>Batch '28</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
          </div>

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
        <!-- Mobile Batch Selector -->
        <div class="batch-switcher-mobile mb-4 rounded-xl border border-line-strong bg-panel p-3">
          <div class="flex items-center justify-between mb-2.5">
            <span class="text-[12px] font-mono uppercase tracking-wider text-muted font-medium">Placement Batch</span>
            <span class="text-[11px] font-mono text-faint">Active: <span class="active-batch-label text-fg font-semibold">Batch '27</span></span>
          </div>
          <div class="grid grid-cols-2 gap-2" role="group" aria-label="Placement Batch">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn flex items-center justify-center gap-2 rounded-lg bg-fg py-2.5 px-3 text-[13px] font-semibold text-bg shadow-sm transition-all duration-200 cursor-pointer">
              <span>Batch '27</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn flex items-center justify-center gap-2 rounded-lg bg-bg/70 border border-line py-2.5 px-3 text-[13px] font-medium text-muted hover:text-fg hover:bg-bg transition-all duration-200 cursor-pointer">
              <span>Batch '28</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
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
