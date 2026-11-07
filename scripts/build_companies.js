const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');
const { companies: companies2027 } = require('../src/data/companies');

function getBuildTimeStats(compList) {
  let totalOffers = 0;
  compList.forEach(c => {
    if (c.noDetailsAvailable) return;
    if (c.out && typeof c.out.students === 'number' && c.out.students > 0) {
      totalOffers += c.out.students;
    } else if (c.roles && Array.isArray(c.roles) && c.roles.length > 0) {
      totalOffers += c.roles.reduce((acc, r) => acc + (r.count || 0), 0);
    } else if (c.out && (typeof c.out.fulltimeOffers === 'number' || typeof c.out.internships === 'number')) {
      totalOffers += Math.max(c.out.fulltimeOffers || 0, c.out.internships || 0);
    }
  });

  const internCount = compList.filter(c => !c.isAmbiguous && c.offers && c.offers.includes('internship')).length;
  const ppoCount = compList.filter(c => !c.isAmbiguous && c.offers && c.offers.includes('ppo')).length;
  const ftCount = compList.filter(c => !c.isAmbiguous && c.offers && c.offers.includes('fulltime')).length;
  const bothCount = compList.filter(c => !c.isAmbiguous && c.offers && c.offers.includes('internship') && c.offers.includes('fulltime')).length;
  const placedDrivesCount = compList.filter(c => !c.isAmbiguous && c.out && (c.out.students > 0 || c.out.fulltimeOffers > 0 || c.out.internships > 0)).length;

  return { totalOffers, internCount, ppoCount, ftCount, bothCount, placedDrivesCount };
}

