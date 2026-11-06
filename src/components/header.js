import { siteConfig } from '../config/site.js';
import { getBatchKey, setBatch, allBatches } from '../data/batches.js';

export function renderHeader(activePath = '/') {
  const normPath = activePath.endsWith('/') ? activePath : activePath + '/';
  
  const navItems = siteConfig.navLinks.map(link => {
    const isActive = normPath === link.href || (link.href !== '/' && normPath.startsWith(link.href));
    if (link.glow || isActive) {
      return `<a class="nav-glow rounded-full px-3 py-2 ${isActive ? 'text-fg font-medium' : ''}" href="${link.href}"><span class="nav-glow-text">${link.label}</span></a>`;
    }
    return `<a class="rounded-full px-3 py-2 transition-colors text-muted hover:text-fg" href="${link.href}">${link.label}</a>`;
  }).join('');

  const mobileNavItems = siteConfig.navLinks.map(link => {
    const isActive = normPath === link.href || (link.href !== '/' && normPath.startsWith(link.href));
    return `<a class="flex items-center justify-between rounded-xl px-4 py-3 text-[16px] transition-colors ${isActive ? 'bg-line-strong text-fg font-medium' : 'text-muted hover:bg-line hover:text-fg'}" href="${link.href}"><span>${link.label}</span><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2l4 4-4 4"/></svg></a>`;
  }).join('');

  return `
    <!-- Top Announcement / Disclaimer Banner (Crossable) -->
    <aside id="site-top-disclaimer" class="relative z-40 border-b border-line bg-panel text-center text-[12px] sm:text-[13px] text-muted py-2 px-4 transition-all duration-300">
      <div class="wrap flex items-center justify-center gap-2 pr-7 sm:pr-8">
        <span class="inline-flex items-center gap-1.5 flex-wrap justify-center text-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400 shrink-0 inline" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>This is not an official website. The data might be incorrect. Report or submit data at <a href="/corrections/" class="font-medium text-fg underline underline-offset-2 hover:text-intern transition-colors">/corrections/ →</a></span>
        </span>
      </div>
      <button id="close-disclaimer-btn" type="button" aria-label="Dismiss banner" class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-fg transition-colors cursor-pointer rounded-full hover:bg-line" title="Dismiss notice">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <script>
        try {
          if (sessionStorage.getItem('spit_disclaimer_closed') === 'true') {
            document.getElementById('site-top-disclaimer').style.display = 'none';
          }
        } catch(e) {}
      </script>
    </aside>

    <header class="wrap sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md [view-transition-name:site-header]">
      <div class="flex h-16 items-center justify-between gap-4">
        <a aria-label="${siteConfig.siteTitle}, home" class="group -my-2 py-2 shrink-0" href="/">
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
          <!-- Batch Switcher Pill (Always visible in Header on desktop AND mobile!) -->
          <div class="batch-switcher-container inline-flex items-center rounded-full border border-line-strong bg-panel p-1 text-[12px] shadow-sm shrink-0" role="group" aria-label="Placement Batch">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 cursor-pointer">
              <span>Batch '27</span>
              <span class="batch-dot size-1.5 rounded-full bg-intern"></span>
            </button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 cursor-pointer">
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
        <!-- Mobile Batch Switcher -->
        <div class="flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl bg-panel border border-line-strong">
          <span class="text-[13px] font-medium text-muted">Placement Batch:</span>
          <div class="inline-flex items-center rounded-full border border-line bg-bg p-0.5 text-[12px]" role="group">
            <button type="button" data-batch-btn="2027" class="batch-tab-btn rounded-full px-3 py-1 text-[12px] transition-all">Batch '27</button>
            <button type="button" data-batch-btn="2028" class="batch-tab-btn rounded-full px-3 py-1 text-[12px] transition-all">Batch '28</button>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          ${mobileNavItems}
        </div>
      </div>
    </header>
  `;
}

export function initHeader() {
  const currentBatch = getBatchKey();
  
  // Update header mark with click-to-toggle
  const headerMark = document.getElementById('header-batch-mark');
  if (headerMark) {
    headerMark.textContent = currentBatch === '2028' ? "’28" : "’27";
    headerMark.setAttribute('title', `Active: Batch ${currentBatch}. Click to toggle batch.`);
    headerMark.style.cursor = 'pointer';
    headerMark.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setBatch(currentBatch === '2028' ? '2027' : '2028');
    });
  }

  // Update switcher buttons UI & register listeners
  const allBatchBtns = document.querySelectorAll('[data-batch-btn]');
  allBatchBtns.forEach(btn => {
    const b = btn.getAttribute('data-batch-btn');
    if (b === currentBatch) {
      btn.className = "batch-tab-btn flex items-center gap-1.5 rounded-full bg-fg px-3 py-1 text-[12px] font-semibold text-bg shadow-sm transition-all duration-200";
    } else {
      btn.className = "batch-tab-btn flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-muted hover:text-fg transition-all duration-200";
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setBatch(b);
    });
  });

  // Mobile menu open/close handler
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const iconBars = document.getElementById('menu-icon-bars');
  const iconClose = document.getElementById('menu-icon-close');

  if (btn && drawer) {
    btn.addEventListener('click', () => {
      const isExpanded = !drawer.classList.contains('hidden');
      if (isExpanded) {
        drawer.classList.add('hidden');
        iconBars?.classList.remove('hidden');
        iconClose?.classList.add('hidden');
      } else {
        drawer.classList.remove('hidden');
        iconBars?.classList.add('hidden');
        iconClose?.classList.remove('hidden');
      }
    });
  }

  // Keep batch param in internal links if user navigated with ?batch=2028
  if (currentBatch === '2028') {
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.includes('?') && !href.startsWith('//')) {
        a.setAttribute('href', href + '?batch=2028');
      }
    });
  }

  // Crossable Top Disclaimer Banner Close Handler
  const disclaimerEl = document.getElementById('site-top-disclaimer');
  const closeBtn = document.getElementById('close-disclaimer-btn');

  try {
    if (sessionStorage.getItem('spit_disclaimer_closed') === 'true' && disclaimerEl) {
      disclaimerEl.style.display = 'none';
    }
  } catch (e) {}

  if (closeBtn && disclaimerEl) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      disclaimerEl.style.transition = 'opacity 0.2s ease, max-height 0.25s ease, padding 0.2s ease';
      disclaimerEl.style.overflow = 'hidden';
      disclaimerEl.style.maxHeight = disclaimerEl.offsetHeight + 'px';
      // Force repaint
      void disclaimerEl.offsetHeight;
      disclaimerEl.style.opacity = '0';
      disclaimerEl.style.maxHeight = '0px';
      disclaimerEl.style.paddingTop = '0px';
      disclaimerEl.style.paddingBottom = '0px';
      setTimeout(() => {
        disclaimerEl.style.display = 'none';
      }, 250);
      try {
        sessionStorage.setItem('spit_disclaimer_closed', 'true');
      } catch (err) {}
    });
  }
}
