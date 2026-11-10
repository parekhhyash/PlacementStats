const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateTimelinePage() {
  const content = `
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <p id="timeline-page-badge" class="label text-muted">Timeline · Month by month · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
      <h1 class="display-l mt-6 max-w-[16ch]">When each company came.</h1>
    </section>

    <div class="wrap">
      <!-- 3-Column Headline Metrics (Median Process Time removed per request) -->
      <dl id="timeline-headline-metrics" class="grid grid-cols-1 border-t border-line sm:grid-cols-3">
        <!-- Rendered dynamically -->
      </dl>

      <!-- Section 01: Drives Per Month Chart -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">01 — Calendar Distribution</p>
          <h2 class="display-m mt-3">Drives per month</h2>
        </div>

        <div id="timeline-chart-container" class="mt-8 rounded-2xl border border-line-strong bg-panel p-6 sm:p-8">
          <!-- Rendered dynamically -->
        </div>
      </section>

      <!-- Section 02: Recent Drives Log -->
      <section class="mt-20">
        <div class="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <p class="label text-faint">02 — Chronological Drives</p>
            <h2 class="display-m mt-3">Every drive record</h2>
          </div>

          <!-- Sort Direction Toggle -->
          <div class="inline-flex items-center rounded-full border border-line-strong bg-panel p-1 text-[12px] shrink-0" role="group" aria-label="Sort Order">
            <button id="sort-desc-btn" type="button" class="cursor-pointer rounded-full px-3 py-1 font-semibold bg-fg text-bg transition-all">Newest first</button>
            <button id="sort-asc-btn" type="button" class="cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-all">Oldest first</button>
          </div>
        </div>

        <div id="timeline-events-list" class="mt-8 space-y-12">
          <!-- Rendered dynamically -->
        </div>
      </section>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const timelineData = batch.timeline || { drivesByMonth: [], events: [] };

    // Badge
    const badgeEl = document.getElementById('timeline-page-badge');
    if (badgeEl) badgeEl.textContent = \`Timeline · Month by month · SPIT Class of \${batch.year}\`;

    // 3-Column Headline metrics (Median Process Time removed per request)
    const headlineEl = document.getElementById('timeline-headline-metrics');
    if (headlineEl) {
      headlineEl.innerHTML = \`
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
          <dt class="order-2 mt-2 text-muted text-[13px]">Internship Drives</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">\${is2028 ? '4' : '15'}</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">Summer internships</dd>
        </div>
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Full-time & Dual Drives</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">\${is2028 ? '1' : '23'}</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">Graduate roles</dd>
        </div>
        <div class="flex flex-col py-5 pr-4 sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Busiest Month</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">\${is2028 ? '4 drives' : '11 drives'}</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">\${is2028 ? 'Oct 2026' : 'Jul 2026'} (Peak Season)</dd>
        </div>
      \`;
    }

    // Chart
    const chartEl = document.getElementById('timeline-chart-container');
    if (chartEl) {
      if (is2028) {
        chartEl.innerHTML = \`
          <div class="flex items-center justify-between pb-4 border-b border-line text-[13px] text-faint">
            <span>Monthly Drive Volume (Season 2028)</span>
            <span class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-intern)"></i>Summer Internship</span>
            </span>
          </div>
          <div class="mt-8 grid grid-cols-2 gap-8 items-end h-[220px] pt-4 max-w-sm mx-auto" style="height: 220px;">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">4</span>
              <div class="w-full max-w-[70px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 100%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[12px] text-fg font-medium">Oct '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">1</span>
              <div class="w-full max-w-[70px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 25%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[12px] text-muted">Nov '26</span>
            </div>
          </div>
        \`;
      } else {
        chartEl.innerHTML = \`
          <div class="flex items-center justify-between pb-4 border-b border-line text-[13px] text-faint">
            <span>Monthly Drive Volume (Season 2027)</span>
            <span class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-intern)"></i>Internship</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>
            </span>
          </div>
          <div class="mt-8 grid grid-cols-5 gap-4 items-end h-[220px] pt-4" style="height: 220px;">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">2</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 18%;">
                <div style="height: 50%; background: var(--color-intern)"></div>
                <div style="height: 50%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-muted">Jun '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">11</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 100%;">
                <div style="height: 45%; background: var(--color-intern)"></div>
                <div style="height: 55%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-fg font-medium">Jul '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">6</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 55%;">
                <div style="height: 50%; background: var(--color-intern)"></div>
                <div style="height: 50%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-muted">Aug '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">5</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 45%;">
                <div style="height: 40%; background: var(--color-intern)"></div>
                <div style="height: 60%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-muted">Sep '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">8</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 73%;">
                <div style="height: 25%; background: var(--color-intern)"></div>
                <div style="height: 75%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-muted">Oct '26</span>
            </div>
          </div>
        \`;
      }
    }

    // Events list with Month-by-Month Grouping & Sorting
    let isNewestFirst = true;

    function renderEvents() {
      const eventsListEl = document.getElementById('timeline-events-list');
      if (!eventsListEl) return;

      const events = [...(timelineData.events || [])];
      
      // Sort events
      if (isNewestFirst) {
        events.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      } else {
        events.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      }

      // Group events by monthGroup maintaining current sort order
      const groupsMap = new Map();
      events.forEach(ev => {
        const mg = ev.monthGroup || 'Other';
        if (!groupsMap.has(mg)) {
          groupsMap.set(mg, []);
        }
        groupsMap.get(mg).push(ev);
      });

      let html = '';
      groupsMap.forEach((groupEvents, groupName) => {
        html += \`
          <div class="month-block">
            <h3 class="font-display text-[26px] sm:text-[30px] leading-none tracking-[-0.03em] flex items-center gap-3 pb-3 border-b border-line text-fg">
              <span>\${groupName}</span>
              <span class="label text-faint text-[13px] font-mono">\${groupEvents.length} \${groupEvents.length === 1 ? 'drive' : 'drives'}</span>
            </h3>
            <ol class="divide-y divide-line">
              \${groupEvents.map(ev => {
                const dotColor = ev.type === 'internship' ? 'var(--color-intern)' : ev.type === 'ppo' ? 'var(--color-ppo)' : 'var(--color-fulltime)';
                const typeLabel = ev.typeLabel || (ev.type === 'internship' ? 'Internship Only' : ev.type === 'ppo' ? 'Internship with PPO' : 'Placement Only');
                const compHref = ev.slug ? \`/companies/\${ev.slug}/\` : '#';

                return \`
                  <li>
                    <a class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-3.5 transition-colors hover:bg-panel px-2 rounded-xl sm:grid-cols-[7.5rem_minmax(0,1fr)_12rem_11rem] items-center" href="\${compHref}">
                      <span class="num text-muted text-[13px] font-mono">\${ev.displayDate || ev.date}</span>
                      <span class="truncate font-medium text-fg flex items-baseline gap-2">
                        <span class="text-[15px]">\${ev.company}</span>
                        <span class="text-faint text-[12px] font-normal truncate hidden md:inline">· \${ev.role}</span>
                      </span>
                      <span class="chip text-muted max-sm:col-start-2 shrink-0"><i class="dot" style="background:\${dotColor}"></i>\${typeLabel}</span>
                      <span class="label text-faint max-sm:col-start-2 sm:text-right text-[12px] truncate">\${ev.offers ? ev.offers + ' offers' : ''} \${ev.pay ? '· ' + ev.pay.split(';')[0] : ''}</span>
                    </a>
                  </li>
                \`;
              }).join('')}
            </ol>
          </div>
        \`;
      });

      eventsListEl.innerHTML = html;
    }

    renderEvents();

    // Sort buttons
    const btnDesc = document.getElementById('sort-desc-btn');
    const btnAsc = document.getElementById('sort-asc-btn');

    if (btnDesc && btnAsc) {
      btnDesc.addEventListener('click', () => {
        if (!isNewestFirst) {
          isNewestFirst = true;
          btnDesc.className = "cursor-pointer rounded-full px-3 py-1 font-semibold bg-fg text-bg transition-all";
          btnAsc.className = "cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-all";
          renderEvents();
        }
      });

      btnAsc.addEventListener('click', () => {
        if (isNewestFirst) {
          isNewestFirst = false;
          btnAsc.className = "cursor-pointer rounded-full px-3 py-1 font-semibold bg-fg text-bg transition-all";
          btnDesc.className = "cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-all";
          renderEvents();
        }
      });
    }
  `;

  const html = pageTemplate({
    title: `Placement Timeline & Recruitment Calendar · SPIT Class of 2027 & 2028`,
    description: `Month-by-month placement calendar and chronological drive logs for Sardar Patel Institute of Technology: peak hiring months, internship recruitment dates, and full-time hiring schedules.`,
    keywords: `SPIT placement timeline, SPIT placement calendar, SPIT recruitment dates, SPIT hiring schedule, SPIT intern drive dates`,
    activePath: '/timeline/',
    content,
    extraScript
  });

  fs.writeFileSync('timeline/index.html', html);
  console.log('timeline/index.html created successfully with Multi-Batch support & Classified CSV sorting!');
}

generateTimelinePage();