function generateCompaniesPage() {
  const stats = getBuildTimeStats(companies2027);

  const content = `
    <div vt-update="none">
      <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
        <p id="companies-page-badge" class="label text-muted">Companies · SPIT Class of 2027</p>
        <h1 class="display-l mt-4 max-w-[16ch]">Every company, every offer.</h1>
      </section>

      <div class="wrap">
        <dl class="grid grid-cols-2 border-t border-line" style="--cols:5">
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Total offers</dt>
            <dd id="stat-total-offers" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">${stats.totalOffers}</dd>
            <dd id="stat-total-offers-sub" class="label order-3 mt-1 text-[11px] text-faint">Across all selections</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Offered internships</dt>
            <dd id="stat-internships" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">${stats.internCount}</dd>
            <dd id="stat-internships-sub" class="label order-3 mt-1 text-[11px] text-faint">${stats.ppoCount} with a PPO path</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Hired full-time</dt>
            <dd id="stat-fulltime" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">${stats.ftCount}</dd>
            <dd id="stat-fulltime-sub" class="label order-3 mt-1 text-[11px] text-faint">${stats.bothCount} offered both</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Average CTC</dt>
            <dd id="stat-avg-ctc" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">₹14.06<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span></dd>
            <dd id="stat-avg-ctc-sub" class="label order-3 mt-1 text-[11px] text-faint">${stats.placedDrivesCount} drives with selections</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Median CTC</dt>
            <dd id="stat-med-ctc" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">₹13<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span></dd>
            <dd id="stat-med-ctc-sub" class="label order-3 mt-1 text-[11px] text-faint">Range ₹8.23–33.0 LPA</dd>
          </div>
          <style>@media (min-width:1024px){dl[style*="--cols"]{grid-template-columns:repeat(var(--cols),minmax(0,1fr))}}</style>
        </dl>
      </div>

      <div class="wrap mt-12">
        <div>
          <div class="-mx-[var(--gutter)] border-b border-line bg-bg px-[var(--gutter)] pb-4 pt-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label class="flex h-10 w-full min-w-0 shrink-0 items-center gap-3 rounded-full border lg:w-auto lg:flex-1 border-line-strong px-4 transition-colors focus-within:border-fg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-muted" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-3.5-3.5"></path>
                </svg>
                <input id="company-search" type="search" placeholder="Search companies" aria-label="Search companies" class="min-w-0 flex-1 bg-transparent text-[14px] placeholder:text-faint border-0 outline-none focus:outline-none focus:ring-0 focus:border-0" style="outline: none !important; box-shadow: none !important; border: none !important; -webkit-appearance: none; appearance: none;" value="" />
              </label>

              <div class="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Role</span>
                    <span class="font-medium" id="role-val">All</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="role-filter" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                    <option value="all" class="bg-[#121316] text-[#ededed]">All</option>
                    <option value="internship" class="bg-[#121316] text-[#ededed]">Intern</option>
                    <option value="fulltime" class="bg-[#121316] text-[#ededed]">Full-time</option>
                    <option value="ppo" class="bg-[#121316] text-[#ededed]">PPO</option>
                  </select>
                </div>

                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Branch</span>
                    <span class="font-medium" id="branch-val">Any</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="branch-filter" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                    <option value="all" class="bg-[#121316] text-[#ededed]">Any</option>
                    <option value="cse" class="bg-[#121316] text-[#ededed]">CSE</option>
                    <option value="it" class="bg-[#121316] text-[#ededed]">IT</option>
                    <option value="extc" class="bg-[#121316] text-[#ededed]">EXTC</option>
                    <option value="aids" class="bg-[#121316] text-[#ededed]">AI &amp; DS</option>
                  </select>
                </div>

                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Sort</span>
                    <span class="font-medium" id="sort-val">Latest</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="sort-order" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                    <option value="latest" class="bg-[#121316] text-[#ededed]">Latest</option>
                    <option value="placed" class="bg-[#121316] text-[#ededed]">Selections</option>
                    <option value="pay" class="bg-[#121316] text-[#ededed]">Highest CTC</option>
                    <option value="name" class="bg-[#121316] text-[#ededed]">Name</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mt-3 flex min-h-7 flex-wrap items-center gap-2 text-[13px]">
              <span class="text-muted" id="results-count">Loading companies...</span>
            </div>
          </div>

          <div class="label hidden grid-cols-[3.5rem_minmax(0,1fr)_9rem_12rem_9rem_11rem] gap-4 border-b border-line py-3 text-faint lg:grid">
            <span>No.</span>
            <span>Company</span>
            <span>Offered</span>
            <span>Advertised pay</span>
            <span>Offers made</span>
            <span>Branches</span>
          </div>

          <ol id="companies-list">
            <!-- Dynamic rows will render here -->
          </ol>

          <div id="no-results" class="hidden py-16 text-center text-muted">
            No companies found matching your query.
          </div>

          <!-- Submit Company Data Modal for Companies Directory -->
          <div id="quick-submit-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden">
            <div class="relative w-full max-w-[560px] rounded-3xl border border-line-strong bg-panel p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <span class="label text-intern font-mono">Contribute Verified Data</span>
                  <h3 id="quick-modal-title" class="font-display text-[22px] font-semibold text-fg mt-1">Submit Placement Data</h3>
                </div>
                <button id="quick-modal-close-btn" type="button" class="cursor-pointer rounded-full p-2 text-muted hover:text-fg hover:bg-line transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <form id="quick-submit-form" class="mt-6 space-y-4">
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Company Name</label>
                  <input id="quick-comp-name" type="text" readonly class="w-full rounded-xl border border-line-strong bg-bg/50 px-3.5 py-2.5 text-[14px] text-fg font-medium outline-none" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Batch</label>
                    <select id="quick-comp-batch" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                      <option value="2027" class="bg-[#121316] text-[#ededed]">Class of 2027</option>
                      <option value="2028" class="bg-[#121316] text-[#ededed]">Class of 2028</option>
                    </select>
                  </div>
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Branch</label>
                    <select id="quick-comp-branch" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                      <option value="All branches" class="bg-[#121316] text-[#ededed]">All Branches Open</option>
                      <option value="CSE" class="bg-[#121316] text-[#ededed]">CSE</option>
                      <option value="IT" class="bg-[#121316] text-[#ededed]">IT</option>
                      <option value="AI & DS" class="bg-[#121316] text-[#ededed]">AI &amp; DS</option>
                      <option value="EXTC" class="bg-[#121316] text-[#ededed]">EXTC</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Role Title</label>
                    <input id="quick-comp-role" type="text" placeholder="e.g. SDE, Associate Analyst" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Package / Compensation</label>
                    <input id="quick-comp-pay" type="text" placeholder="e.g. ₹15 LPA or ₹50,000 / mo" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Offers Made / Placed Count</label>
                    <input id="quick-comp-offers" type="number" min="1" placeholder="e.g. 5" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Eligibility / CGPA Cutoff</label>
                    <input id="quick-comp-cgpa" type="text" placeholder="e.g. 8.0+ CGPA, no active backlogs" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                </div>

                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Additional Details / Drive Rounds / Dates</label>
                  <textarea id="quick-comp-details" rows="3" placeholder="Provide any details about rounds, assessment dates, interview stages, or verification references..." class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Your Name (Optional)</label>
                    <input id="quick-comp-name-sub" type="text" placeholder="Anonymous or Name" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                  <div>
                    <label class="label block text-[11px] text-faint mb-1.5">Contact (Optional)</label>
                    <input id="quick-comp-contact" type="text" placeholder="Email / Phone for verification" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                  </div>
                </div>

                <div id="quick-comp-status" class="hidden"></div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                  <button id="quick-modal-cancel-btn" type="button" class="cursor-pointer rounded-full px-5 py-2.5 font-mono text-[13px] text-muted hover:text-fg transition-colors">
                    Cancel
                  </button>
                  <button id="quick-modal-submit-btn" type="submit" class="cursor-pointer inline-flex items-center gap-2 rounded-full bg-intern px-6 py-2.5 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90">
                    <span id="quick-modal-btn-text">Submit Data</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey, setBatch } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const companies = batch.companies || [];

    // Header badge
    const badgeEl = document.getElementById('companies-page-badge');
    if (badgeEl) {
      badgeEl.textContent = \`Companies · SPIT Class of \${batch.year}\`;
    }

    function calculateOffers(compList) {
      let total = 0;
      compList.forEach(c => {
        if (c.noDetailsAvailable) return;
        if (c.out && typeof c.out.students === 'number' && c.out.students > 0) {
          total += c.out.students;
        } else if (c.roles && Array.isArray(c.roles) && c.roles.length > 0) {
          total += c.roles.reduce((acc, r) => acc + (r.count || 0), 0);
        } else if (c.out && (typeof c.out.fulltimeOffers === 'number' || typeof c.out.internships === 'number')) {
          total += Math.max(c.out.fulltimeOffers || 0, c.out.internships || 0);
        }
      });
      return total;
    }

    // Populate Top KPI Summary Stats
    const statTotalOffers = document.getElementById('stat-total-offers');
    const statTotalOffersSub = document.getElementById('stat-total-offers-sub');
    const statInternships = document.getElementById('stat-internships');
    const statInternshipsSub = document.getElementById('stat-internships-sub');
    const statFulltime = document.getElementById('stat-fulltime');
    const statFulltimeSub = document.getElementById('stat-fulltime-sub');
    const statAvgCtc = document.getElementById('stat-avg-ctc');
    const statAvgCtcSub = document.getElementById('stat-avg-ctc-sub');
    const statMedCtc = document.getElementById('stat-med-ctc');
    const statMedCtcSub = document.getElementById('stat-med-ctc-sub');

    function updateStatStrip() {
      const totalOffers = calculateOffers(companies);

      if (is2028) {
        if (statTotalOffers) statTotalOffers.textContent = totalOffers || '50';
        if (statTotalOffersSub) statTotalOffersSub.textContent = 'Summer internship phase';
        if (statInternships) statInternships.textContent = '5';
        if (statInternshipsSub) statInternshipsSub.textContent = 'All 5 summer intern drives';
        if (statFulltime) statFulltime.textContent = '0';
        if (statFulltimeSub) statFulltimeSub.textContent = 'Summer internship phase';
        if (statAvgCtc) statAvgCtc.innerHTML = '₹54k<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">/mo</span>';
        if (statAvgCtcSub) statAvgCtcSub.textContent = 'Average monthly stipend';
        if (statMedCtc) statMedCtc.innerHTML = '₹50k<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">/mo</span>';
        if (statMedCtcSub) statMedCtcSub.textContent = 'Median monthly stipend';
      } else {
        const internCount = companies.filter(c => c.offers && c.offers.includes('internship')).length;
        const ppoCount = companies.filter(c => c.offers && c.offers.includes('ppo')).length;
        const ftCount = companies.filter(c => c.offers && c.offers.includes('fulltime')).length;
        const bothCount = companies.filter(c => c.offers && c.offers.includes('internship') && c.offers.includes('fulltime')).length;
        const placedDrivesCount = companies.filter(c => c.out && (c.out.students > 0 || c.out.fulltimeOffers > 0 || c.out.internships > 0)).length;

        if (statTotalOffers) statTotalOffers.textContent = totalOffers;
        if (statTotalOffersSub) statTotalOffersSub.textContent = 'Across all selections';
        if (statInternships) statInternships.textContent = internCount || '34';
        if (statInternshipsSub) statInternshipsSub.textContent = \`\${ppoCount || 21} with a PPO path\`;
        if (statFulltime) statFulltime.textContent = ftCount || '32';
        if (statFulltimeSub) statFulltimeSub.textContent = \`\${bothCount || 29} offered both\`;
        if (statAvgCtc) statAvgCtc.innerHTML = '₹14.06<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
        if (statAvgCtcSub) statAvgCtcSub.textContent = \`\${placedDrivesCount} drives with selections\`;
        if (statMedCtc) statMedCtc.innerHTML = '₹13<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
        if (statMedCtcSub) statMedCtcSub.textContent = 'Range ₹8.23–33.0 LPA';
      }
    }

    updateStatStrip();

    const listEl = document.getElementById('companies-list');
    const searchInput = document.getElementById('company-search');
    const roleSelect = document.getElementById('role-filter');
    const branchSelect = document.getElementById('branch-filter');
    const sortSelect = document.getElementById('sort-order');
    const countEl = document.getElementById('results-count');
    const noResultsEl = document.getElementById('no-results');

    const roleVal = document.getElementById('role-val');
    const branchVal = document.getElementById('branch-val');
    const sortVal = document.getElementById('sort-val');

    function renderCompanies() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const role = roleSelect?.value || 'all';
      const branch = branchSelect?.value || 'all';
      const sort = sortSelect?.value || 'latest';

      if (roleVal && roleSelect) roleVal.textContent = roleSelect.options[roleSelect.selectedIndex].text;
      if (branchVal && branchSelect) branchVal.textContent = branchSelect.options[branchSelect.selectedIndex].text;
      if (sortVal && sortSelect) sortVal.textContent = sortSelect.options[sortSelect.selectedIndex].text;

      let filtered = companies.filter(c => {
        // Query match
        if (q) {
          const matchName = c.name && c.name.toLowerCase().includes(q);
          const matchSubtext = c.subtext && c.subtext.toLowerCase().includes(q);
          const matchRoles = c.roles && c.roles.some(r => (r.title && r.title.toLowerCase().includes(q)) || (r.notes && r.notes.toLowerCase().includes(q)));
          const matchPay = c.pay && c.pay.toLowerCase().includes(q);
          const matchBranch = c.branches && c.branches.toLowerCase().includes(q);
          const matchCgpa = c.cgpaCriteria && c.cgpaCriteria.toLowerCase().includes(q);
          const matchBoards = c.boardsCriteria && c.boardsCriteria.toLowerCase().includes(q);
          if (!matchName && !matchSubtext && !matchRoles && !matchPay && !matchBranch && !matchCgpa && !matchBoards) return false;
        }

        // Role filter
        if (role !== 'all') {
          if (!c.offers || !c.offers.includes(role)) return false;
        }

        // Branch filter
        if (branch !== 'all') {
          const bText = (c.branches || '').toLowerCase();
          if (bText.includes('all branches') || bText.includes('all')) {
            // matches
          } else if (branch === 'cse' && !bText.includes('cse') && !bText.includes('computer') && !bText.includes('ce')) {
            return false;
          } else if (branch === 'it' && !bText.includes('it') && !bText.includes('information')) {
            return false;
          } else if (branch === 'extc' && !bText.includes('extc') && !bText.includes('electronics')) {
            return false;
          } else if (branch === 'aids' && !bText.includes('ai') && !bText.includes('data')) {
            return false;
          }
        }

        return true;
      });

      // Sorting
      const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

      function parseCompanyVisitTimestamp(c) {
        if (typeof c.visitTimestamp === 'number' && c.visitTimestamp > 0) return c.visitTimestamp;
        if (typeof c.timestamp === 'number' && c.timestamp > 0) return c.timestamp;

        const candidates = [
          c.last,
          c.first,
          c.visitTimeline,
          c.visit_timeline,
          c.last_date,
          c.first_date,
          ...(c.roles || []).map(r => r.visitDate)
        ].filter(Boolean);

        let maxTs = 0;

        for (const raw of candidates) {
          const text = String(raw).trim();
          
          // 1. Try ISO YYYY-MM-DD
          const isoMatches = text.match(/(\\d{4})-(\\d{1,2})-(\\d{1,2})/g);
          if (isoMatches) {
            for (const iso of isoMatches) {
              const t = new Date(iso).getTime();
              if (!isNaN(t) && t > maxTs) maxTs = t;
            }
          }

          // 2. Try text dates like '26 Oct 2026', '22-26 Oct', 'Oct 2026', 'results 28 Oct', 'OA 9 Oct; interviews 15 Oct'
          const regex = /(?:(\\d{1,2})(?:\\s*(?:-|–|to|&)\\s*(\\d{1,2}))?\\s+)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\\s+(\\d{4}))?/gi;
          let match;
          while ((match = regex.exec(text)) !== null) {
            const day = parseInt(match[2] || match[1] || '15', 10);
            const mStr = match[3].toLowerCase().slice(0, 3);
            const mIdx = monthMap[mStr];
            let y = match[4] ? parseInt(match[4], 10) : 2026;
            if (mIdx !== undefined && !isNaN(day)) {
              const d = new Date(y, mIdx, day);
              const ts = d.getTime();
              if (ts > maxTs) maxTs = ts;
            }
          }
        }

        return maxTs;
      }

      function getCompanySortPay(c) {
        if (typeof c.payRank === 'number' && c.payRank > 0 && c.payRank < 10000) {
          return c.payRank;
        }
        const payStr = (c.pay || '').toLowerCase();
        if (c.payKind === 'Stipend' || payStr.includes('/ mo') || payStr.includes('per month') || payStr.includes('/mo')) {
          let monthlyLakhs = 0;
          if (payStr.includes('l')) {
            const m = payStr.match(/([0-9.]+)/);
            if (m) monthlyLakhs = parseFloat(m[1]);
          } else if (payStr.includes('k')) {
            const m = payStr.match(/([0-9.]+)/);
            if (m) monthlyLakhs = parseFloat(m[1]) / 100;
          }
          return Math.round(monthlyLakhs * 12 * 100);
        }
        const lpaM = payStr.match(/([0-9.]+)\s*lpa/i) || payStr.match(/([0-9.]+)/);
        if (lpaM) {
          return Math.round(parseFloat(lpaM[1]) * 100);
        }
        return 0;
      }

      function getCompanyTotalOffers(c) {
        if (c.noDetailsAvailable) return 0;
        return c.out?.students || (c.roles ? c.roles.reduce((a, r) => a + (r.count || 0), 0) : 0);
      }

      if (sort === 'placed') {
        filtered.sort((a, b) => getCompanyTotalOffers(b) - getCompanyTotalOffers(a));
      } else if (sort === 'pay') {
        filtered.sort((a, b) => getCompanySortPay(b) - getCompanySortPay(a));
      } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'latest') {
        filtered.sort((a, b) => {
          const diff = parseCompanyVisitTimestamp(b) - parseCompanyVisitTimestamp(a);
          if (diff !== 0) return diff;
          return getCompanyTotalOffers(b) - getCompanyTotalOffers(a);
        });
      }

      if (countEl) {
        const filteredOffers = calculateOffers(filtered);
        const totalBatchOffers = calculateOffers(companies);
        if (!q && role === 'all' && branch === 'all') {
          countEl.textContent = \`All \${companies.length} companies · \${totalBatchOffers} total offers\`;
        } else {
          countEl.textContent = \`Showing \${filtered.length} of \${companies.length} companies · \${filteredOffers} offers\`;
        }
      }

      if (filtered.length === 0) {
        listEl.innerHTML = '';
        noResultsEl?.classList.remove('hidden');
        return;
      }

      noResultsEl?.classList.add('hidden');

      listEl.innerHTML = filtered.map((c, idx) => {
        const num = String(idx + 1).padStart(3, '0');

        let chips = '';
        if (c.offers && c.offers.includes('internship')) chips += '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern</span>';
        if (c.offers && c.offers.includes('fulltime')) chips += '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';
        if (c.offers && c.offers.includes('ppo')) chips += '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>';

        const isNoDetails = c.noDetailsAvailable || c.pay === 'No details available';

        let paySubtitle = '&nbsp;';
        let payMain = c.pay || 'Not disclosed';

        if (isNoDetails) {
          payMain = '<span class="text-amber-400 font-medium">No details available</span>';
          paySubtitle = 'Submit data if you have →';
        } else if (c.isAmbiguous) {
          payMain = 'Unspecified';
          paySubtitle = '15 unclassified recruiters';
        } else if (c.pay && c.pay !== 'Not disclosed') {
          if (c.payKind === 'Stipend') {
            paySubtitle = 'Stipend';
          } else if (c.offers && c.offers.includes('fulltime')) {
            paySubtitle = 'Full-time CTC';
          } else if (c.offers && c.offers.includes('ppo')) {
            paySubtitle = 'CTC on PPO';
          } else {
            paySubtitle = 'Advertised CTC';
          }
        }

        let offersMain = '—';
        let offersSub = '&nbsp;';
        const hasOffers = (c.out && (c.out.students || c.out.fulltimeOffers || c.out.internships));

        if (isNoDetails) {
          offersMain = '—';
          offersSub = 'Awaiting data';
        } else if (c.isAmbiguous) {
          offersMain = String(c.out?.students || 25);
          offersSub = 'Estimated';
        } else {
          const ftOffers = c.out?.fulltimeOffers || 0;
          const internOffers = c.out?.internships || 0;
          const totalStudents = c.out?.students || 0;

          let roleFt = 0;
          let roleIntern = 0;
          let roleBoth = 0;

          if (c.roles && c.roles.length > 0) {
            c.roles.forEach(r => {
              const t = (r.type || '').toLowerCase();
              const cnt = r.count || 0;
              if (t === 'both' || t === 'internship+ppo' || t.includes('ppo')) {
                roleBoth += cnt;
              } else if (t === 'internship' || t === 'intern') {
                roleIntern += cnt;
              } else if (t === 'fulltime' || t === 'ft') {
                roleFt += cnt;
              } else {
                roleFt += cnt;
              }
            });
          }

          const totalOffersCount = totalStudents || (roleFt + roleIntern + roleBoth) || Math.max(ftOffers, internOffers);

          if (totalOffersCount > 0) {
            offersMain = String(totalOffersCount);

            if (roleFt > 0 && roleIntern > 0 && roleBoth === 0) {
              offersSub = roleFt + ' full-time · ' + roleIntern + ' intern';
            } else if (roleFt > 0 && roleBoth > 0 && roleIntern === 0) {
              offersSub = roleFt + ' full-time · ' + roleBoth + ' intern/PPO';
            } else if (roleIntern > 0 && roleBoth > 0 && roleFt === 0) {
              offersSub = roleIntern + ' intern · ' + roleBoth + ' intern/PPO';
            } else if (roleFt > 0 && roleIntern > 0 && roleBoth > 0) {
              offersSub = roleFt + ' FT · ' + roleIntern + ' intern · ' + roleBoth + ' both';
            } else if (roleBoth > 0 && roleFt === 0 && roleIntern === 0) {
              if (c.offers && c.offers.includes('ppo')) {
                offersSub = roleBoth + ' intern + PPO';
              } else {
                offersSub = roleBoth + ' full-time / intern';
              }
            } else if (roleFt > 0 && roleIntern === 0 && roleBoth === 0) {
              offersSub = roleFt + ' full-time';
            } else if (roleIntern > 0 && roleFt === 0 && roleBoth === 0) {
              offersSub = roleIntern + ' intern';
            } else if (ftOffers > 0 && internOffers > 0 && ftOffers !== internOffers) {
              offersSub = ftOffers + ' full-time · ' + internOffers + ' intern';
            } else if (ftOffers > 0 && internOffers === 0) {
              offersSub = ftOffers + ' full-time';
            } else if (internOffers > 0 && ftOffers === 0) {
              offersSub = internOffers + ' intern';
            } else if (ftOffers > 0 && ftOffers === internOffers) {
              offersSub = ftOffers + (c.offers?.includes('ppo') ? ' intern + PPO' : ' full-time / intern');
            } else {
              offersSub = totalOffersCount + ' offers';
            }
          } else if (c.status) {
            offersMain = c.status;
            offersSub = '&nbsp;';
          }
        }

        const logoHtml = c.logo 
          ? \`<img alt="" aria-hidden="true" loading="lazy" width="34" height="34" decoding="async" class="shrink-0 object-contain max-h-[34px] max-w-[70px]" src="\${c.logo}" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden');" /><span class="hidden grid size-[34px] shrink-0 place-items-center rounded bg-line font-display text-[15px] font-bold text-muted">\${c.name.charAt(0)}</span>\`
          : \`<span class="grid size-[34px] shrink-0 place-items-center rounded bg-line font-display text-[15px] font-bold text-muted">\${c.name.charAt(0)}</span>\`;

        return \`
          <li style="view-transition-name:c-\${c.slug};view-transition-class:row">
            <a class="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-line py-4 lg:grid-cols-[3.5rem_minmax(0,1fr)_9rem_12rem_9rem_11rem] lg:items-center lg:py-3.5" href="/companies/company.html?slug=\${c.slug}\${is2028 ? '&batch=2028' : ''}\${isNoDetails ? '&submit=1' : ''}">
              <span aria-hidden="true" class="absolute inset-y-0 -inset-x-[var(--gutter)] -z-10 origin-bottom scale-y-0 bg-fg transition-transform duration-[350ms] ease-[var(--ease)] group-hover:origin-top group-hover:scale-y-100 group-focus-visible:scale-y-100"></span>
              <span class="label num text-faint group-hover:text-bg max-lg:hidden">\${num}</span>
              <span class="flex min-w-0 items-center gap-3 lg:gap-4 transition-transform duration-[350ms] ease-[var(--ease)] group-hover:translate-x-3">
                \${logoHtml}
                <div class="flex flex-col min-w-0 justify-center">
                  <span class="truncate pb-[0.06em] font-display leading-[1.08] tracking-[-0.035em] group-hover:text-bg text-[clamp(26px,3.6vw,54px)]">\${c.name}</span>
                  \${c.subtext ? \`<span class="text-[12px] text-muted group-hover:text-bg/80 leading-snug mt-1 font-sans font-normal line-clamp-2 max-w-2xl">\${c.subtext}</span>\` : ''}
                </div>
              </span>
              <span class="flex flex-wrap gap-x-3 gap-y-1 group-hover:text-bg max-lg:col-span-2 max-lg:row-start-2">
                \${chips}
              </span>
              <span class="group-hover:text-bg max-lg:col-start-2 max-lg:row-start-1 max-lg:text-right">
                <span class="num block text-[15px]">\${payMain}</span>
                \${isNoDetails ? \`
                  <button type="button" class="btn-open-quick-sub label block text-[11px] text-intern group-hover:text-bg font-medium hover:underline cursor-pointer" data-slug="\${c.slug}" data-name="\${c.name}">
                    \${paySubtitle}
                  </button>
                \` : \`
                  <span class="label block text-[11px] text-faint group-hover:text-bg/60">\${paySubtitle}</span>
                \`}
              </span>
              <span class="group-hover:text-bg max-lg:col-span-2 max-lg:row-start-3 max-lg:flex max-lg:items-baseline max-lg:gap-2.5 \${(!hasOffers && !c.status && !isNoDetails) ? 'max-lg:hidden' : ''}">
                <span class="num block text-[15px] font-medium">\${offersMain}</span>
                <span class="label block text-[11px] text-faint group-hover:text-bg/60 normal-case">\${offersSub}</span>
              </span>
              <span class="label truncate text-muted group-hover:text-bg max-lg:hidden">\${c.branches || 'All branches'}</span>
            </a>
          </li>
        \`;
      }).join('');

      listEl.querySelectorAll('.btn-open-quick-sub').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const compName = btn.getAttribute('data-name');
          openQuickSubmitModal(compName);
        });
      });
    }

    // Quick Submission Modal Logic on Companies Page
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    const quickModal = document.getElementById('quick-submit-modal');
    const quickModalTitle = document.getElementById('quick-modal-title');
    const quickCompName = document.getElementById('quick-comp-name');
    const quickCompBatch = document.getElementById('quick-comp-batch');
    const quickForm = document.getElementById('quick-submit-form');
    const quickStatus = document.getElementById('quick-comp-status');
    const quickBtnText = document.getElementById('quick-modal-btn-text');
    const quickSubmitBtn = document.getElementById('quick-modal-submit-btn');

    function openQuickSubmitModal(compName) {
      if (!quickModal) return;
      if (quickCompName) quickCompName.value = compName;
      if (quickModalTitle) quickModalTitle.textContent = 'Submit Data · ' + compName;
      if (quickCompBatch) quickCompBatch.value = is2028 ? '2028' : '2027';
      if (quickStatus) {
        quickStatus.classList.add('hidden');
        quickStatus.textContent = '';
      }
      quickModal.classList.remove('hidden');
    }

    function closeQuickSubmitModal() {
      if (quickModal) quickModal.classList.add('hidden');
    }

    document.getElementById('quick-modal-close-btn')?.addEventListener('click', closeQuickSubmitModal);
    document.getElementById('quick-modal-cancel-btn')?.addEventListener('click', closeQuickSubmitModal);

    quickModal?.addEventListener('click', (e) => {
      if (e.target === quickModal) closeQuickSubmitModal();
    });

    quickForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!quickSubmitBtn) return;
      quickSubmitBtn.disabled = true;
      if (quickBtnText) quickBtnText.textContent = 'Submitting...';

      const compName = quickCompName?.value || 'Company';
      const batchYear = quickCompBatch?.value || (is2028 ? '2028' : '2027');
      const branchVal = document.getElementById('quick-comp-branch')?.value || 'All branches';
      const roleVal = document.getElementById('quick-comp-role')?.value || '';
      const payVal = document.getElementById('quick-comp-pay')?.value || '';
      const offersVal = parseInt(document.getElementById('quick-comp-offers')?.value, 10) || 1;
      const cgpaVal = document.getElementById('quick-comp-cgpa')?.value || '';
      const detailsVal = document.getElementById('quick-comp-details')?.value || '';
      const nameVal = document.getElementById('quick-comp-name-sub')?.value || 'Anonymous';
      const contactVal = document.getElementById('quick-comp-contact')?.value || '';

      const combinedDetails = [
        cgpaVal ? ('Eligibility: ' + cgpaVal) : '',
        detailsVal
      ].filter(Boolean).join(' | ');

      const payload = {
        type: 'branch_data',
        batch: batchYear,
        batch_year: batchYear,
        branch: branchVal,
        company_name: compName,
        role_title: roleVal,
        offers_count: offersVal,
        compensation: payVal,
        details: combinedDetails,
        submitter_name: nameVal,
        submitter_contact: contactVal,
        status: 'pending'
      };

      try {
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

        if (!res.ok) throw new Error(await res.text() || 'Failed to submit data');

        if (quickStatus) {
          quickStatus.className = 'rounded-xl p-3 text-[13px] bg-intern/10 border border-intern/30 text-intern';
          quickStatus.textContent = '✔ Thank you! Placement data for ' + compName + ' has been submitted and sent to the admin dashboard for verification.';
          quickStatus.classList.remove('hidden');
        }
        quickForm.reset();
        setTimeout(() => {
          closeQuickSubmitModal();
        }, 2200);
      } catch (err) {
        if (quickStatus) {
          quickStatus.className = 'rounded-xl p-3 text-[13px] bg-red-500/10 border border-red-500/30 text-red-300';
          quickStatus.textContent = 'Submission error: ' + (err.message || 'Please try again.');
          quickStatus.classList.remove('hidden');
        }
      } finally {
        quickSubmitBtn.disabled = false;
        if (quickBtnText) quickBtnText.textContent = 'Submit Data';
      }
    });

    searchInput?.addEventListener('input', renderCompanies);
    roleSelect?.addEventListener('change', renderCompanies);
    branchSelect?.addEventListener('change', renderCompanies);
    sortSelect?.addEventListener('change', renderCompanies);

    renderCompanies();

    // Background live Supabase sync so newly added/edited companies appear without full redeploy
    async function syncLiveSupabase() {
      try {
        const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/companies?batch_year=eq.\${batch.year}&order=out_students.desc\`, {
          signal: controller.signal,
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0) {
            let changed = false;
            rows.forEach(d => {
              const mapped = {
                name: d.name,
                slug: d.slug,
                subtext: d.subtext,
                isAmbiguous: d.slug === 'ambiguous',
                offers: d.offers || [],
                seasons: d.seasons || [],
                pay: d.pay,
                payKind: d.pay_kind,
                payRank: d.pay_rank,
                dream: d.dream,
                logo: d.logo,
                status: d.status,
                branches: d.branches,
                cgpaCriteria: d.cgpa_criteria,
                boardsCriteria: d.boards_criteria,
                visitTimeline: d.visit_timeline,
                funnelRaw: d.funnel_raw,
                roles: d.roles || [],
                out: {
                  students: d.out_students,
                  internships: d.out_internships,
                  fulltimeOffers: d.out_fulltime,
                  ppo: d.out_ppo
                }
              };
              const idx = companies.findIndex(c => c.slug === d.slug);
              if (idx >= 0) {
                companies[idx] = Object.assign(companies[idx], mapped);
                changed = true;
              } else {
                companies.push(mapped);
                changed = true;
              }
            });
            if (changed) {
              renderCompanies();
              updateStatStrip();
            }
          }
        }
      } catch (e) {
        // Fallback silently to static dataset
      }
    }
    syncLiveSupabase();
  `;

  const html = pageTemplate({
    title: `Companies · Placed · ${siteConfig.collegeShort}`,
    activePath: '/companies/',
    content,
    extraScript
  });

  fs.writeFileSync('companies/index.html', html);
  console.log('companies/index.html created successfully matching placed-27 design!');
}

