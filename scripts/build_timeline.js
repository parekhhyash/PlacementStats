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
      <!-- 4-Column Headline Metrics -->
      <dl id="timeline-headline-metrics" class="grid grid-cols-2 border-t border-line sm:grid-cols-4">
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
        <div class="border-t border-line pt-6">
          <p class="label text-faint">02 — Chronological Drives</p>
          <h2 class="display-m mt-3">Every drive record</h2>
        </div>

        <div id="timeline-events-list" class="mt-8 divide-y divide-line">
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

    // Headline metrics
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
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Busiest Month</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">\${is2028 ? '3 drives' : '14 drives'}</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">\${batch.stats.busiestMonth} (Peak)</dd>
        </div>
        <div class="flex flex-col py-5 pr-4 sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Median Process Time</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">\${batch.stats.medianWaitDays}</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">Assessment to offers</dd>
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
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-intern)"></i>Internship</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
            </span>
          </div>
          <div class="mt-8 grid grid-cols-3 gap-6 items-end h-[220px] pt-4 max-w-lg mx-auto">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">1</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 33%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[12px] text-muted">Sep '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">3</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 100%;">
                <div style="height: 67%; background: var(--color-intern)"></div>
                <div style="height: 33%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-fg font-medium">Oct '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">1</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 33%;">
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
          <div class="mt-8 grid grid-cols-5 gap-4 items-end h-[220px] pt-4">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">4</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 28%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[12px] text-muted">Jun '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">8</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 57%;">
                <div style="height: 60%; background: var(--color-intern)"></div>
                <div style="height: 40%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[12px] text-muted">Jul '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">14</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 100%;">
                <div style="height: 30%; background: var(--color-intern)"></div>
                <div style="height: 55%; background: var(--color-fulltime)"></div>
                <div style="height: 15%; background: var(--color-ppo)"></div>
              </div>
              <span class="label text-[12px] text-fg font-medium">Aug '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">7</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 50%;">
                <div style="height: 30%; background: var(--color-intern)"></div>
                <div style="height: 55%; background: var(--color-fulltime)"></div>
                <div style="height: 15%; background: var(--color-ppo)"></div>
              </div>
              <span class="label text-[12px] text-muted">Sep '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[14px] text-fg font-medium">5</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 35%;">
                <div style="height: 80%; background: var(--color-fulltime)"></div>
                <div style="height: 20%; background: var(--color-ppo)"></div>
              </div>
              <span class="label text-[12px] text-muted">Oct '26</span>
            </div>
          </div>
        \`;
      }
    }

    // Events list
    const eventsListEl = document.getElementById('timeline-events-list');
    if (eventsListEl) {
      eventsListEl.innerHTML = timelineData.events.map(ev => {
        let badge = '';
        if (ev.type === 'internship') badge = '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Internship</span>';
        else if (ev.type === 'ppo') badge = '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>';
        else badge = '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';

        return \`
          <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-panel px-2 rounded-xl transition-colors">
            <div class="flex items-center gap-4">
              <span class="label text-faint min-w-[95px] text-[13px]">\${ev.date}</span>
              <div>
                <h4 class="font-display text-[17px] font-medium text-fg">\${ev.company}</h4>
                <p class="text-[13px] text-muted">\${ev.role}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-right">
              \${badge}
              <span class="text-[13px] text-muted">\${ev.status}</span>
            </div>
          </div>
        \`;
      }).join('');
    }
  `;

  const html = pageTemplate({
    title: `Timeline · Placed · ${siteConfig.collegeShort}`,
    activePath: '/timeline/',
    content,
    extraScript
  });

  fs.writeFileSync('timeline/index.html', html);
  console.log('timeline/index.html created successfully with Multi-Batch support!');
}

generateTimelinePage();
