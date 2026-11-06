const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateRecapPage() {
  const content = `
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <p id="recap-page-badge" class="label text-muted">Recap · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
      <h1 class="display-xl mt-6">
        The season,<br/><span class="text-muted">replayed.</span>
      </h1>
      <p id="recap-page-desc" class="mt-8 max-w-[58ch] text-[18px] leading-relaxed text-muted">
        Every milestone as an interactive story you can play. From flagship recruiters to high-scale engineering roles.
      </p>
    </section>

    <div class="wrap">
      <!-- Glow Ring Featured Story Card -->
      <section class="glow-ring rounded-[28px] p-px">
        <div class="relative overflow-hidden rounded-[27px] bg-bg p-6 sm:p-10">
          <div class="grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end gap-8">
            <div>
              <p id="recap-hero-season" class="label text-muted">Recap · Flagship Recruiters · Season 2027</p>
              <h2 class="display-l mt-4 max-w-[14ch]">The marquee highlights</h2>
            </div>
            <button type="button" class="play-recap-trigger group/play relative inline-flex h-14 items-center gap-4 rounded-full bg-fg pl-2 pr-6 text-bg transition-transform duration-500 ease-[var(--ease)] hover:scale-[1.03] cursor-pointer">
              <span class="relative grid size-10 place-items-center rounded-full bg-bg text-fg">
                <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border border-fg/60"></span>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" class="translate-x-px">
                  <path d="M3 1.5v11l9-5.5-9-5.5Z" fill="currentColor"></path>
                </svg>
              </span>
              <span class="text-left">
                <span class="block font-display text-[17px] leading-tight tracking-[-0.01em]">Play the recap</span>
                <span class="label block text-[10px] text-bg/60">5 slides · 25 sec</span>
              </span>
            </button>
          </div>

          <!-- Headline Stats for the Season -->
          <dl id="recap-stats-grid" class="grid grid-cols-2 border-t border-line sm:grid-cols-4 mt-10">
            <!-- Rendered dynamically -->
          </dl>

          <!-- Company Row Teasers -->
          <div id="recap-company-teasers" class="mt-8 grid gap-3 border-t border-line pt-8">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>

      <!-- Monthly Recap Stories Section -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">Archive</p>
          <h2 class="display-m mt-3">Monthly Highlights</h2>
          <p class="mt-2 text-[15px] text-muted">Replay recruitment highlights across the season timeline.</p>
        </div>

        <div id="recap-monthly-cards" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Rendered dynamically -->
        </div>
      </section>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';

    // Badge & Desc
    const badgeEl = document.getElementById('recap-page-badge');
    if (badgeEl) badgeEl.textContent = \`Recap · SPIT Class of \${batch.year}\`;

    const descEl = document.getElementById('recap-page-desc');
    if (descEl) {
      descEl.textContent = \`Every milestone as an interactive story you can play. From Day-1 flagship recruiters for the \${batch.year} cohort to high-scale engineering and intern selections.\`;
    }

    const heroSeason = document.getElementById('recap-hero-season');
    if (heroSeason) {
      heroSeason.textContent = \`Recap · Flagship Recruiters · Season \${batch.year}\`;
    }

    // Headline Stats
    const statsGrid = document.getElementById('recap-stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = \`
        <div class="flex flex-col py-5 pr-4 border-r border-line">
          <dt class="order-2 mt-1.5 text-[13px] text-muted">Visiting Companies</dt>
          <dd class="num order-1 font-display text-[32px] text-fg">\${batch.companies ? batch.companies.length : batch.stats.totalCompanies}</dd>
        </div>
        <div class="flex flex-col py-5 px-4 sm:border-r border-line">
          <dt class="order-2 mt-1.5 text-[13px] text-muted">Confirmed Selections</dt>
          <dd class="num order-1 font-display text-[32px] text-fg">\${batch.stats.studentsPlaced}</dd>
        </div>
        <div class="flex flex-col py-5 pr-4 border-r border-line max-sm:border-t">
          <dt class="order-2 mt-1.5 text-[13px] text-muted">Highest CTC</dt>
          <dd class="num order-1 font-display text-[32px] text-fg">\${batch.stats.highestCTC}</dd>
        </div>
        <div class="flex flex-col py-5 pl-4 max-sm:border-t">
          <dt class="order-2 mt-1.5 text-[13px] text-muted">Top Stipend</dt>
          <dd class="num order-1 font-display text-[26px] text-fg truncate">\${batch.stats.highestStipend}</dd>
        </div>
      \`;
    }

    // Company Teasers
    const teasers = document.getElementById('recap-company-teasers');
    if (teasers) {
      if (is2028) {
        teasers.innerHTML = \`
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Barclays</h4>
                <p class="text-[12px] text-muted">25 selections (16 Interns @ ₹75k/mo + 9 Devs @ ₹15.05 LPA)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time + Intern</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/mastercard.svg" alt="Mastercard" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Mastercard</h4>
                <p class="text-[12px] text-muted">9 software engineering intern offers (₹50k/mo, 13–15 LPA PPO)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO Opportunity</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/general-mills.png" alt="General Mills" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">General Mills</h4>
                <p class="text-[12px] text-muted">6 technology intern selections (₹45,000 / month)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Internship</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/russell-investments.svg" alt="Russell Investments" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Russell Investments & IBM</h4>
                <p class="text-[12px] text-muted">10 total offers across cloud infrastructure & quant tech</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>Tech & Quant</span>
          </div>
        \`;
      } else {
        teasers.innerHTML = \`
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/phonepe.png" alt="PhonePe" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">PhonePe</h4>
                <p class="text-[12px] text-muted">6 SDE selections · ₹33.0 LPA (₹80k/mo stipend)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/jpmc.svg" alt="JPMC" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">JPMorgan Chase &amp; Co.</h4>
                <p class="text-[12px] text-muted">31 selections across 5 divisions · up to ₹1.60L/mo stipend</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO / Intern</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Barclays</h4>
                <p class="text-[12px] text-muted">28 total offers (12 Dev @ ₹15.05L + 16 Interns @ ₹75k/mo)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/iss-stoxx.svg" alt="ISS / STOXX" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">ISS / STOXX</h4>
                <p class="text-[12px] text-muted">15 SDE selections · ₹14.7 LPA (₹60k/mo stipend)</p>
              </div>
            </div>
            <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern + FT</span>
          </div>
        \`;
      }
    }

    // Monthly Highlights Cards
    const monthlyCards = document.getElementById('recap-monthly-cards');
    if (monthlyCards) {
      if (is2028) {
        monthlyCards.innerHTML = \`
          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Oct 2026 · 4 drives (Peak)</span>
              <h3 class="display-m text-[24px] mt-2">Fintech &amp; Banking Wave</h3>
              <p class="mt-3 text-[14px] text-muted">Barclays (25 selections) and Mastercard (9 selections) rolled out comprehensive summer &amp; graduate offers.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>

          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Nov 2026 · 1 drive</span>
              <h3 class="display-m text-[24px] mt-2">Quantitative Systems</h3>
              <p class="mt-3 text-[14px] text-muted">Russell Investments completed on-campus evaluation for 5 quantitative technology roles.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>

          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Oct 2026 · 2 drives</span>
              <h3 class="display-m text-[24px] mt-2">Enterprise Software</h3>
              <p class="mt-3 text-[14px] text-muted">General Mills (6 offers) and IBM (5 offers) conducted summer intern selection rounds.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>
        \`;
      } else {
        monthlyCards.innerHTML = \`
          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Oct 2026 · 8 drives</span>
              <h3 class="display-m text-[24px] mt-2">Fintech &amp; Consulting Wave</h3>
              <p class="mt-3 text-[14px] text-muted">Nouryon, GEP Worldwide, Capgemini, AspectRatio, Baker Hughes, and Barclays Graduate Developers confirmed selections.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>

          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Sep 2026 · 5 drives</span>
              <h3 class="display-m text-[24px] mt-2">Capital Markets &amp; AI</h3>
              <p class="mt-3 text-[14px] text-muted">Colgate-Palmolive, JPMC CADP, InSync Analytics, Pfizer, and UBS Agentic AI completed recruitment rounds.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>

          <div class="rounded-2xl border border-line-strong bg-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span class="label text-faint">Jul 2026 · 11 drives (Peak)</span>
              <h3 class="display-m text-[24px] mt-2">Opening Surge</h3>
              <p class="mt-3 text-[14px] text-muted">The busiest recruitment month of the season featuring PhonePe (₹33 LPA), JPMC CIB, AuxoAI, UBS, Nomura, and ISS / STOXX.</p>
            </div>
            <button type="button" class="play-recap-trigger mt-6 label inline-flex items-center gap-2 text-fg hover:underline cursor-pointer">
              <span>▶ Play recap</span>
            </button>
          </div>
        \`;
      }
    }
  `;

  const html = pageTemplate({
    title: `Recap · Placed · ${siteConfig.collegeShort}`,
    activePath: '/recap/',
    content,
    extraScript
  });

  fs.writeFileSync('recap/index.html', html);
  console.log('recap/index.html created successfully with Multi-Batch support!');
}

generateRecapPage();
