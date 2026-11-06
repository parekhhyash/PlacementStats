const fs = require('fs');
const { pageTemplate } = require('./template');

function generateEligibilityPage() {
  const content = `
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <p class="label text-muted">Eligibility · Who could apply</p>
      <h1 class="display-l mt-6 max-w-[16ch]">The bar to apply.</h1>
    </section>

    <div class="wrap">
      <!-- 4-Column Headline Metrics -->
      <dl class="grid grid-cols-2 border-t border-line sm:grid-cols-4">
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0">
          <dt class="order-2 mt-2 text-muted text-[13px]">Most Common CGPA</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">6.74</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">37 of 102 drives</dd>
        </div>
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Median CGPA Cut-off</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">6.85</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">Across all visiting firms</dd>
        </div>
        <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-b-0 sm:border-r sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Open to All Branches</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">70%</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">74 of 105 drives</dd>
        </div>
        <div class="flex flex-col py-5 pr-4 sm:px-5">
          <dt class="order-2 mt-2 text-muted text-[13px]">Diversity Drives</dt>
          <dd class="num order-1 font-display text-[clamp(28px,3vw,44px)] leading-none text-fg">1</dd>
          <dd class="label order-3 mt-1 text-[11px] text-faint">Women-only drive</dd>
        </div>
      </dl>

      <!-- Section 01: CGPA Cut-offs Histogram -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">01 — CGPA</p>
          <h2 class="display-m mt-3">CGPA cut-offs</h2>
        </div>

        <div class="mt-8 rounded-2xl border border-line-strong bg-panel p-6 sm:p-10">
          <p class="label text-faint mb-8">Drive distribution across CGPA requirements (102 drives)</p>
          <div id="cgpa-histogram" class="grid items-end gap-3 sm:gap-6" style="grid-template-columns: repeat(7, minmax(0, 1fr))">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>

      <!-- Section 02: 10th and 12th Marks -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">02 — Schooling</p>
          <h2 class="display-m mt-3">10th and 12th marks</h2>
        </div>

        <div id="school-criteria-grid" class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Rendered dynamically -->
        </div>
      </section>

      <!-- Section 03: Highest CGPA Recruiters -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">03 — Strictest Bar</p>
          <h2 class="display-m mt-3">Highest CGPA cut-offs</h2>
        </div>

        <div id="highest-cutoffs-list" class="mt-8 divide-y divide-line">
          <!-- Rendered dynamically -->
        </div>
      </section>

      <!-- Section 04: Backlog Rules -->
      <section class="mt-20">
        <div class="border-t border-line pt-6">
          <p class="label text-faint">04 — Backlogs</p>
          <h2 class="display-m mt-3">Backlog rules</h2>
        </div>

        <div id="backlog-rules-grid" class="mt-8 grid gap-4 sm:grid-cols-3">
          <!-- Rendered dynamically -->
        </div>
      </section>
    </div>
  `;

  const extraScript = `
    import { eligibilityData } from '/src/data/eligibility.js';

    // Render CGPA Histogram
    const histoEl = document.getElementById('cgpa-histogram');
    const maxCount = Math.max(...eligibilityData.cgpaDistribution.map(d => d.count), 1);

    histoEl.innerHTML = eligibilityData.cgpaDistribution.map(d => {
      const heightPx = Math.max(Math.round((d.count / maxCount) * 160), 4);
      return \`
        <div class="flex flex-col items-stretch gap-2">
          <span class="num text-center text-[13px] text-fg">\${d.count}</span>
          <span class="block rounded-t-[3px] transition-all duration-500 bg-fg" style="height:\${heightPx}px"></span>
          <span class="label text-center text-[10px] sm:text-[11px] text-muted">\${d.label}</span>
        </div>
      \`;
    }).join('');

    // Render School criteria
    const schoolEl = document.getElementById('school-criteria-grid');
    schoolEl.innerHTML = eligibilityData.schoolMarksCriteria.map(s => \`
      <div class="rounded-2xl border border-line bg-panel p-5 flex flex-col justify-between">
        <div>
          <span class="label text-faint">Criteria</span>
          <h4 class="font-display text-[18px] font-medium text-fg mt-1">\${s.criteria}</h4>
        </div>
        <div class="mt-6 flex items-baseline justify-between border-t border-line pt-3">
          <span class="num text-[24px] font-bold text-fg">\${s.drives}</span>
          <span class="label text-[12px] text-muted">\${s.percentage}</span>
        </div>
      </div>
    \`).join('');

    // Render highest cut-offs
    const cutoffsEl = document.getElementById('highest-cutoffs-list');
    cutoffsEl.innerHTML = eligibilityData.highestCutoffs.map(c => \`
      <div class="py-4 flex items-center justify-between gap-4">
        <div>
          <h4 class="font-display text-[18px] font-semibold text-fg">\${c.company}</h4>
          <p class="text-[13px] text-muted">Eligible: \${c.branches} · \${c.offers}</p>
        </div>
        <div class="text-right">
          <span class="num font-display text-[22px] font-bold text-fg">\${c.cgpa} CGPA</span>
        </div>
      </div>
    \`).join('');

    // Render backlog rules
    const backlogEl = document.getElementById('backlog-rules-grid');
    backlogEl.innerHTML = eligibilityData.backlogRules.map(b => \`
      <div class="rounded-2xl border border-line bg-panel p-5">
        <span class="label text-faint">Policy</span>
        <h4 class="font-display text-[17px] font-medium text-fg mt-1">\${b.rule}</h4>
        <div class="mt-6 flex items-baseline justify-between border-t border-line pt-3">
          <span class="num text-[24px] font-bold text-fg">\${b.count} drives</span>
          <span class="label text-[12px] text-muted">\${b.percentage}</span>
        </div>
      </div>
    \`).join('');
  `;

  const html = pageTemplate({
    title: "Eligibility · Placed ’27",
    activePath: '/eligibility/',
    content,
    extraScript
  });

  fs.writeFileSync('eligibility/index.html', html);
  console.log('eligibility/index.html created successfully!');
}

generateEligibilityPage();
