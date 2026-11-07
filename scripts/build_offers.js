const fs = require('fs');
const path = require('path');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');
const { companies: companies2027 } = require('../src/data/companies');

function getOfferClassificationStats(compList) {
  let fte = 0, intern = 0, ppo = 0;
  const compFte = new Set(), compIntern = new Set(), compPpo = new Set();

  compList.forEach(c => {
    if (c.noDetailsAvailable) return;
    if (c.roles && c.roles.length > 0) {
      c.roles.forEach(r => {
        const cnt = r.count || 0;
        const t = (r.type || '').toLowerCase();
        if (t === 'both' || t === 'internship+ppo' || t.includes('ppo')) {
          ppo += cnt;
          compPpo.add(c.name);
        } else if (t === 'internship' || t === 'intern') {
          intern += cnt;
          compIntern.add(c.name);
        } else if (t === 'fulltime' || t === 'ft' || t === 'fte') {
          fte += cnt;
          compFte.add(c.name);
        }
      });
    } else if (c.out) {
      if (c.out.ppo > 0 || (c.offers && c.offers.includes('ppo'))) {
        ppo += (c.out.students || c.out.internships || 0);
        compPpo.add(c.name);
      } else if (c.out.internships > 0 || (c.offers && c.offers.includes('internship') && !c.offers.includes('fulltime'))) {
        intern += (c.out.students || c.out.internships || 0);
        compIntern.add(c.name);
      } else if (c.out.fulltimeOffers > 0 || (c.offers && c.offers.includes('fulltime'))) {
        fte += (c.out.students || c.out.fulltimeOffers || 0);
        compFte.add(c.name);
      }
    }
  });

  const total = fte + intern + ppo || 1;
  return {
    fte,
    intern,
    ppo,
    total: fte + intern + ppo,
    ftePct: ((fte / total) * 100).toFixed(1),
    internPct: ((intern / total) * 100).toFixed(1),
    ppoPct: ((ppo / total) * 100).toFixed(1),
    fteComps: compFte.size,
    internComps: compIntern.size,
    ppoComps: compPpo.size
  };
}

