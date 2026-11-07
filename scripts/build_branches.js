const fs = require('fs');
const path = require('path');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');
const { branchSummary, companyBranchDistribution } = require('../src/data/branch_distribution');

function generateBranchesPage() {
  const content = `
    <!-- Top Hero Section -->
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
        <div>
          <p id="branches-page-badge" class="label text-muted">Branchwise · Verified Department Breakdown · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
          <h1 class="display-l mt-6 max-w-[18ch]">Branch-wise placement distribution.</h1>
          <p id="branches-page-desc" class="mt-8 max-w-[66ch] text-[17px] leading-relaxed text-muted">
            Confirmed departmental placement distributions across Computer Engineering, Computer Science Engineering, and EXTC compiled from 38 recruitment drives.
          </p>
        </div>
        <div class="shrink-0">
          <button type="button" id="btn-open-branch-submit" class="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel px-5 py-2.5 text-[13px] font-medium text-fg hover:border-fg hover:bg-bg transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>Submit branch data</span>
          </button>
        </div>
      </div>
    </section>

    <div class="wrap">
      <!-- 4-Column Headline Metrics -->
      <dl id="branches-headline-metrics" class="grid grid-cols-2 border-t border-line sm:grid-cols-4">
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
          <dt class="order-2 mt-2 text-muted text-[13px] flex items-center gap-2">
            <span class="size-2 rounded-full" style="background:#10b981"></span>
            Computer Engineering
          </dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight text-fg">61</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">25.8% of total · 48.8% of known</dd>
        </div>
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px] flex items-center gap-2">
            <span class="size-2 rounded-full" style="background:#38bdf8"></span>
            Computer Science Engg
          </dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight text-fg">44</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">18.6% of total · 35.2% of known</dd>
        </div>
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px] flex items-center gap-2">
            <span class="size-2 rounded-full" style="background:#f43f5e"></span>
            Electronics &amp; Telecom
          </dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight text-fg">20</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">8.5% of total · 16.0% of known</dd>
        </div>
        <div class="flex flex-col py-5 pr-4 sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px] flex items-center gap-2">
            <span class="size-2 rounded-full" style="background:#71717a"></span>
            Unknown / Awaiting Division
          </dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] tracking-tight text-fg">111</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">47.0% pending author division</dd>
        </div>
      </dl>

      <!-- Section 01: Branch-Wise Total Distribution Bar Graph & Cards -->
      <section class="mt-20">
        <div class="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <p class="label text-faint">01 — Total Branch-Wise Distribution</p>
            <h2 class="display-m mt-2">Aggregate Department Breakdown</h2>
          </div>
          <div id="branch-total-badge" class="label text-[12px] text-faint">
            Class of 2027 · 236 confirmed offers across 38 recruiters
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-line-strong bg-panel p-6 sm:p-8">
          <!-- Bar Graph Header & View Mode Switcher -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-line">
            <div>
              <p class="text-[14px] text-muted max-w-[65ch]">
                Comparative offer distribution across engineering branches and unclassified drives. Click any bar column to filter companies below.
              </p>
            </div>
            <!-- View Mode Switcher -->
            <div class="inline-flex items-center rounded-full border border-line-strong bg-bg p-1 text-[12px] shrink-0" role="tablist">
              <button type="button" id="btn-chart-all" class="chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all bg-panel text-fg shadow-sm border border-line-strong" data-mode="all">
                All 4 Groups (236 Offers)
              </button>
              <button type="button" id="btn-chart-known" class="chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all text-muted hover:text-fg" data-mode="known">
                Known Branches Only (125 Offers)
              </button>
            </div>
          </div>

          <!-- Vertical Bar Graph Canvas -->
          <div class="relative mt-8 pt-4 overflow-x-auto">
            <div class="min-w-[500px] relative">
              <!-- Y-Axis Gridlines & Ticks -->
              <div id="chart-y-axis" class="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[85px] pr-2">
                <div class="flex items-center w-full border-b border-line/40 border-dashed pb-1">
                  <span class="y-axis-label font-mono text-[11px] text-faint w-10 text-right pr-3 shrink-0">120</span>
                  <div class="w-full"></div>
                </div>
                <div class="flex items-center w-full border-b border-line/40 border-dashed pb-1">
                  <span class="y-axis-label font-mono text-[11px] text-faint w-10 text-right pr-3 shrink-0">90</span>
                  <div class="w-full"></div>
                </div>
                <div class="flex items-center w-full border-b border-line/40 border-dashed pb-1">
                  <span class="y-axis-label font-mono text-[11px] text-faint w-10 text-right pr-3 shrink-0">60</span>
                  <div class="w-full"></div>
                </div>
                <div class="flex items-center w-full border-b border-line/40 border-dashed pb-1">
                  <span class="y-axis-label font-mono text-[11px] text-faint w-10 text-right pr-3 shrink-0">30</span>
                  <div class="w-full"></div>
                </div>
                <div class="flex items-center w-full border-b border-line pb-1">
                  <span class="y-axis-label font-mono text-[11px] text-faint w-10 text-right pr-3 shrink-0">0</span>
                  <div class="w-full"></div>
                </div>
              </div>

              <!-- Vertical Bar Columns Container -->
              <div class="relative z-10 pl-14 pr-4 h-[320px] sm:h-[360px] flex items-end justify-around gap-4 sm:gap-8 pb-[85px]">
                <!-- CE Bar -->
                <div class="branch-bar-col group flex-1 max-w-[130px] flex flex-col items-center justify-end h-full cursor-pointer transition-all duration-300" data-branch="ce">
                  <!-- Top Floating Value Badge -->
                  <div class="mb-2 flex flex-col items-center text-center transition-transform group-hover:-translate-y-1">
                    <div class="flex items-baseline gap-1">
                      <span class="font-display text-[22px] sm:text-[26px] font-bold text-fg leading-none">61</span>
                      <span class="text-[11px] text-muted">offers</span>
                    </div>
                    <span class="ce-pct-badge mt-1 rounded bg-[#10b981]/15 border border-[#10b981]/30 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#10b981]">25.8%</span>
                  </div>
                  <!-- The Bar Element -->
                  <div class="bar-fill w-full rounded-t-xl transition-all duration-500 ease-out border-t-2 border-x border-[#10b981] group-hover:brightness-125 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] relative overflow-hidden"
                       style="height: 50.8%; background: linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.25) 100%);"
                       data-height-all="50.8%" data-height-known="87.1%">
                    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <!-- CSE Bar -->
                <div class="branch-bar-col group flex-1 max-w-[130px] flex flex-col items-center justify-end h-full cursor-pointer transition-all duration-300" data-branch="cse">
                  <!-- Top Floating Value Badge -->
                  <div class="mb-2 flex flex-col items-center text-center transition-transform group-hover:-translate-y-1">
                    <div class="flex items-baseline gap-1">
                      <span class="font-display text-[22px] sm:text-[26px] font-bold text-fg leading-none">44</span>
                      <span class="text-[11px] text-muted">offers</span>
                    </div>
                    <span class="cse-pct-badge mt-1 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/30 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#38bdf8]">18.6%</span>
                  </div>
                  <!-- The Bar Element -->
                  <div class="bar-fill w-full rounded-t-xl transition-all duration-500 ease-out border-t-2 border-x border-[#38bdf8] group-hover:brightness-125 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] relative overflow-hidden"
                       style="height: 36.7%; background: linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.25) 100%);"
                       data-height-all="36.7%" data-height-known="62.9%">
                    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <!-- EXTC Bar -->
                <div class="branch-bar-col group flex-1 max-w-[130px] flex flex-col items-center justify-end h-full cursor-pointer transition-all duration-300" data-branch="extc">
                  <!-- Top Floating Value Badge -->
                  <div class="mb-2 flex flex-col items-center text-center transition-transform group-hover:-translate-y-1">
                    <div class="flex items-baseline gap-1">
                      <span class="font-display text-[22px] sm:text-[26px] font-bold text-fg leading-none">20</span>
                      <span class="text-[11px] text-muted">offers</span>
                    </div>
                    <span class="extc-pct-badge mt-1 rounded bg-[#f43f5e]/15 border border-[#f43f5e]/30 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#f43f5e]">8.5%</span>
                  </div>
                  <!-- The Bar Element -->
                  <div class="bar-fill w-full rounded-t-xl transition-all duration-500 ease-out border-t-2 border-x border-[#f43f5e] group-hover:brightness-125 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.35)] relative overflow-hidden"
                       style="height: 16.7%; background: linear-gradient(180deg, #f43f5e 0%, rgba(244, 63, 94, 0.25) 100%);"
                       data-height-all="16.7%" data-height-known="28.6%">
                    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <!-- Unknown Bar -->
                <div id="bar-col-unknown" class="branch-bar-col group flex-1 max-w-[130px] flex flex-col items-center justify-end h-full cursor-pointer transition-all duration-300" data-branch="unknown">
                  <!-- Top Floating Value Badge -->
                  <div class="mb-2 flex flex-col items-center text-center transition-transform group-hover:-translate-y-1">
                    <div class="flex items-baseline gap-1">
                      <span class="font-display text-[22px] sm:text-[26px] font-bold text-fg leading-none">111</span>
                      <span class="text-[11px] text-muted">offers</span>
                    </div>
                    <span class="unknown-pct-badge mt-1 rounded bg-zinc-500/15 border border-zinc-500/30 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-400">47.0%</span>
                  </div>
                  <!-- The Bar Element -->
                  <div class="bar-fill w-full rounded-t-xl transition-all duration-500 ease-out border-t-2 border-x border-zinc-500 group-hover:brightness-125 group-hover:shadow-[0_0_25px_rgba(113,113,122,0.35)] relative overflow-hidden"
                       style="height: 92.5%; background: linear-gradient(180deg, #71717a 0%, rgba(113, 113, 122, 0.25) 100%);"
                       data-height-all="92.5%" data-height-known="0%">
                    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>

              <!-- X-Axis Labels Below Baseline -->
              <div class="relative border-t border-line-strong pl-14 pr-4 flex justify-around gap-4 sm:gap-8 pt-3 text-center">
                <!-- CE Label -->
                <div class="branch-x-label flex-1 max-w-[130px] cursor-pointer group" data-branch="ce">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" style="background:#10b981"></span>
                    <span class="font-display font-bold text-[14px] sm:text-[16px] text-fg group-hover:text-[#10b981] transition-colors">CE</span>
                  </div>
                  <div class="mt-0.5 text-[11px] sm:text-[12px] text-muted truncate">Computer Engg</div>
                  <div class="mt-1 font-mono text-[10px] text-faint">28 Recruiters</div>
                </div>

                <!-- CSE Label -->
                <div class="branch-x-label flex-1 max-w-[130px] cursor-pointer group" data-branch="cse">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" style="background:#38bdf8"></span>
                    <span class="font-display font-bold text-[14px] sm:text-[16px] text-fg group-hover:text-[#38bdf8] transition-colors">CSE</span>
                  </div>
                  <div class="mt-0.5 text-[11px] sm:text-[12px] text-muted truncate">Computer Science</div>
                  <div class="mt-1 font-mono text-[10px] text-faint">22 Recruiters</div>
                </div>

                <!-- EXTC Label -->
                <div class="branch-x-label flex-1 max-w-[130px] cursor-pointer group" data-branch="extc">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" style="background:#f43f5e"></span>
                    <span class="font-display font-bold text-[14px] sm:text-[16px] text-fg group-hover:text-[#f43f5e] transition-colors">EXTC</span>
                  </div>
                  <div class="mt-0.5 text-[11px] sm:text-[12px] text-muted truncate">Electronics &amp; Telecom</div>
                  <div class="mt-1 font-mono text-[10px] text-faint">12 Recruiters</div>
                </div>

                <!-- Unknown Label -->
                <div id="label-col-unknown" class="branch-x-label flex-1 max-w-[130px] cursor-pointer group transition-all duration-300" data-branch="unknown">
                  <div class="flex items-center justify-center gap-1.5">
                    <span class="size-2 rounded-full" style="background:#71717a"></span>
                    <span class="font-display font-bold text-[14px] sm:text-[16px] text-fg group-hover:text-zinc-400 transition-colors">Unknown</span>
                  </div>
                  <div class="mt-0.5 text-[11px] sm:text-[12px] text-muted truncate">Awaiting Division</div>
                  <div class="mt-1 font-mono text-[10px] text-faint">30 Recruiters</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Branch Detail Cards Grid -->
          <div id="branch-cards-grid" class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-line/60">
            ${branchSummary.branches.map(b => `
              <div class="card-branch group cursor-pointer rounded-xl border border-line-strong bg-bg p-5 transition-all hover:border-fg/40 hover:bg-panel flex flex-col justify-between" data-branch="${b.id}">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${b.color};"></span>
                      <h3 class="font-display font-semibold text-[15px] text-fg leading-tight">${b.shortName}</h3>
                    </div>
                    <div class="text-right shrink-0">
                      <span class="font-display text-[18px] font-bold text-fg">${b.count}</span>
                      <span class="text-[11px] text-muted ml-0.5">offers</span>
                      <span class="ml-1.5 font-mono text-[11px] font-semibold text-fg bg-line-strong/60 px-1.5 py-0.5 rounded">${b.percentage}%</span>
                    </div>
                  </div>
                  <p class="mt-2 text-[12px] text-muted leading-relaxed">${b.name}</p>
                </div>
                <div class="mt-4">
                  <!-- Meter Bar -->
                  <div class="h-2 w-full rounded-full bg-line overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${b.percentage}%; background-color: ${b.color};"></div>
                  </div>
                  <!-- Top Recruiters Chips -->
                  <div class="mt-3 flex flex-wrap items-center gap-1 text-[11px] text-faint">
                    <span class="font-medium text-muted">${b.recruiterCount} recruiters:</span>
                    ${b.topRecruiters.slice(0, 3).map(r => `<span class="bg-panel border border-line px-1.5 py-0.5 rounded text-muted text-[10px]">${r}</span>`).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <p class="text-[11px] text-faint mt-4 text-center sm:text-left">Click any bar column or card above to filter the company distribution below</p>
        </div>
      </section>

      <!-- Section 02: Company-Wise Per Company Distribution Table -->
      <section class="mt-20 pb-20">
        <div class="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="label text-faint">02 — Company-Wise Breakdown</p>
            <h2 class="display-m mt-2">Per-Company Branch Distribution</h2>
          </div>
          <!-- Filter Search & Indicator -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div id="branch-filter-indicator" class="hidden items-center gap-2 rounded-full border border-line-strong bg-panel px-3 py-1 text-[12px] text-muted">
              <span>Filter: <strong id="branch-filter-text" class="text-fg"></strong></span>
              <button id="branch-filter-clear" type="button" class="text-faint hover:text-fg font-bold ml-1 cursor-pointer" title="Clear filter">✕</button>
            </div>
            <div class="relative flex-1 sm:min-w-[280px]">
              <input id="branch-company-search" type="search" placeholder="Search company, role or notes..." class="w-full rounded-full border border-line-strong bg-panel px-4 py-2 text-[14px] text-fg outline-none focus:border-fg transition-colors" />
            </div>
          </div>
        </div>

        <!-- Branch Quick Filter Pills -->
        <div id="branch-filter-pills" class="mt-6 flex flex-wrap items-center gap-2">
          <button type="button" class="branch-pill cursor-pointer rounded-full border border-fg bg-fg text-bg px-3.5 py-1 text-[12px] font-medium transition-all" data-branch="all">All (38 Drives)</button>
          <button type="button" class="branch-pill cursor-pointer rounded-full border border-line-strong bg-panel px-3.5 py-1 text-[12px] text-muted hover:text-fg hover:border-fg transition-all" data-branch="ce">
            <span class="inline-block size-2 rounded-full mr-1.5" style="background:#10b981"></span>Computer Engg (28)
          </button>
          <button type="button" class="branch-pill cursor-pointer rounded-full border border-line-strong bg-panel px-3.5 py-1 text-[12px] text-muted hover:text-fg hover:border-fg transition-all" data-branch="cse">
            <span class="inline-block size-2 rounded-full mr-1.5" style="background:#38bdf8"></span>Computer Science Engg (22)
          </button>
          <button type="button" class="branch-pill cursor-pointer rounded-full border border-line-strong bg-panel px-3.5 py-1 text-[12px] text-muted hover:text-fg hover:border-fg transition-all" data-branch="extc">
            <span class="inline-block size-2 rounded-full mr-1.5" style="background:#f43f5e"></span>EXTC (12)
          </button>
          <button type="button" class="branch-pill cursor-pointer rounded-full border border-line-strong bg-panel px-3.5 py-1 text-[12px] text-muted hover:text-fg hover:border-fg transition-all" data-branch="unknown">
            <span class="inline-block size-2 rounded-full mr-1.5" style="background:#71717a"></span>Unknown / Awaiting (30)
          </button>
        </div>

        <!-- Table Container -->
        <div class="mt-6 overflow-x-auto rounded-2xl border border-line-strong bg-panel">
          <table class="w-full text-left text-[14px]">
            <thead>
              <tr class="border-b border-line text-faint label bg-bg/40">
                <th class="py-3.5 pl-6 pr-4">Company &amp; Role</th>
                <th class="py-3.5 px-3 text-center" title="Computer Engineering">
                  <span class="inline-flex items-center gap-1.5 text-[#10b981]">
                    <span class="size-2 rounded-full bg-[#10b981]"></span>CE
                  </span>
                </th>
                <th class="py-3.5 px-3 text-center" title="Computer Science Engineering">
                  <span class="inline-flex items-center gap-1.5 text-[#38bdf8]">
                    <span class="size-2 rounded-full bg-[#38bdf8]"></span>CSE
                  </span>
                </th>
                <th class="py-3.5 px-3 text-center" title="Electronics & Telecommunications">
                  <span class="inline-flex items-center gap-1.5 text-[#f43f5e]">
                    <span class="size-2 rounded-full bg-[#f43f5e]"></span>EXTC
                  </span>
                </th>
                <th class="py-3.5 px-3 text-center text-muted" title="Awaiting / Unclassified">Unknown</th>
                <th class="py-3.5 px-3 text-center text-fg font-semibold">Total</th>
                <th class="py-3.5 px-4 min-w-[140px]">Branch Proportion</th>
                <th class="py-3.5 pl-4 pr-6">Notes / Verification</th>
              </tr>
            </thead>
            <tbody id="company-branch-tbody" class="divide-y divide-line">
              <!-- Rendered by client script or static hydration -->
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-line-strong bg-bg/80 font-semibold text-fg">
                <td class="py-4 pl-6 pr-4">
                  <span class="font-display text-[15px]">ALL 38 COMPANIES</span>
                  <p class="text-[11px] text-faint font-normal">Verified drives across SPIT Class of 2027</p>
                </td>
                <td class="py-4 px-3 text-center num font-bold text-[#10b981]">61</td>
                <td class="py-4 px-3 text-center num font-bold text-[#38bdf8]">44</td>
                <td class="py-4 px-3 text-center num font-bold text-[#f43f5e]">20</td>
                <td class="py-4 px-3 text-center num text-muted">111</td>
                <td class="py-4 px-3 text-center num font-display text-[16px] font-bold text-fg">236</td>
                <td class="py-4 px-4">
                  <div class="h-2 w-full rounded-full overflow-hidden flex bg-line">
                    <div style="width:25.8%; background-color:#10b981;" title="CE: 25.8%"></div>
                    <div style="width:18.6%; background-color:#38bdf8;" title="CSE: 18.6%"></div>
                    <div style="width:8.5%; background-color:#f43f5e;" title="EXTC: 8.5%"></div>
                    <div style="width:47.0%; background-color:#71717a;" title="Unknown: 47.0%"></div>
                  </div>
                </td>
                <td class="py-4 pl-4 pr-6 text-[12px] text-faint font-normal">125 known branch selections</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>

    <!-- Branch Data Submission Modal Dialog -->
    <div id="branch-submit-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div class="relative w-full max-w-[560px] rounded-3xl border border-line-strong bg-panel p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 class="font-display text-[20px] font-bold text-fg">Submit Branch Placement Data</h3>
            <p class="text-[13px] text-muted mt-1">Help resolve the remaining unknown records. Submissions are reviewed on the admin dashboard.</p>
          </div>
          <button type="button" id="btn-close-branch-submit" class="rounded-full p-2 text-muted hover:bg-bg hover:text-fg transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form id="branch-submit-form" class="mt-6 flex flex-col gap-4">
          <div id="branch-submit-status" class="hidden rounded-xl p-3 text-[13px]"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Placement Batch *</label>
              <select id="modal-batch-year" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                <option value="2027" class="bg-[#121316] text-[#ededed]">Class of 2027</option>
                <option value="2028" class="bg-[#121316] text-[#ededed]">Class of 2028</option>
              </select>
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Branch *</label>
              <select id="modal-branch" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                <option value="" class="bg-[#121316] text-[#ededed]">Select branch</option>
                <option value="CE" class="bg-[#121316] text-[#ededed]">Computer Engineering (CE)</option>
                <option value="CSE" class="bg-[#121316] text-[#ededed]">Computer Science Engineering (CSE)</option>
                <option value="EXTC" class="bg-[#121316] text-[#ededed]">Electronics and Telecommunications Engineering (EXTC)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Company Name *</label>
              <input id="modal-company-name" type="text" required placeholder="e.g. Barclays, JPMC, PhonePe..." class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Role Title &amp; Type</label>
              <input id="modal-role-title" type="text" placeholder="e.g. SDE (Full-time) or Intern" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Offers Count</label>
              <input id="modal-offers-count" type="number" min="1" max="100" value="1" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Package / Stipend</label>
              <input id="modal-compensation" type="text" placeholder="e.g. ₹15.05 LPA or ₹75k/mo" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
          </div>

          <div>
            <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Verification Reference / Proof Notes *</label>
            <textarea id="modal-details" rows="3" required placeholder="Describe reference (e.g. placement circular date, WhatsApp result announcement, offer details)..." class="w-full rounded-xl border border-line-strong bg-bg p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Your Name (Optional)</label>
              <input id="modal-submitter-name" type="text" placeholder="Leave blank to remain anonymous" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Contact / Email (Optional)</label>
              <input id="modal-submitter-contact" type="text" placeholder="e.g. student@spit.ac.in" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
          </div>

          <div class="mt-2 flex items-center justify-end gap-3 border-t border-line pt-4">
            <button type="button" id="btn-cancel-branch-submit" class="rounded-full border border-line-strong px-5 py-2.5 text-[13px] text-muted hover:border-fg hover:text-fg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" id="btn-submit-branch-data" class="flex items-center justify-center gap-2 rounded-full bg-fg px-6 py-2.5 text-[13px] font-medium text-bg hover:opacity-90 transition-opacity cursor-pointer">
              <span id="btn-submit-text">Submit Data</span>
              <span id="spinner-branch-submit" class="hidden size-3.5 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData } from '/src/data/batches.js';
    import { companyBranchDistribution, branchSummary } from '/src/data/branch_distribution.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';

    const badgeEl = document.getElementById('branches-page-badge');
    if (badgeEl) {
      badgeEl.textContent = \`Branches · Verified Department Breakdown · SPIT Class of \${batch.year}\`;
    }

    let selectedBranchFilter = 'all'; // 'all' | 'ce' | 'cse' | 'extc' | 'unknown'
    const searchInput = document.getElementById('branch-company-search');
    const tbody = document.getElementById('company-branch-tbody');
    const indicator = document.getElementById('branch-filter-indicator');
    const indicatorText = document.getElementById('branch-filter-text');

    function syncBranchSelection(branchKey) {
      selectedBranchFilter = branchKey;

      // Update pills
      document.querySelectorAll('.branch-pill').forEach(pill => {
        const b = pill.getAttribute('data-branch');
        if (b === branchKey) {
          pill.classList.add('border-fg', 'bg-fg', 'text-bg');
          pill.classList.remove('bg-panel', 'text-muted');
        } else {
          pill.classList.remove('border-fg', 'bg-fg', 'text-bg');
          pill.classList.add('bg-panel', 'text-muted');
        }
      });

      // Update Cards
      document.querySelectorAll('.card-branch').forEach(card => {
        const b = card.getAttribute('data-branch');
        if (branchKey === 'all') {
          card.classList.remove('border-fg', 'bg-line/20', 'ring-1', 'ring-fg', 'opacity-40');
          card.classList.add('border-line-strong');
        } else if (b === branchKey) {
          card.classList.add('border-fg', 'bg-line/20', 'ring-1', 'ring-fg');
          card.classList.remove('border-line-strong', 'opacity-40');
        } else {
          card.classList.remove('border-fg', 'bg-line/20', 'ring-1', 'ring-fg');
          card.classList.add('border-line-strong', 'opacity-40');
        }
      });

      // Update Bar Graph Columns
      document.querySelectorAll('.branch-bar-col').forEach(col => {
        const b = col.getAttribute('data-branch');
        const fill = col.querySelector('.bar-fill');
        if (branchKey === 'all') {
          col.style.opacity = '1';
          if (fill) fill.classList.remove('ring-2', 'ring-fg', 'brightness-125');
        } else if (b === branchKey) {
          col.style.opacity = '1';
          if (fill) fill.classList.add('ring-2', 'ring-fg', 'brightness-125');
        } else {
          col.style.opacity = '0.35';
          if (fill) fill.classList.remove('ring-2', 'ring-fg', 'brightness-125');
        }
      });

      // Update X-Axis Labels
      document.querySelectorAll('.branch-x-label').forEach(lbl => {
        const b = lbl.getAttribute('data-branch');
        if (branchKey === 'all' || b === branchKey) {
          lbl.style.opacity = '1';
        } else {
          lbl.style.opacity = '0.35';
        }
      });

      // Indicator
      if (indicator && indicatorText) {
        if (branchKey === 'all') {
          indicator.classList.add('hidden');
          indicator.classList.remove('flex');
        } else {
          indicator.classList.remove('hidden');
          indicator.classList.add('flex');
          const map = {
            ce: 'Computer Engineering (CE)',
            cse: 'Computer Science Engineering (CSE)',
            extc: 'Electronics & Telecom (EXTC)',
            unknown: 'Unknown / Awaiting Division'
          };
          indicatorText.textContent = map[branchKey] || branchKey;
        }
      }

      renderTable(searchInput?.value || '');
    }

    function renderTable(query = '') {
      const q = query.toLowerCase().trim();
      const filtered = companyBranchDistribution.filter(row => {
        // Branch filter
        if (selectedBranchFilter === 'ce' && row.ce <= 0) return false;
        if (selectedBranchFilter === 'cse' && row.cse <= 0) return false;
        if (selectedBranchFilter === 'extc' && row.extc <= 0) return false;
        if (selectedBranchFilter === 'unknown' && row.unknown <= 0) return false;

        // Query filter
        if (q) {
          const matchCompany = row.company.toLowerCase().includes(q);
          const matchRole = row.role.toLowerCase().includes(q);
          const matchRaw = row.rawName.toLowerCase().includes(q);
          const matchNotes = (row.notes || '').toLowerCase().includes(q);
          if (!matchCompany && !matchRole && !matchRaw && !matchNotes) return false;
        }

        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="py-12 text-center text-muted">No matching company distribution found for this filter.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(row => {
        const cePct = ((row.ce / row.total) * 100).toFixed(1);
        const csePct = ((row.cse / row.total) * 100).toFixed(1);
        const extcPct = ((row.extc / row.total) * 100).toFixed(1);
        const unkPct = ((row.unknown / row.total) * 100).toFixed(1);

        const companyHref = row.slug ? \`/companies/company.html?slug=\${row.slug}\${is2028 ? '&batch=2028' : ''}\` : '#';

        return \`
          <tr class="hover:bg-panel/70 transition-colors">
            <td class="py-4 pl-6 pr-4">
              <a href="\${companyHref}" class="flex items-center gap-3 font-medium text-fg hover:underline">
                \${row.logo ? \`<img src="\${row.logo}" class="size-6 object-contain rounded" alt="" />\` : ''}
                <div>
                  <div class="font-medium text-fg text-[14px]">\${row.company}</div>
                  <div class="text-[11px] text-muted truncate max-w-[260px]">\${row.role}</div>
                </div>
              </a>
            </td>
            <td class="py-4 px-3 text-center num font-semibold \${row.ce > 0 ? 'text-[#10b981]' : 'text-faint'}">
              \${row.ce > 0 ? row.ce : '—'}
            </td>
            <td class="py-4 px-3 text-center num font-semibold \${row.cse > 0 ? 'text-[#38bdf8]' : 'text-faint'}">
              \${row.cse > 0 ? row.cse : '—'}
            </td>
            <td class="py-4 px-3 text-center num font-semibold \${row.extc > 0 ? 'text-[#f43f5e]' : 'text-faint'}">
              \${row.extc > 0 ? row.extc : '—'}
            </td>
            <td class="py-4 px-3 text-center num text-muted">
              \${row.unknown > 0 ? row.unknown : '—'}
            </td>
            <td class="py-4 px-3 text-center num font-display text-[15px] font-bold text-fg">
              \${row.total}
            </td>
            <td class="py-4 px-4">
              <div class="h-2 w-full rounded-full overflow-hidden flex bg-line shadow-inner">
                \${row.ce > 0 ? \`<div style="width:\${cePct}%; background-color:#10b981;" title="CE: \${row.ce} (\${cePct}%)"></div>\` : ''}
                \${row.cse > 0 ? \`<div style="width:\${csePct}%; background-color:#38bdf8;" title="CSE: \${row.cse} (\${csePct}%)"></div>\` : ''}
                \${row.extc > 0 ? \`<div style="width:\${extcPct}%; background-color:#f43f5e;" title="EXTC: \${row.extc} (\${extcPct}%)"></div>\` : ''}
                \${row.unknown > 0 ? \`<div style="width:\${unkPct}%; background-color:#71717a;" title="Unknown: \${row.unknown} (\${unkPct}%)"></div>\` : ''}
              </div>
            </td>
            <td class="py-4 pl-4 pr-6 text-[12px] text-muted leading-snug">
              \${row.notes ? \`<span class="bg-panel border border-line px-2 py-0.5 rounded text-faint">\${row.notes}</span>\` : '<span class="text-faint">—</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    renderTable();

    // Event listeners for pills
    document.querySelectorAll('.branch-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const b = pill.getAttribute('data-branch');
        syncBranchSelection(b);
      });
    });

    // Event listeners for cards
    document.querySelectorAll('.card-branch').forEach(card => {
      card.addEventListener('click', () => {
        const b = card.getAttribute('data-branch');
        const target = (selectedBranchFilter === b) ? 'all' : b;
        syncBranchSelection(target);
        document.getElementById('company-branch-tbody')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Chart mode toggle
    const btnChartAll = document.getElementById('btn-chart-all');
    const btnChartKnown = document.getElementById('btn-chart-known');
    const barColUnknown = document.getElementById('bar-col-unknown');
    const labelColUnknown = document.getElementById('label-col-unknown');

    function setChartMode(mode) {
      const isKnown = mode === 'known';
      if (btnChartAll && btnChartKnown) {
        if (isKnown) {
          btnChartKnown.className = 'chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all bg-panel text-fg shadow-sm border border-line-strong';
          btnChartAll.className = 'chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all text-muted hover:text-fg';
        } else {
          btnChartAll.className = 'chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all bg-panel text-fg shadow-sm border border-line-strong';
          btnChartKnown.className = 'chart-mode-btn cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all text-muted hover:text-fg';
        }
      }

      // Update Y-Axis labels
      const yLabels = document.querySelectorAll('.y-axis-label');
      if (yLabels.length === 5) {
        if (isKnown) {
          yLabels[0].textContent = '70';
          yLabels[1].textContent = '50';
          yLabels[2].textContent = '35';
          yLabels[3].textContent = '15';
          yLabels[4].textContent = '0';
        } else {
          yLabels[0].textContent = '120';
          yLabels[1].textContent = '90';
          yLabels[2].textContent = '60';
          yLabels[3].textContent = '30';
          yLabels[4].textContent = '0';
        }
      }

      // Update percentage badges
      const ceBadge = document.querySelector('.ce-pct-badge');
      const cseBadge = document.querySelector('.cse-pct-badge');
      const extcBadge = document.querySelector('.extc-pct-badge');
      if (ceBadge) ceBadge.textContent = isKnown ? '48.8% of known' : '25.8%';
      if (cseBadge) cseBadge.textContent = isKnown ? '35.2% of known' : '18.6%';
      if (extcBadge) extcBadge.textContent = isKnown ? '16.0% of known' : '8.5%';

      // Update bar heights
      document.querySelectorAll('.bar-fill').forEach(bar => {
        const targetHeight = isKnown ? bar.getAttribute('data-height-known') : bar.getAttribute('data-height-all');
        bar.style.height = targetHeight;
      });

      // Toggle unknown column visibility
      if (barColUnknown && labelColUnknown) {
        if (isKnown) {
          barColUnknown.style.opacity = '0';
          barColUnknown.style.pointerEvents = 'none';
          labelColUnknown.style.opacity = '0';
          labelColUnknown.style.pointerEvents = 'none';
        } else {
          barColUnknown.style.opacity = '1';
          barColUnknown.style.pointerEvents = 'auto';
          labelColUnknown.style.opacity = '1';
          labelColUnknown.style.pointerEvents = 'auto';
        }
      }
    }

    btnChartAll?.addEventListener('click', () => setChartMode('all'));
    btnChartKnown?.addEventListener('click', () => setChartMode('known'));

    // Event listeners for bar graph columns & x-axis labels
    document.querySelectorAll('.branch-bar-col, .branch-x-label').forEach(el => {
      el.addEventListener('click', () => {
        const b = el.getAttribute('data-branch');
        if (!b) return;
        const target = (selectedBranchFilter === b) ? 'all' : b;
        syncBranchSelection(target);
        document.getElementById('company-branch-tbody')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Clear indicator
    document.getElementById('branch-filter-clear')?.addEventListener('click', () => {
      syncBranchSelection('all');
    });

    // Search input
    searchInput?.addEventListener('input', (e) => {
      renderTable(e.target.value);
    });

    // Modal logic
    const modal = document.getElementById('branch-submit-modal');
    const openBtn = document.getElementById('btn-open-branch-submit');
    const closeBtn = document.getElementById('btn-close-branch-submit');
    const cancelBtn = document.getElementById('btn-cancel-branch-submit');
    const form = document.getElementById('branch-submit-form');
    const statusEl = document.getElementById('branch-submit-status');
    const submitBtn = document.getElementById('btn-submit-branch-data');
    const spinner = document.getElementById('spinner-branch-submit');
    const btnText = document.getElementById('btn-submit-text');

    openBtn?.addEventListener('click', () => modal?.classList.remove('hidden'));
    [closeBtn, cancelBtn].forEach(b => b?.addEventListener('click', () => modal?.classList.add('hidden')));

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      submitBtn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting...';
      if (statusEl) statusEl.className = 'hidden';

      const payload = {
        type: 'branch_data',
        batch_year: document.getElementById('modal-batch-year')?.value || '2027',
        branch: document.getElementById('modal-branch')?.value || '',
        company_name: document.getElementById('modal-company-name')?.value || '',
        role_title: document.getElementById('modal-role-title')?.value || '',
        offers_count: parseInt(document.getElementById('modal-offers-count')?.value, 10) || 1,
        compensation: document.getElementById('modal-compensation')?.value || '',
        details: document.getElementById('modal-details')?.value || '',
        submitter_name: document.getElementById('modal-submitter-name')?.value || 'Anonymous',
        submitter_contact: document.getElementById('modal-submitter-contact')?.value || '',
        status: 'pending'
      };

      try {
        const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/submissions\`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify([payload])
        });

        if (!res.ok) throw new Error(await res.text() || 'Failed to submit branch data');

        if (statusEl) {
          statusEl.textContent = '✓ Thank you! Your branch placement data has been sent to the admin dashboard for verification.';
          statusEl.className = 'rounded-xl p-3 text-[13px] bg-intern/20 text-intern border border-intern/40 block';
        }
        form.reset();
        setTimeout(() => {
          modal?.classList.add('hidden');
          if (statusEl) statusEl.className = 'hidden';
        }, 2200);
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = 'Error: ' + err.message;
          statusEl.className = 'rounded-xl p-3 text-[13px] bg-red-500/20 text-red-400 border border-red-500/40 block';
        }
      } finally {
        submitBtn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Submit Data';
      }
    });
  `;

  const html = pageTemplate({
    title: `Branchwise · Placed · ${siteConfig.collegeShort}`,
    activePath: '/branchwise/',
    content,
    extraScript
  });

  const branchwiseDir = path.join(__dirname, '..', 'branchwise');
  if (!fs.existsSync(branchwiseDir)) fs.mkdirSync(branchwiseDir, { recursive: true });
  fs.writeFileSync(path.join(branchwiseDir, 'index.html'), html);

  // Backwards compatibility redirect stub for /branches/
  const branchesDir = path.join(__dirname, '..', 'branches');
  if (!fs.existsSync(branchesDir)) fs.mkdirSync(branchesDir, { recursive: true });
  const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to Branchwise...</title>
  <meta http-equiv="refresh" content="0; url=/branchwise/">
  <link rel="canonical" href="/branchwise/">
  <script>
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    window.location.replace('/branchwise/' + search + hash);
  </script>
</head>
<body style="background:#000;color:#888;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p>Redirecting to <a href="/branchwise/" style="color:#ededed;">Branchwise Placement Distribution</a>...</p>
</body>
</html>
`;
  fs.writeFileSync(path.join(branchesDir, 'index.html'), redirectHtml);
  console.log('branchwise/index.html created and branches/index.html redirect stub generated successfully!');
}

generateBranchesPage();
module.exports = { generateBranchesPage };