function generateCompanyDetailPage() {
  const content = `
    <div class="wrap pb-16 pt-[clamp(40px,6vw,80px)]">
      <!-- Breadcrumb navigation -->
      <nav aria-label="Breadcrumb" class="label mb-8 flex items-center gap-2 text-[13px] text-muted">
        <a href="/" class="hover:text-fg transition-colors">Home</a>
        <span>/</span>
        <a id="breadcrumb-companies-link" href="/companies/" class="hover:text-fg transition-colors">Companies</a>
        <span>/</span>
        <span id="breadcrumb-company-name" class="text-fg font-medium">Company Details</span>
      </nav>

      <div id="company-loading" class="py-20 text-center text-muted">
        Loading company details...
      </div>

      <div id="company-content" class="hidden">
        <!-- Company Header Section -->
        <header class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-8">
          <div class="flex items-center gap-5">
            <div id="company-logo-container" class="size-16 sm:size-20 shrink-0 rounded-2xl border border-line-strong bg-panel p-2 flex items-center justify-center overflow-hidden">
              <!-- Company Logo -->
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 id="company-title" class="display-l leading-none"></h1>
                <span id="company-batch-pill" class="chip text-fg font-mono text-[11px]">Batch '27</span>
              </div>
              <div id="company-chips" class="mt-3 flex flex-wrap gap-2">
                <!-- Chips -->
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a id="report-company-btn" class="label inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[12px] text-muted transition-colors hover:border-fg hover:text-fg" href="/corrections/">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              <span>Report data</span>
            </a>
            <a id="back-to-companies-btn" class="label rounded-full border border-line-strong px-4 py-2 text-muted transition-colors hover:border-fg hover:text-fg" href="/companies/">
              ← Back to Companies
            </a>
          </div>
        </header>

        <!-- No Details Available Banner -->
        <div id="company-no-details-card" class="mt-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hidden">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-amber-500/20 text-amber-300 font-bold px-3 py-1 text-[11px] font-mono tracking-wider">STATUS: NO DETAILS AVAILABLE</span>
            </div>
            <h3 class="font-display text-[22px] sm:text-[26px] text-fg font-medium">Placement data for this company is currently unavailable</h3>
            <p class="text-[14px] text-muted max-w-[65ch] leading-relaxed">
              Campus recruitment packages, eligibility criteria, and selection lists have not yet been published or confirmed for this company. If you participated in this drive or have placement records, submit your data below to update the portal.
            </p>
          </div>
          <button id="btn-open-company-submit-modal" type="button" class="cursor-pointer shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-intern px-5 py-3 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            <span>Submit data if you have it</span>
          </button>
        </div>

        <!-- 6-Column Stats Grid -->
        <dl id="company-stats-grid" class="mt-12 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-r sm:px-5 sm:first:pl-0">
            <dt class="order-2 mt-2 text-muted text-[13px]">Advertised Pay</dt>
            <dd id="stat-pay" class="num order-1 font-display text-[clamp(24px,2.2vw,36px)] leading-none text-fg"></dd>
            <dd id="stat-pay-kind" class="label order-3 mt-1 text-[11px] text-faint"></dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Total Offers</dt>
            <dd id="stat-total" class="num order-1 font-display text-[clamp(24px,2.2vw,36px)] leading-none text-fg"></dd>
            <dd id="stat-cohort-label" class="label order-3 mt-1 text-[11px] text-faint">Confirmed Selections</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Full-time / PPO</dt>
            <dd id="stat-fulltime" class="num order-1 font-display text-[clamp(24px,2.2vw,36px)] leading-none text-fg"></dd>
            <dd id="stat-ppo" class="label order-3 mt-1 text-[11px] text-faint"></dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Internships</dt>
            <dd id="stat-interns" class="num order-1 font-display text-[clamp(24px,2.2vw,36px)] leading-none text-fg"></dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Students selected</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 sm:border-r sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Min CGPA Criteria</dt>
            <dd id="stat-cgpa" class="num order-1 font-display text-[clamp(20px,1.8vw,28px)] leading-none text-fg truncate"></dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Cutoff Threshold</dd>
          </div>
          <div class="flex flex-col py-5 pr-4 sm:px-5">
            <dt class="order-2 mt-2 text-muted text-[13px]">Board Criteria</dt>
            <dd id="stat-boards" class="num order-1 font-display text-[clamp(18px,1.6vw,24px)] leading-none text-fg truncate"></dd>
            <dd class="label order-3 mt-1 text-[11px] text-faint">Class X / XII</dd>
          </div>
        </dl>

        <!-- Eligibility & Drive Details Card -->
        <section class="mt-12 rounded-3xl border border-line-strong bg-panel p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
            <div>
              <p class="label text-faint">SPIT Placement Records</p>
              <h2 class="display-m mt-1 text-[22px] sm:text-[26px]">Recruitment Drive & Criteria</h2>
            </div>
            <div id="company-visit-badge" class="flex items-center gap-2 text-[13px] text-muted font-mono">
              <!-- Timeline Date Badge -->
            </div>
          </div>

          <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-2xl border border-line bg-bg/50 p-4">
              <span class="label text-[11px] text-faint block uppercase tracking-wider">CGPA Requirement</span>
              <p id="detail-cgpa" class="mt-2 text-[14px] text-fg leading-relaxed font-medium"></p>
            </div>
            <div class="rounded-2xl border border-line bg-bg/50 p-4">
              <span class="label text-[11px] text-faint block uppercase tracking-wider">Class X / XII Boards Requirement</span>
              <p id="detail-boards" class="mt-2 text-[14px] text-fg leading-relaxed font-medium"></p>
            </div>
            <div class="rounded-2xl border border-line bg-bg/50 p-4 sm:col-span-2 lg:col-span-1">
              <span class="label text-[11px] text-faint block uppercase tracking-wider">Eligible Branches</span>
              <p id="detail-branches" class="mt-2 text-[14px] text-fg leading-relaxed font-medium"></p>
            </div>
          </div>

          <div id="company-notes-container" class="mt-6 border-t border-line pt-4 hidden">
            <span class="label text-[11px] text-faint block uppercase tracking-wider">Placement Cell Notes & Confidence</span>
            <p id="detail-notes" class="mt-2 text-[13px] text-muted leading-relaxed"></p>
          </div>
        </section>

        <!-- Recruitment Drives & Roles Breakdown -->
        <section class="mt-16">
          <div class="border-t border-line pt-6">
            <p class="label text-faint">01 — Offerings</p>
            <h2 class="display-m mt-2">Roles, Compensation & Compensation Breakdown</h2>
          </div>

          <div id="company-roles-list" class="mt-8 grid gap-4">
            <!-- Dynamic role cards -->
          </div>
        </section>

        <!-- Selection Stages / Funnel -->
        <section class="mt-16">
          <div class="border-t border-line pt-6">
            <p class="label text-faint">02 — Selectivity</p>
            <h2 class="display-m mt-2">Recruitment Funnel & Round Progression</h2>
          </div>

          <div id="company-funnel-card" class="mt-8 rounded-3xl border border-line-strong bg-panel p-6 sm:p-8">
            <div id="company-funnel-raw" class="mb-6 rounded-xl border border-line bg-bg/60 p-4 text-[13px] font-mono text-muted hidden">
              <!-- Raw funnel step chain -->
            </div>
            <div id="company-funnel-bars" class="grid gap-4">
              <!-- Dynamic funnel bars -->
            </div>
          </div>
        </section>

        <!-- Submit Company Data Modal -->
        <div id="submit-company-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 hidden">
          <div class="relative w-full max-w-[560px] rounded-3xl border border-line-strong bg-panel p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <span class="label text-intern font-mono">Contribute Verified Data</span>
                <h3 id="modal-company-title" class="font-display text-[22px] font-semibold text-fg mt-1">Submit Placement Data</h3>
              </div>
              <button id="modal-close-btn" type="button" class="cursor-pointer rounded-full p-2 text-muted hover:text-fg hover:bg-line transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form id="submit-company-form" class="mt-6 space-y-4">
              <div>
                <label class="label block text-[11px] text-faint mb-1.5">Company Name</label>
                <input id="modal-comp-name" type="text" readonly class="w-full rounded-xl border border-line-strong bg-bg/50 px-3.5 py-2.5 text-[14px] text-fg font-medium outline-none" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Batch</label>
                  <select id="modal-comp-batch" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                    <option value="2027" class="bg-[#121316] text-[#ededed]">Class of 2027</option>
                    <option value="2028" class="bg-[#121316] text-[#ededed]">Class of 2028</option>
                  </select>
                </div>
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Branch</label>
                  <select id="modal-comp-branch" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" style="color-scheme: dark; background-color: #121316; color: #ededed;">
                    <option value="All branches" class="bg-[#121316] text-[#ededed]">All Branches Open</option>
                    <option value="CSE" class="bg-[#121316] text-[#ededed]">CSE</option>
                    <option value="IT" class="bg-[#121316] text-[#ededed]">IT</option>
                    <option value="AI & DS" class="bg-[#121316] text-[#ededed]">AI &amp; DS</option>
                    <option value="EXTC" class="bg-[#121316] text-[#ededed]">EXTC</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Role Title</label>
                  <input id="modal-comp-role" type="text" placeholder="e.g. SDE, Associate Analyst" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Package / Compensation</label>
                  <input id="modal-comp-pay" type="text" placeholder="e.g. ₹15 LPA or ₹50,000 / mo" required class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Offers Made / Placed Count</label>
                  <input id="modal-comp-offers" type="number" min="1" placeholder="e.g. 5" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Eligibility / CGPA Cutoff</label>
                  <input id="modal-comp-cgpa" type="text" placeholder="e.g. 8.0+ CGPA, no active backlogs" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
              </div>

              <div>
                <label class="label block text-[11px] text-faint mb-1.5">Additional Details / Drive Rounds / Dates</label>
                <textarea id="modal-comp-details" rows="3" placeholder="Provide any details about rounds, assessment dates, interview stages, or verification references..." class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg"></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Your Name (Optional)</label>
                  <input id="modal-comp-name-sub" type="text" placeholder="Anonymous or Name" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[11px] text-faint mb-1.5">Contact (Optional)</label>
                  <input id="modal-comp-contact" type="text" placeholder="Email / Phone for verification" class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
              </div>

              <div id="modal-comp-status" class="hidden"></div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button id="modal-cancel-btn" type="button" class="cursor-pointer rounded-full px-5 py-2.5 font-mono text-[13px] text-muted hover:text-fg transition-colors">
                  Cancel
                </button>
                <button id="modal-submit-btn" type="submit" class="cursor-pointer inline-flex items-center gap-2 rounded-full bg-intern px-6 py-2.5 font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-90">
                  <span id="modal-btn-text">Submit Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="company-not-found" class="hidden py-24 text-center">
        <h2 class="display-m">Company not found</h2>
        <p class="mt-4 text-muted">The requested company record could not be found.</p>
        <a class="label mt-8 inline-block rounded-full bg-fg px-5 py-3 text-bg" href="/companies/">Browse all companies</a>
      </div>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey, allBatches } from '/src/data/batches.js';

    const params = new URLSearchParams(window.location.search);
    const slug = (params.get('slug') || '').toLowerCase().trim();
    const batchParam = params.get('batch');
    
    // Choose active batch from URL param or global (strictly defaults to 2027)
    const currentBatch = batchParam === '2028' ? '2028' : '2027';
    const batchData = allBatches[currentBatch] || getActiveBatchData();
    const is2028 = currentBatch === '2028';

    const loadingEl = document.getElementById('company-loading');
    const contentEl = document.getElementById('company-content');
    const notFoundEl = document.getElementById('company-not-found');

    async function initCompanyDetails() {
      // Find company in current batch first, then in alternate batch as fallback
      let company = batchData.companies.find(c => c.slug.toLowerCase() === slug || (c.slug === 'idfc-first-bank' && slug === 'idfc-first-bank-apm'));
      let matchedBatchYear = currentBatch;
      if (!company) {
        const altYear = currentBatch === '2028' ? '2027' : '2028';
        company = allBatches[altYear]?.companies.find(c => c.slug.toLowerCase() === slug || (c.slug === 'idfc-first-bank' && slug === 'idfc-first-bank-apm'));
        if (company) matchedBatchYear = altYear;
      }

      if (!company && slug) {
        try {
          const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
          const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';
          const res = await fetch(\`\${SUPABASE_URL}/rest/v1/companies?slug=eq.\${encodeURIComponent(slug)}\`, {
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': \`Bearer \${SUPABASE_KEY}\`
            }
          });
          if (res.ok) {
            const rows = await res.json();
            if (rows && rows.length > 0) {
              const d = rows[0];
              matchedBatchYear = d.batch_year || currentBatch;
              company = {
                name: d.name,
                slug: d.slug,
                offers: d.offers || [],
                seasons: d.seasons || [],
                pay: d.pay,
                payKind: d.pay_kind,
                payRank: d.pay_rank,
                dream: d.dream,
                logo: d.logo,
                status: d.status,
                branches: d.branches,
                cgpaCriteria: d.cgpa_criteria,
                boardsCriteria: d.boards_criteria,
                visitTimeline: d.visit_timeline,
                funnelRaw: d.funnel_raw,
                roles: d.roles || [],
                out: {
                  students: d.out_students,
                  internships: d.out_internships,
                  fulltimeOffers: d.out_fulltime,
                  ppo: d.out_ppo
                }
              };
            }
          }
        } catch(e) {}
      }

      if (!company) {
        loadingEl?.classList.add('hidden');
        notFoundEl?.classList.remove('hidden');
        return;
      }

      loadingEl?.classList.add('hidden');
      contentEl?.classList.remove('hidden');

      document.title = company.name + ' · Placed ’' + matchedBatchYear.slice(2) + ' · SPIT';

      // Breadcrumb & Links
      const bcLink = document.getElementById('breadcrumb-companies-link');
      const backBtn = document.getElementById('back-to-companies-btn');
      const reportBtn = document.getElementById('report-company-btn');
      const targetHref = matchedBatchYear === '2028' ? '/companies/?batch=2028' : '/companies/';
      if (bcLink) bcLink.href = targetHref;
      if (backBtn) backBtn.href = targetHref;
      if (reportBtn) reportBtn.href = '/corrections/?company=' + encodeURIComponent(company.name);

      const bcName = document.getElementById('breadcrumb-company-name');
      if (bcName) bcName.textContent = company.name;

      // Title & Logo
      document.getElementById('company-title').textContent = company.name;
      const batchPill = document.getElementById('company-batch-pill');
      if (batchPill) {
        batchPill.textContent = "Batch '" + matchedBatchYear.slice(2);
      }

      const logoContainer = document.getElementById('company-logo-container');
      if (company.logo) {
        logoContainer.innerHTML = '<img alt="' + company.name + '" src="' + company.logo + '" class="size-full object-contain" />';
      } else {
        logoContainer.innerHTML = '<span class="font-display text-[24px] font-bold text-muted">' + company.name.charAt(0) + '</span>';
      }

      // Chips
      const chipsEl = document.getElementById('company-chips');
      let chips = '';
      if (company.offers?.includes('internship')) chips += '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Internship</span>';
      if (company.offers?.includes('fulltime')) chips += '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';
      if (company.offers?.includes('ppo')) chips += '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO Pathway</span>';
      chips += '<span class="chip text-muted">' + (company.status || 'Active') + '</span>';
      chipsEl.innerHTML = chips;

      // Stats
      const isNoDetails = company.noDetailsAvailable || company.pay === 'No details available';

      if (isNoDetails) {
        const noDetailsCard = document.getElementById('company-no-details-card');
        if (noDetailsCard) noDetailsCard.classList.remove('hidden');

        const statPay = document.getElementById('stat-pay');
        if (statPay) statPay.innerHTML = '<span class="text-amber-400 text-[18px] sm:text-[20px] font-medium">No details</span>';
        
        const statPayKind = document.getElementById('stat-pay-kind');
        if (statPayKind) statPayKind.textContent = 'Awaiting data';

        document.getElementById('stat-total').textContent = '—';
        const cohortLabel = document.getElementById('stat-cohort-label');
        if (cohortLabel) cohortLabel.textContent = "Awaiting verification";

        document.getElementById('stat-fulltime').textContent = '—';
        document.getElementById('stat-ppo').textContent = 'Awaiting data';
        document.getElementById('stat-interns').textContent = '—';

        const statCgpa = document.getElementById('stat-cgpa');
        if (statCgpa) statCgpa.textContent = '—';
        const statBoards = document.getElementById('stat-boards');
        if (statBoards) statBoards.textContent = '—';
      } else {
        document.getElementById('stat-pay').textContent = company.pay || 'Competitive';
        document.getElementById('stat-pay-kind').textContent = company.payKind === 'Stipend' ? 'Monthly Stipend' : 'Annual CTC';
        
        document.getElementById('stat-total').textContent = company.out?.students || 0;
        const cohortLabel = document.getElementById('stat-cohort-label');
        if (cohortLabel) cohortLabel.textContent = company.isAmbiguous ? "Estimated offers" : "Batch '" + matchedBatchYear.slice(2) + " offers";

        document.getElementById('stat-fulltime').textContent = company.out?.fulltimeOffers || 0;
        document.getElementById('stat-ppo').textContent = (company.out?.ppo || 0) + ' PPO conversions';

        document.getElementById('stat-interns').textContent = company.out?.internships || 0;

        // Criteria Stats
        const statCgpa = document.getElementById('stat-cgpa');
        if (statCgpa) {
          const cVal = company.cgpa ? (company.cgpa + (company.cgpa < 10 ? '+' : '')) : 'Open';
          statCgpa.textContent = cVal;
        }
        const statBoards = document.getElementById('stat-boards');
        if (statBoards) {
          let bVal = 'Standard';
          if (company.boardsCriteria && company.boardsCriteria.includes('80%')) bVal = '80% XII';
          else if (company.boardsCriteria && company.boardsCriteria.includes('60%')) bVal = '60% X/XII';
          statBoards.textContent = bVal;
        }
      }

      // Detailed Criteria Box
      document.getElementById('detail-cgpa').textContent = company.cgpaCriteria || 'No minimum cutoff reported (good academic standing advised).';
      document.getElementById('detail-boards').textContent = company.boardsCriteria || 'Standard SPIT university eligibility criteria.';
      document.getElementById('detail-branches').textContent = company.branches || 'All Engineering branches eligible.';

      // Visit Date Badge
      const visitBadge = document.getElementById('company-visit-badge');
      if (visitBadge && (company.visitTimeline || company.first)) {
        visitBadge.innerHTML = '<span>Drive Date:</span> <span class="text-fg">' + (company.visitTimeline || company.first) + '</span>';
      }

      // Notes
      if (company.notes) {
        document.getElementById('company-notes-container')?.classList.remove('hidden');
        document.getElementById('detail-notes').textContent = company.notes;
      }

      // Roles
      const rolesEl = document.getElementById('company-roles-list');
      if (company.roles && company.roles.length > 0) {
        rolesEl.innerHTML = company.roles.map(r => \`
          <div class="rounded-2xl border border-line-strong bg-panel p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="chip"><i class="dot" style="background:\${r.type === 'internship' ? 'var(--color-intern)' : (r.type === 'both' ? 'var(--color-ppo)' : 'var(--color-fulltime)')}"></i>\${r.type === 'internship' ? 'Internship' : (r.type === 'both' ? 'Intern + Full-time PPO' : 'Full-time')}</span>
                  <h3 class="font-display text-[19px] sm:text-[21px] text-fg font-medium">\${r.title}</h3>
                </div>
                
                \${r.rawCompensation ? \`
                  <div class="inline-flex items-center gap-2 rounded-lg bg-bg/80 px-3 py-1.5 border border-line text-[13px] text-fg">
                    <span class="text-faint">Compensation Breakdown:</span>
                    <span class="font-medium">\${r.rawCompensation}</span>
                  </div>
                \` : ''}

                \${r.visitDate ? \`
                  <div class="text-[12px] text-muted font-mono flex items-center gap-1.5">
                    <span>Timeline:</span>
                    <span>\${r.visitDate}</span>
                  </div>
                \` : ''}

                \${r.notes ? '<p class="text-[13px] text-muted italic">Note: ' + r.notes + '</p>' : ''}

                \${r.funnelRaw ? \`
                  <div class="mt-2 text-[12px] text-faint font-mono bg-bg/40 p-2 rounded-md border border-line">
                    <span class="text-muted font-semibold">Funnel:</span> \${r.funnelRaw}
                  </div>
                \` : ''}
              </div>

              <div class="text-left sm:text-right shrink-0 border-t sm:border-t-0 border-line pt-3 sm:pt-0">
                <span class="num font-display text-[22px] sm:text-[24px] text-fg font-semibold block">\${r.ctc || 'Competitive'}</span>
                \${r.stipend ? '<span class="label block text-[12px] text-muted mt-0.5">Stipend: ' + r.stipend + '</span>' : ''}
                <span class="label block text-[11px] text-intern font-medium mt-1.5">\${r.count} \${r.count === 1 ? 'offer' : 'offers'} confirmed</span>
              </div>
            </div>
          </div>
        \`).join('');
      } else {
        if (isNoDetails) {
          rolesEl.closest('section')?.classList.add('hidden');
        } else {
          rolesEl.innerHTML = '<p class="text-muted">Standard campus roles advertised.</p>';
        }
      }

      // Funnel
      const funnelBarsEl = document.getElementById('company-funnel-bars');
      const funnelRawEl = document.getElementById('company-funnel-raw');

      if (company.funnelRaw) {
        funnelRawEl.classList.remove('hidden');
        funnelRawEl.innerHTML = '<span class="text-muted font-semibold block mb-1">Process Trail:</span> ' + company.funnelRaw;
      }

      if (company.stages && company.stages.length > 0) {
        const maxVal = company.stages[0].count || 100;
        funnelBarsEl.innerHTML = company.stages.map((s, idx) => {
          const pct = Math.max(Math.round((s.count / maxVal) * 100), 4);
          const isLast = idx === company.stages.length - 1;
          const barColor = isLast ? 'bg-intern' : 'bg-fg';

          return \`
            <div class="grid grid-cols-[10rem_1fr_4rem] sm:grid-cols-[16rem_1fr_5rem] items-center gap-4 text-[14px]">
              <span class="truncate \${isLast ? 'text-fg font-semibold' : 'text-muted'}">\${s.name}</span>
              <div class="h-3 w-full bg-line rounded-full overflow-hidden">
                <div class="h-full \${barColor} rounded-full transition-all duration-500" style="width: \${pct}%"></div>
              </div>
              <span class="num text-right font-medium \${isLast ? 'text-intern font-bold' : 'text-fg'}">\${s.count}</span>
            </div>
          \`;
        }).join('');
      } else {
        if (isNoDetails) {
          funnelBarsEl.closest('section')?.classList.add('hidden');
        }
      }

      // Modal Wiring
      const modal = document.getElementById('submit-company-modal');
      const openBtn = document.getElementById('btn-open-company-submit-modal');
      const closeBtn = document.getElementById('modal-close-btn');
      const cancelBtn = document.getElementById('modal-cancel-btn');
      const modalTitle = document.getElementById('modal-company-title');
      const compNameInput = document.getElementById('modal-comp-name');
      const batchSelect = document.getElementById('modal-comp-batch');
      const submitForm = document.getElementById('submit-company-form');
      const statusEl = document.getElementById('modal-comp-status');
      const submitBtn = document.getElementById('modal-submit-btn');
      const submitBtnText = document.getElementById('modal-btn-text');

      function openModal() {
        if (!modal) return;
        if (compNameInput) compNameInput.value = company.name;
        if (modalTitle) modalTitle.textContent = 'Submit Placement Data · ' + company.name;
        if (batchSelect) batchSelect.value = matchedBatchYear;
        if (statusEl) {
          statusEl.classList.add('hidden');
          statusEl.textContent = '';
        }
        modal.classList.remove('hidden');
      }

      function closeModal() {
        if (modal) modal.classList.add('hidden');
      }

      openBtn?.addEventListener('click', openModal);
      closeBtn?.addEventListener('click', closeModal);
      cancelBtn?.addEventListener('click', closeModal);

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      // Auto-open modal if URL query has ?submit=1 or #submit
      if (params.get('submit') === '1' || window.location.hash === '#submit') {
        setTimeout(openModal, 150);
      }

      submitForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!submitBtn) return;
        submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = 'Submitting...';

        const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

        const batchYear = batchSelect?.value || matchedBatchYear;
        const branchVal = document.getElementById('modal-comp-branch')?.value || 'All branches';
        const roleVal = document.getElementById('modal-comp-role')?.value || '';
        const payVal = document.getElementById('modal-comp-pay')?.value || '';
        const offersVal = parseInt(document.getElementById('modal-comp-offers')?.value, 10) || 1;
        const cgpaVal = document.getElementById('modal-comp-cgpa')?.value || '';
        const detailsVal = document.getElementById('modal-comp-details')?.value || '';
        const nameVal = document.getElementById('modal-comp-name-sub')?.value || 'Anonymous';
        const contactVal = document.getElementById('modal-comp-contact')?.value || '';

        const combinedDetails = [
          cgpaVal ? ('Eligibility: ' + cgpaVal) : '',
          detailsVal
        ].filter(Boolean).join(' | ');

        const payload = {
          type: 'branch_data',
          batch: batchYear,
          batch_year: batchYear,
          branch: branchVal,
          company_name: company.name,
          role_title: roleVal,
          offers_count: offersVal,
          compensation: payVal,
          details: combinedDetails,
          submitter_name: nameVal,
          submitter_contact: contactVal,
          status: 'pending'
        };

        try {
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

          if (!res.ok) throw new Error(await res.text() || 'Failed to submit data');

          if (statusEl) {
            statusEl.className = 'rounded-xl p-3 text-[13px] bg-intern/10 border border-intern/30 text-intern';
            statusEl.textContent = '✔ Thank you! Placement data for ' + company.name + ' has been submitted and sent to the admin dashboard for verification.';
            statusEl.classList.remove('hidden');
          }
          submitForm.reset();
          setTimeout(() => {
            closeModal();
          }, 2200);
        } catch (err) {
          if (statusEl) {
            statusEl.className = 'rounded-xl p-3 text-[13px] bg-red-500/10 border border-red-500/30 text-red-300';
            statusEl.textContent = 'Submission error: ' + (err.message || 'Please try again.');
            statusEl.classList.remove('hidden');
          }
        } finally {
          submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.textContent = 'Submit Data';
        }
      });
    }

    initCompanyDetails();
  `;

  const html = pageTemplate({
    title: `Company Details · Placed · ${siteConfig.collegeShort}`,
    activePath: '/companies/',
    content,
    extraScript
  });

  fs.writeFileSync('companies/company.html', html);
  console.log('companies/company.html created successfully with Multi-Batch & Classified Criteria support!');
}

generateCompaniesPage();
generateCompanyDetailPage();