function generateOffersPage() {
  const offerStats = getOfferClassificationStats(companies2027);

  const content = `
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <p id="offers-page-badge" class="label text-muted">Offers · Classification &amp; Packages · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
      <h1 class="display-l mt-6 max-w-[16ch]">Every offer, classification &amp; package.</h1>
      <p id="offers-page-desc" class="mt-8 max-w-[64ch] text-[17px] leading-relaxed text-muted">
        Offer distribution by track, CTC packages, and monthly internship stipends compiled directly from confirmed recruitment drives.
      </p>
    </section>

    <div class="wrap">
      <!-- 4-Column Headline Metrics -->
      <dl id="offers-headline-metrics" class="grid grid-cols-2 border-t border-line sm:grid-cols-4">
        <!-- Rendered dynamically -->
      </dl>

      <!-- Section 01: Offer Classification Circular Chart & Breakdown -->
      <section class="mt-20">
        <div class="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <p class="label text-faint">01 — Offer Classification</p>
            <h2 class="display-m mt-2">Distribution of Offer Types</h2>
          </div>
          <div id="chart-batch-badge" class="label text-[12px] text-faint">
            Class of 2027 · ${offerStats.total} verified offers
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-line-strong bg-panel p-6 sm:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Circular Donut Chart -->
            <div class="lg:col-span-5 flex flex-col items-center justify-center">
              <div class="relative w-[210px] h-[210px] sm:w-[230px] sm:h-[230px]">
                <svg id="offer-donut-svg" viewBox="0 0 200 200" class="w-full h-full transform -rotate-90">
                  <!-- Background Track Ring -->
                  <circle cx="100" cy="100" r="70" fill="transparent" stroke="var(--color-line-strong)" stroke-width="22" opacity="0.3" />
                  <!-- Segments (SVG stroke-dasharray) -->
                  <circle id="donut-seg-ppo" cx="100" cy="100" r="70" fill="transparent" stroke="var(--color-ppo)" stroke-width="22" stroke-dasharray="270.90 439.82" stroke-dashoffset="0" class="cursor-pointer transition-all duration-300" style="outline:none;" data-role="ppo" />
                  <circle id="donut-seg-fte" cx="100" cy="100" r="70" fill="transparent" stroke="var(--color-fulltime)" stroke-width="22" stroke-dasharray="89.75 439.82" stroke-dashoffset="-273.90" class="cursor-pointer transition-all duration-300" style="outline:none;" data-role="fulltime" />
                  <circle id="donut-seg-intern" cx="100" cy="100" r="70" fill="transparent" stroke="var(--color-intern)" stroke-width="22" stroke-dasharray="70.17 439.82" stroke-dashoffset="-366.65" class="cursor-pointer transition-all duration-300" style="outline:none;" data-role="internship" />
                </svg>
                <!-- Center Info Overlay -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span id="donut-center-val" class="font-display text-[32px] sm:text-[36px] font-bold tracking-tight text-fg leading-none">${offerStats.total}</span>
                  <span id="donut-center-lbl" class="label text-[11px] text-muted mt-1">Total Offers</span>
                  <span id="donut-center-sub" class="text-[10px] text-faint mt-0.5">3 Tracks</span>
                </div>
              </div>
              <p class="text-[11px] text-faint mt-4 text-center">Click any slice or card to filter directory below</p>
            </div>

            <!-- Breakdown Cards -->
            <div id="offer-breakdown-cards" class="lg:col-span-7 flex flex-col gap-3">
              <!-- Intern + PPO Card -->
              <div class="card-offer-type group cursor-pointer rounded-xl border border-line-strong bg-bg p-4 sm:p-5 transition-all hover:border-fg/40 hover:bg-panel" data-role="ppo">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full shrink-0" style="background:var(--color-ppo)"></span>
                    <span class="font-medium text-[14px] sm:text-[15px] text-fg">Intern + PPO</span>
                    <span class="label text-[11px] text-muted">Dual Track</span>
                  </div>
                  <div class="text-right">
                    <span id="card-count-ppo" class="font-display text-[17px] sm:text-[19px] font-semibold text-fg">${offerStats.ppo}</span>
                    <span class="text-[12px] text-muted ml-1">offers</span>
                    <span id="card-pct-ppo" class="ml-2 font-mono text-[12px] font-semibold text-fg bg-line-strong/60 px-1.5 py-0.5 rounded">${offerStats.ppoPct}%</span>
                  </div>
                </div>
                <div id="card-desc-ppo" class="mt-2 text-[12px] text-muted leading-relaxed">
                  Summer internship leading directly to full-time pre-placement offer across ${offerStats.ppoComps} recruiters (e.g. JPMC, ISS-STOXX, TransUnion, GEP, Wissen).
                </div>
                <div class="mt-3 h-1.5 w-full rounded-full bg-line overflow-hidden">
                  <div id="card-bar-ppo" class="h-full rounded-full transition-all duration-500" style="width: ${offerStats.ppoPct}%; background: var(--color-ppo)"></div>
                </div>
              </div>

              <!-- FTE Offers Card -->
              <div class="card-offer-type group cursor-pointer rounded-xl border border-line-strong bg-bg p-4 sm:p-5 transition-all hover:border-fg/40 hover:bg-panel" data-role="fulltime">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full shrink-0" style="background:var(--color-fulltime)"></span>
                    <span class="font-medium text-[14px] sm:text-[15px] text-fg">FTE Offers</span>
                    <span class="label text-[11px] text-muted">Direct Full-Time</span>
                  </div>
                  <div class="text-right">
                    <span id="card-count-fte" class="font-display text-[17px] sm:text-[19px] font-semibold text-fg">${offerStats.fte}</span>
                    <span class="text-[12px] text-muted ml-1">offers</span>
                    <span id="card-pct-fte" class="ml-2 font-mono text-[12px] font-semibold text-fg bg-line-strong/60 px-1.5 py-0.5 rounded">${offerStats.ftePct}%</span>
                  </div>
                </div>
                <div id="card-desc-fte" class="mt-2 text-[12px] text-muted leading-relaxed">
                  Direct graduate full-time appointments without mandatory internship across ${offerStats.fteComps} recruiters (e.g. Barclays FT, UBS, Capgemini, AspectRatio).
                </div>
                <div class="mt-3 h-1.5 w-full rounded-full bg-line overflow-hidden">
                  <div id="card-bar-fte" class="h-full rounded-full transition-all duration-500" style="width: ${offerStats.ftePct}%; background: var(--color-fulltime)"></div>
                </div>
              </div>

              <!-- Intern Only Card -->
              <div class="card-offer-type group cursor-pointer rounded-xl border border-line-strong bg-bg p-4 sm:p-5 transition-all hover:border-fg/40 hover:bg-panel" data-role="internship">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3 h-3 rounded-full shrink-0" style="background:var(--color-intern)"></span>
                    <span class="font-medium text-[14px] sm:text-[15px] text-fg">Intern Only</span>
                    <span class="label text-[11px] text-muted">Summer Internship</span>
                  </div>
                  <div class="text-right">
                    <span id="card-count-intern" class="font-display text-[17px] sm:text-[19px] font-semibold text-fg">${offerStats.intern}</span>
                    <span class="text-[12px] text-muted ml-1">offers</span>
                    <span id="card-pct-intern" class="ml-2 font-mono text-[12px] font-semibold text-fg bg-line-strong/60 px-1.5 py-0.5 rounded">${offerStats.internPct}%</span>
                  </div>
                </div>
                <div id="card-desc-intern" class="mt-2 text-[12px] text-muted leading-relaxed">
                  Summer internship terms with monthly stipend across ${offerStats.internComps} recruiters (e.g. Barclays Intern, Colgate, Russell Investments, BNY Mellon).
                </div>
                <div class="mt-3 h-1.5 w-full rounded-full bg-line overflow-hidden">
                  <div id="card-bar-intern" class="h-full rounded-full transition-all duration-500" style="width: ${offerStats.internPct}%; background: var(--color-intern)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 02: Full-time and PPO Packages -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">02 — Packages</p>
          <h2 class="display-m mt-2">Full-time and PPO packages</h2>
        </div>

        <div class="mt-8">
          <div id="offers-chips-bar" class="mb-4 flex flex-wrap gap-x-6 gap-y-2">
            <!-- Rendered dynamically -->
          </div>

          <!-- CTC Tiers Breakdown Cards -->
          <div id="offers-tiers-grid" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>

      <!-- Section 03: Full Compensation & Offers Directory -->
      <section class="mt-20">
        <div class="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="label text-faint">03 — Directory</p>
            <h2 class="display-m mt-2">All packages &amp; offers by company</h2>
          </div>
          <!-- Filter Search & Track Filter Status -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div id="filter-indicator" class="hidden items-center gap-2 rounded-full border border-line-strong bg-panel px-3 py-1 text-[12px] text-muted">
              <span>Filter: <strong id="filter-indicator-text" class="text-fg"></strong></span>
              <button id="filter-indicator-clear" type="button" class="text-faint hover:text-fg font-bold ml-1">✕</button>
            </div>
            <div class="relative flex-1 sm:min-w-[280px]">
              <input id="offers-search" type="search" placeholder="Search company, stipend or role..." class="w-full rounded-full border border-line-strong bg-panel px-4 py-2 text-[14px] text-fg outline-none focus:border-fg transition-colors" />
            </div>
          </div>
        </div>

        <div class="mt-8 overflow-x-auto">
          <table class="w-full text-left text-[14px]">
            <thead>
              <tr class="border-b border-line text-faint label">
                <th class="py-3 pr-4">Company</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Advertised CTC</th>
                <th class="py-3 px-4">Internship Stipend</th>
                <th class="py-3 px-4">Selections</th>
                <th class="py-3 pl-4">Eligible Branches</th>
              </tr>
            </thead>
            <tbody id="offers-table-body" class="divide-y divide-line">
              <!-- Rendered by script -->
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const companies = batch.companies || [];

    // Header badge & desc
    const badgeEl = document.getElementById('offers-page-badge');
    if (badgeEl) badgeEl.textContent = \`Offers · Classification & Packages · SPIT Class of \${batch.year}\`;

    const descEl = document.getElementById('offers-page-desc');
    if (descEl) {
      descEl.textContent = \`Offer distribution by track, CTC packages, and monthly internship stipends compiled directly from confirmed recruitment drives for SPIT Class of \${batch.year}.\`;
    }

    // Headline metrics
    const headlineEl = document.getElementById('offers-headline-metrics');
    if (headlineEl) {
      if (is2028) {
        headlineEl.innerHTML = \`
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
            <dt class="order-2 mt-2 text-muted text-[13px]">Highest Stipend</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.highestStipend}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Barclays Summer Intern</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Median Stipend</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.medianStipend}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">\${companies.length} companies recruiting</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Average Stipend</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.averageStipend}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Company mean stipend</dd>
          </div>
          <div class="flex flex-col py-5 pr-4 sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Total Summer Offers</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.internshipsCount}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">100% Summer Internship</dd>
          </div>
        \`;
      } else {
        headlineEl.innerHTML = \`
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
            <dt class="order-2 mt-2 text-muted text-[13px]">Average CTC</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.averageCTC}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Median \${batch.stats.medianCTC} · \${companies.length} companies</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Highest Compensation</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.highestCTC}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">PhonePe SDE</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Highest Stipend</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">\${batch.stats.highestStipend}</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">JPMC (CTC Risk)</dd>
          </div>
          <div class="flex flex-col py-5 pr-4 sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Total Verified Offers</dt>
            <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight">264</dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Across all selections</dd>
          </div>
        \`;
      }
    }

    // Offer Classification Logic
    function getClassificationData(compList) {
      let fte = 0, intern = 0, ppo = 0;
      const compFte = new Set(), compIntern = new Set(), compPpo = new Set();

      compList.forEach(c => {
        if (c.noDetailsAvailable) return;
        if (c.roles && c.roles.length > 0) {
          c.roles.forEach(r => {
            const cnt = r.count || 0;
            const t = (r.type || '').toLowerCase();
            if (t === 'both' || t === 'internship+ppo' || t.includes('ppo')) {
              ppo += cnt;
              compPpo.add(c.name);
            } else if (t === 'internship' || t === 'intern') {
              intern += cnt;
              compIntern.add(c.name);
            } else if (t === 'fulltime' || t === 'ft' || t === 'fte') {
              fte += cnt;
              compFte.add(c.name);
            }
          });
        } else if (c.out) {
          if (c.out.ppo > 0 || (c.offers && c.offers.includes('ppo'))) {
            ppo += (c.out.students || c.out.internships || 0);
            compPpo.add(c.name);
          } else if (c.out.internships > 0 || (c.offers && c.offers.includes('internship') && !c.offers.includes('fulltime'))) {
            intern += (c.out.students || c.out.internships || 0);
            compIntern.add(c.name);
          } else if (c.out.fulltimeOffers > 0 || (c.offers && c.offers.includes('fulltime'))) {
            fte += (c.out.students || c.out.fulltimeOffers || 0);
            compFte.add(c.name);
          }
        }
      });

      const total = fte + intern + ppo || 1;
      return {
        fte,
        intern,
        ppo,
        total: fte + intern + ppo,
        ftePct: ((fte / total) * 100).toFixed(1),
        internPct: ((intern / total) * 100).toFixed(1),
        ppoPct: ((ppo / total) * 100).toFixed(1),
        fteComps: compFte.size,
        internComps: compIntern.size,
        ppoComps: compPpo.size
      };
    }

    let activeClassificationStats = null;
    let selectedRoleFilter = 'all';

    function resetDonutCenter() {
      const centerVal = document.getElementById('donut-center-val');
      const centerLbl = document.getElementById('donut-center-lbl');
      const centerSub = document.getElementById('donut-center-sub');
      if (centerVal && activeClassificationStats) centerVal.textContent = activeClassificationStats.total;
      if (centerLbl) centerLbl.textContent = 'Total Offers';
      if (centerSub) centerSub.textContent = is2028 ? 'Summer Interns' : '3 Tracks';

      const segPpo = document.getElementById('donut-seg-ppo');
      const segFte = document.getElementById('donut-seg-fte');
      const segIntern = document.getElementById('donut-seg-intern');
      [segPpo, segFte, segIntern].forEach(el => {
        if (el) {
          el.setAttribute('stroke-width', '22');
          el.style.opacity = '1';
        }
      });
    }

    function highlightOfferType(role) {
      if (!activeClassificationStats) return;
      const centerVal = document.getElementById('donut-center-val');
      const centerLbl = document.getElementById('donut-center-lbl');
      const centerSub = document.getElementById('donut-center-sub');

      let name = '', count = 0, pct = '0.0', comps = 0;
      let activeEl = null;
      const segPpo = document.getElementById('donut-seg-ppo');
      const segFte = document.getElementById('donut-seg-fte');
      const segIntern = document.getElementById('donut-seg-intern');

      if (role === 'ppo') {
        name = 'Intern + PPO';
        count = activeClassificationStats.ppo;
        pct = activeClassificationStats.ppoPct;
        comps = activeClassificationStats.ppoComps;
        activeEl = segPpo;
      } else if (role === 'fulltime') {
        name = 'FTE Offers';
        count = activeClassificationStats.fte;
        pct = activeClassificationStats.ftePct;
        comps = activeClassificationStats.fteComps;
        activeEl = segFte;
      } else if (role === 'internship') {
        name = 'Intern Only';
        count = activeClassificationStats.intern;
        pct = activeClassificationStats.internPct;
        comps = activeClassificationStats.internComps;
        activeEl = segIntern;
      }

      if (centerVal) centerVal.textContent = count;
      if (centerLbl) centerLbl.textContent = name;
      if (centerSub) centerSub.textContent = \`\${pct}% · \${comps} recruiters\`;

      [segPpo, segFte, segIntern].forEach(el => {
        if (!el) return;
        if (el === activeEl) {
          el.setAttribute('stroke-width', '25');
          el.style.opacity = '1';
        } else {
          el.setAttribute('stroke-width', '22');
          el.style.opacity = '0.3';
        }
      });
    }

    function syncCardSelection(activeRole) {
      selectedRoleFilter = activeRole;
      document.querySelectorAll('.card-offer-type').forEach(card => {
        const r = card.getAttribute('data-role');
        if (r === activeRole) {
          card.classList.add('border-fg', 'bg-line/20', 'ring-1', 'ring-fg');
          card.classList.remove('border-line-strong');
        } else {
          card.classList.remove('border-fg', 'bg-line/20', 'ring-1', 'ring-fg');
          card.classList.add('border-line-strong');
        }
      });

      const indicator = document.getElementById('filter-indicator');
      const indicatorText = document.getElementById('filter-indicator-text');
      if (indicator && indicatorText) {
        if (activeRole === 'all') {
          indicator.classList.add('hidden');
          indicator.classList.remove('flex');
        } else {
          indicator.classList.remove('hidden');
          indicator.classList.add('flex');
          const labelMap = { ppo: 'Intern + PPO', fulltime: 'FTE Offers', internship: 'Intern Only' };
          indicatorText.textContent = labelMap[activeRole] || activeRole;
        }
      }

      renderOffersTable(document.getElementById('offers-search')?.value || '');
    }

    function updateClassificationChart() {
      const stats = getClassificationData(companies);
      activeClassificationStats = stats;

      const chartBatchBadge = document.getElementById('chart-batch-badge');
      if (chartBatchBadge) {
        chartBatchBadge.textContent = is2028
          ? \`Class of 2028 · \${stats.total} verified offers\`
          : \`Class of 2027 · \${stats.total} verified offers\`;
      }

      const C = 439.82;
      const total = stats.total || 1;
      const segPpo = document.getElementById('donut-seg-ppo');
      const segFte = document.getElementById('donut-seg-fte');
      const segIntern = document.getElementById('donut-seg-intern');

      const items = [
        { el: segPpo, count: stats.ppo },
        { el: segFte, count: stats.fte },
        { el: segIntern, count: stats.intern }
      ];

      const nonZero = items.filter(it => it.count > 0).length;
      const gap = nonZero > 1 ? 3 : 0;
      const avail = C - nonZero * gap;

      let offset = 0;
      items.forEach(it => {
        if (!it.el) return;
        if (it.count === 0) {
          it.el.setAttribute('stroke-dasharray', \`0 \${C}\`);
          it.el.setAttribute('stroke-dashoffset', '0');
        } else {
          const len = (it.count / total) * avail;
          it.el.setAttribute('stroke-dasharray', \`\${len.toFixed(2)} \${C}\`);
          it.el.setAttribute('stroke-dashoffset', String(-offset));
          offset += len + gap;
        }
      });

      resetDonutCenter();

      const countPpo = document.getElementById('card-count-ppo');
      const pctPpo = document.getElementById('card-pct-ppo');
      const barPpo = document.getElementById('card-bar-ppo');
      const descPpo = document.getElementById('card-desc-ppo');

      const countFte = document.getElementById('card-count-fte');
      const pctFte = document.getElementById('card-pct-fte');
      const barFte = document.getElementById('card-bar-fte');
      const descFte = document.getElementById('card-desc-fte');

      const countIntern = document.getElementById('card-count-intern');
      const pctIntern = document.getElementById('card-pct-intern');
      const barIntern = document.getElementById('card-bar-intern');
      const descIntern = document.getElementById('card-desc-intern');

      if (countPpo) countPpo.textContent = stats.ppo;
      if (pctPpo) pctPpo.textContent = \`\${stats.ppoPct}%\`;
      if (barPpo) barPpo.style.width = \`\${stats.ppoPct}%\`;
      if (descPpo) {
        descPpo.textContent = is2028
          ? 'PPO evaluations take place following summer internship completion.'
          : \`Summer internship leading directly to full-time pre-placement offer across \${stats.ppoComps} recruiters (e.g. JPMC, ISS-STOXX, TransUnion, GEP, Wissen).\`;
      }

      if (countFte) countFte.textContent = stats.fte;
      if (pctFte) pctFte.textContent = \`\${stats.ftePct}%\`;
      if (barFte) barFte.style.width = \`\${stats.ftePct}%\`;
      if (descFte) {
        descFte.textContent = is2028
          ? 'Direct full-time phase commences in future recruitment cycle.'
          : \`Direct graduate full-time appointments without mandatory internship across \${stats.fteComps} recruiters (e.g. Barclays FT, UBS, Capgemini, AspectRatio).\`;
      }

      if (countIntern) countIntern.textContent = stats.intern;
      if (pctIntern) pctIntern.textContent = \`\${stats.internPct}%\`;
      if (barIntern) barIntern.style.width = \`\${stats.internPct}%\`;
      if (descIntern) {
        descIntern.textContent = is2028
          ? \`\${stats.internComps} summer internship recruiters (Barclays, Mastercard, IBM, General Mills, Russell Investments).\`
          : \`Summer internship terms with monthly stipend across \${stats.internComps} recruiters (e.g. Barclays Intern, Colgate, Russell Investments, BNY Mellon).\`;
      }
    }

    updateClassificationChart();

    // Wire hover & click on cards
    document.querySelectorAll('.card-offer-type').forEach(card => {
      const role = card.getAttribute('data-role');
      card.addEventListener('mouseenter', () => highlightOfferType(role));
      card.addEventListener('mouseleave', resetDonutCenter);
      card.addEventListener('click', () => {
        const target = (selectedRoleFilter === role) ? 'all' : role;
        syncCardSelection(target);
        document.getElementById('offers-table-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Wire hover & click on SVG donut segments
    [
      { id: 'donut-seg-ppo', role: 'ppo' },
      { id: 'donut-seg-fte', role: 'fulltime' },
      { id: 'donut-seg-intern', role: 'internship' }
    ].forEach(({ id, role }) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('mouseenter', () => highlightOfferType(role));
      el.addEventListener('mouseleave', resetDonutCenter);
      el.addEventListener('click', () => {
        const target = (selectedRoleFilter === role) ? 'all' : role;
        syncCardSelection(target);
        document.getElementById('offers-table-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.getElementById('filter-indicator-clear')?.addEventListener('click', () => {
      syncCardSelection('all');
    });

    // Chips
    const chipsEl = document.getElementById('offers-chips-bar');
    if (chipsEl) {
      if (is2028) {
        chipsEl.innerHTML = \`
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="4 4"></line></svg>
            Median Stipend \${batch.stats.medianStipend}
          </span>
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="1 3"></line></svg>
            Average Stipend \${batch.stats.averageStipend}
          </span>
          <span class="chip text-muted">
            <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"></circle></svg>
            \${companies.length} recruiting companies · 100% Summer Internships
          </span>
        \`;
      } else {
        chipsEl.innerHTML = \`
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="4 4"></line></svg>
            Median \${batch.stats.medianCTC}
          </span>
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="1 3"></line></svg>
            Average \${batch.stats.averageCTC}
          </span>
          <span class="chip text-muted">
            <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"></circle></svg>
            \${companies.length} recruiting companies with selections
          </span>
        \`;
      }
    }

    // Tiers Grid
    const tiersEl = document.getElementById('offers-tiers-grid');
    if (tiersEl) {
      if (is2028) {
        tiersEl.innerHTML = \`
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 1</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">High Stipend</h4>
            <p class="text-[13px] text-muted mt-1">₹75,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">25 offers</span>
              <span class="label text-[12px] text-muted">Barclays Intern</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 2</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Quant & Research</h4>
            <p class="text-[13px] text-muted mt-1">₹60,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">5 offers</span>
              <span class="label text-[12px] text-muted">Russell Investments</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 3</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Fintech & Sales</h4>
            <p class="text-[13px] text-muted mt-1">₹50,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">14 offers</span>
              <span class="label text-[12px] text-muted">Mastercard (9), IBM (5)</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 4</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Enterprise Tech</h4>
            <p class="text-[13px] text-muted mt-1">₹35,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">6 offers</span>
              <span class="label text-[12px] text-muted">General Mills</span>
            </div>
          </div>
        \`;
      } else {
        tiersEl.innerHTML = \`
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 1</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Super Dream</h4>
            <p class="text-[13px] text-muted mt-1">&gt; ₹20 LPA</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">6 offers</span>
              <span class="label text-[12px] text-muted">PhonePe (₹33.5L)</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 2</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Dream Tier</h4>
            <p class="text-[13px] text-muted mt-1">₹14 – ₹20 LPA</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">67 offers</span>
              <span class="label text-[12px] text-muted">Barclays, IDFC, ISS/STOXX, UBS</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 3</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Core Tech</h4>
            <p class="text-[13px] text-muted mt-1">₹10 – ₹14 LPA</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">56 offers</span>
              <span class="label text-[12px] text-muted">Capgemini, AspectRatio, InCred</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 4</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Standard</h4>
            <p class="text-[13px] text-muted mt-1">&lt; ₹10 LPA</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">96 offers</span>
              <span class="label text-[12px] text-muted">TransUnion, GEP, Quantiphi, Wissen</span>
            </div>
          </div>
        \`;
      }
    }

    // Offers Directory Table
    const searchInput = document.getElementById('offers-search');
    const tableBody = document.getElementById('offers-table-body');

    function renderOffersTable(query = '') {
      const q = query.toLowerCase();
      const filtered = companies.filter(c => {
        // Track filter
        if (selectedRoleFilter !== 'all') {
          if (!c.offers || !c.offers.includes(selectedRoleFilter)) return false;
        }

        // Query filter
        if (q) {
          const matchName = c.name && c.name.toLowerCase().includes(q);
          const matchBranches = c.branches && c.branches.toLowerCase().includes(q);
          const matchPay = c.pay && c.pay.toLowerCase().includes(q);
          const matchRoles = c.roles && c.roles.some(r => (r.title && r.title.toLowerCase().includes(q)) || (r.stipend && r.stipend.toLowerCase().includes(q)));
          if (!matchName && !matchBranches && !matchPay && !matchRoles) return false;
        }

        return true;
      });

      if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-muted">No matching offers found for this filter.</td></tr>';
        return;
      }

      tableBody.innerHTML = filtered.map(c => {
        let chips = '';
        if (c.offers?.includes('internship')) chips += '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern</span>';
        if (c.offers?.includes('fulltime')) chips += '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';
        if (c.offers?.includes('ppo')) chips += '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>';

        const stipendStr = c.roles?.find(r => r.stipend)?.stipend || '—';

        return \`
          <tr class="hover:bg-panel transition-colors">
            <td class="py-4 pr-4">
              <a href="/companies/company.html?slug=\${c.slug}\${is2028 ? '&batch=2028' : ''}" class="flex items-center gap-3 font-medium text-fg hover:underline">
                \${c.logo ? '<img src="' + c.logo + '" class="size-6 object-contain rounded" />' : ''}
                \${c.name}
              </a>
            </td>
            <td class="py-4 px-4"><div class="flex gap-1.5">\${chips}</div></td>
            <td class="py-4 px-4 num font-semibold text-fg">\${c.pay || 'Competitive'}</td>
            <td class="py-4 px-4 num text-muted">\${stipendStr}</td>
            <td class="py-4 px-4 num text-fg font-medium">\${c.out?.students || 0} placed</td>
            <td class="py-4 pl-4 text-muted">\${c.branches || 'All branches open'}</td>
          </tr>
        \`;
      }).join('');
    }

    searchInput?.addEventListener('input', (e) => renderOffersTable(e.target.value));
    renderOffersTable();
  `;

  const html = pageTemplate({
    title: `Offers · Placed · ${siteConfig.collegeShort}`,
    activePath: '/offers/',
    content,
    extraScript
  });

  const offersDir = path.join(__dirname, '..', 'offers');
  if (!fs.existsSync(offersDir)) fs.mkdirSync(offersDir, { recursive: true });
  fs.writeFileSync(path.join(offersDir, 'index.html'), html);
  console.log('offers/index.html created successfully with Multi-Batch support!');
}

generateOffersPage();
module.exports = { generateOffersPage };
