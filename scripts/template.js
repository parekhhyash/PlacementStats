const fs = require('fs');
const path = require('path');

function getHeaderHtml(activePath = '/') {
  const navLinks = [
    { label: "Highlights", href: "/highlights/", glow: true },
    { label: "Companies", href: "/companies/" },
    { label: "Offers", href: "/offers/" },
    { label: "Branchwise", href: "/branchwise/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Submit Data", href: "/corrections/" },
    { label: "Feedback", href: "/feedback/" }
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

function getFooterHtml() {
  return `
    <footer class="wrap mt-24 border-t border-line">
      <div class="grid grid-cols-2 items-start gap-2.5 py-6 lg:grid-cols-3 lg:py-8">
        <!-- 01 Feedback -->
        <a class="group relative flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong bg-panel p-4 transition-all duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="/feedback/" style="background-color: var(--color-panel, #121316);">
          <span class="flex items-start justify-between">
            <span class="label text-faint text-[12px]" style="color: var(--color-faint, #71717a);">01</span>
            <span class="footer-arrow-circle grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-fg" style="border-color: var(--color-line-strong, #27272a); color: #ededed;">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style="color: #ededed; stroke: #ededed;">
                <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="#ededed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </span>
          <span>
            <span class="footer-box-title block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] font-medium" style="color: #ededed;">Give feedback</span>
            <span class="mt-1.5 block text-[12px] leading-snug max-sm:hidden" style="color: var(--color-muted, #a1a1aa);">Rate the site and tell us what to improve. Anonymous.</span>
          </span>
        </a>

        <!-- 02 Correction -->
        <a class="group relative flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong bg-panel p-4 transition-all duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="/corrections/" style="background-color: var(--color-panel, #121316);">
          <span class="flex items-start justify-between">
            <span class="label text-faint text-[12px]" style="color: var(--color-faint, #71717a);">02</span>
            <span class="footer-arrow-circle grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-fg" style="border-color: var(--color-line-strong, #27272a); color: #ededed;">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style="color: #ededed; stroke: #ededed;">
                <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="#ededed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </span>
          <span>
            <span class="footer-box-title block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] font-medium" style="color: #ededed;">Report a correction</span>
            <span class="mt-1.5 block text-[12px] leading-snug max-sm:hidden" style="color: var(--color-muted, #a1a1aa);">A wrong figure, date or detail? Tell us and we’ll check it.</span>
          </span>
        </a>

        <!-- 03 Spread the word (Interactive Share) -->
        <div class="share-ring rounded-2xl p-px col-span-2 lg:col-span-1">
          <div class="group relative isolate overflow-hidden rounded-[15px] bg-bg">
            <div class="relative isolate">
              <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 flex items-start overflow-hidden pt-[42px] sm:pt-[38px]">
                <div class="share-marquee flex w-max whitespace-nowrap font-display text-[38px] sm:text-[33px] leading-none tracking-[-0.04em] text-line-strong">
                  <span>Share · Spread the word · Placed ’27 · SPIT · Share · Spread the word · Placed ’27 · SPIT · </span>
                  <span>Share · Spread the word · Placed ’27 · SPIT · Share · Spread the word · Placed ’27 · SPIT · </span>
                </div>
              </div>
              <button id="share-toggle-btn" type="button" aria-expanded="false" class="flex min-h-[126px] w-full flex-col justify-between bg-gradient-to-t from-bg via-bg/40 to-transparent p-4 text-left sm:min-h-[140px] sm:p-5 cursor-pointer">
                <span class="flex items-start justify-between gap-4">
                  <span class="label text-faint">03 · Spread the word</span>
                  <span class="relative grid size-10 shrink-0 place-items-center">
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-intern);animation-delay:0s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-fulltime);animation-delay:0.8s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-ppo);animation-delay:1.6s"></span>
                    <span class="relative grid size-10 place-items-center rounded-full border border-line-strong bg-line-strong text-fg transition-all duration-300 group-hover:scale-110 group-hover:border-fg">
                      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" style="stroke: #ededed;">
                        <path d="M14.5 1.5 7 9M14.5 1.5 10 14.5 7 9 1.5 6l13-4.5Z" fill="none" stroke="#ededed" stroke-width="1.5" stroke-linejoin="round"></path>
                      </svg>
                    </span>
                  </span>
                </span>
                <span>
                  <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] text-fg" style="color: #ededed;">Share this website</span>
                  <span class="mt-1.5 block text-[12px] leading-snug text-muted max-sm:hidden">Send it to your batchmates and juniors.</span>
                </span>
              </button>
            </div>
            
            <!-- Expandable Share Options Tray -->
            <div id="share-options-tray" class="hidden border-t border-line p-4 sm:px-5">
              <div class="flex flex-wrap items-center gap-2.5">
                <button id="copy-link-btn" type="button" class="label rounded-full border border-line-strong bg-panel px-4 py-2 text-fg font-medium transition-all hover:border-fg hover:bg-line-strong inline-flex items-center gap-2 cursor-pointer" style="color: #ededed;">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#ededed" stroke-width="1.5">
                    <rect x="5" y="5" width="8" height="8" rx="1.5"/>
                    <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11"/>
                  </svg>
                  <span id="copy-text" style="color: #ededed;">Copy link</span>
                </button>
                <a id="share-whatsapp" target="_blank" rel="noopener noreferrer" class="label rounded-full border border-line-strong bg-panel px-4 py-2 font-medium transition-all hover:border-[#25D366] hover:text-[#25D366] hover:bg-line-strong/50 inline-flex items-center gap-2 cursor-pointer" style="color: #ededed;" href="https://api.whatsapp.com/send?text=Placed%20%E2%80%9927%20%C2%B7%20SPIT%20-%20Sardar%20Patel%20Institute%20of%20Technology%20Placement%20Stats">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-4">
        <div class="flex items-center gap-6">
          <a class="label text-[12px] text-faint transition-colors hover:text-fg" href="/contact/">Contact</a>
          <a class="label text-[12px] text-faint transition-colors hover:text-intern font-mono" href="/admin/">Admin</a>
          <span class="label text-[12px] text-faint">Sardar Patel Institute of Technology · Class of 2027</span>
        </div>
        <p class="label text-[11px] text-faint">Data maintained for student community awareness</p>
      </div>
    </footer>
  `;
}

// Helper to wrap pages with head, header, footer, and scripts
function pageTemplate({ title, activePath = '/', content, extraHead = '', extraScript = '' }) {
  const preRenderedHeader = getHeaderHtml(activePath);
  const preRenderedFooter = getFooterHtml();

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
  <link rel="stylesheet" href="/css/styles.css?v=3" />
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ${extraHead}

  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="min-h-full bg-bg font-sans text-fg antialiased flex flex-col justify-between selection:bg-fg selection:text-bg">
  <div id="site-header-root">${preRenderedHeader}</div>

  <main class="flex-1">
    ${content}
  </main>

  <div id="site-footer-root">${preRenderedFooter}</div>

  <!-- Shared Application Scripts -->
  <script type="module">
    import { siteConfig } from '/src/config/site.js?v=3';
    import { renderHeader, initHeader } from '/src/components/header.js?v=3';
    import { renderFooter, initFooter } from '/src/components/footer.js?v=3';

    if (!document.getElementById('site-header-root').firstElementChild) {
      document.getElementById('site-header-root').innerHTML = renderHeader('${activePath}');
    }
    if (!document.getElementById('site-footer-root').firstElementChild) {
      document.getElementById('site-footer-root').innerHTML = renderFooter();
    }

    initHeader();
    initFooter();
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
