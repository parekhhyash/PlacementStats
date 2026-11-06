const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateCompaniesPage() {
  const content = `
    <section class="wrap pb-10 pt-[clamp(48px,8vw,112px)]">
      <p id="companies-page-badge" class="label text-muted">Companies · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
      <h1 class="display-l mt-6 max-w-[16ch]">Every company, every offer.</h1>
      <p id="companies-page-desc" class="mt-8 max-w-[62ch] text-[17px] leading-relaxed text-muted">
        All recruiting companies that visited ${siteConfig.collegeName}: roles, compensation, branch criteria, round funnels, and confirmed selections.
      </p>

      <!-- Filter Controls Bar -->
      <div class="mt-12 flex flex-col gap-4 border-b border-line pb-6">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative flex min-h-[44px] flex-1 min-w-[260px] items-center gap-3 rounded-full border border-line-strong bg-panel px-4 py-2 transition-colors focus-within:border-fg">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" class="text-faint">
              <circle cx="7" cy="7" r="5"/>
              <path d="M11 11l3.5 3.5"/>
            </svg>
            <input id="company-search" type="search" placeholder="Search company, role (e.g. SDE, AI, Risk, Banking), criteria..." class="w-full bg-transparent text-[14px] text-fg outline-none placeholder:text-faint" />
          </div>

          <!-- Role Filter -->
          <div class="relative">
            <select id="role-filter" class="appearance-none cursor-pointer rounded-full border border-line-strong bg-panel px-4 py-2.5 pr-8 text-[13px] text-fg outline-none transition-colors hover:border-fg">
              <option value="all">Role: All</option>
              <option value="fulltime">Full-time only</option>
              <option value="internship">Internship only</option>
              <option value="ppo">PPO / Dual</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint">▼</span>
          </div>

          <!-- Branch Filter -->
          <div class="relative">
            <select id="branch-filter" class="appearance-none cursor-pointer rounded-full border border-line-strong bg-panel px-4 py-2.5 pr-8 text-[13px] text-fg outline-none transition-colors hover:border-fg">
              <option value="all">Branch: All</option>
              <option value="cse">CSE</option>
              <option value="it">IT</option>
              <option value="extc">EXTC</option>
              <option value="aids">AI & DS</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint">▼</span>
          </div>

          <!-- Sort Order -->
          <div class="relative">
            <select id="sort-order" class="appearance-none cursor-pointer rounded-full border border-line-strong bg-panel px-4 py-2.5 pr-8 text-[13px] text-fg outline-none transition-colors hover:border-fg">
              <option value="placed">Sort: Offers made</option>
              <option value="pay">Sort: Pay (High to Low)</option>
              <option value="name">Sort: Name (A–Z)</option>
              <option value="latest">Sort: Date</option>
            </select>
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint">▼</span>
          </div>
        </div>

        <div class="flex items-center justify-between text-[12px] text-faint">
          <span id="results-count">Loading companies...</span>
          <span>Click any company row for roles, breakdown & funnels</span>
        </div>
      </div>

      <!-- Companies Table -->
      <div class="mt-4">
        <div class="label hidden grid-cols-[3rem_minmax(0,1fr)_8rem_10rem_8rem_9rem_9rem] gap-4 border-b border-line py-3 text-faint lg:grid">
          <span>No.</span>
          <span>Company</span>
          <span>Offered</span>
          <span>Advertised pay</span>
          <span>Offers made</span>
          <span>CGPA Cutoff</span>
          <span>Branches</span>
        </div>

        <ol id="companies-list" class="divide-y divide-line">
          <!-- Dynamic company rows will render here -->
        </ol>

        <div id="no-results" class="hidden py-16 text-center text-muted">
          No companies found matching your query.
        </div>
      </div>
    </section>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const companies = batch.companies || [];

    // Update header badge and description
    const badgeEl = document.getElementById('companies-page-badge');
    if (badgeEl) {
      badgeEl.textContent = \`Companies · SPIT Class of \${batch.year}\`;
    }
    const descEl = document.getElementById('companies-page-desc');
    if (descEl) {
      descEl.textContent = \`All \${companies.length} recruiting companies that visited SPIT for the \${batch.year} batch: roles, compensation, branch criteria, round funnels, and confirmed selections.\`;
    }

    const listEl = document.getElementById('companies-list');
    const searchInput = document.getElementById('company-search');
    const roleSelect = document.getElementById('role-filter');
    const branchSelect = document.getElementById('branch-filter');
    const sortSelect = document.getElementById('sort-order');
    const countEl = document.getElementById('results-count');
    const noResultsEl = document.getElementById('no-results');

    function renderCompanies() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const role = roleSelect?.value || 'all';
      const branch = branchSelect?.value || 'all';
      const sort = sortSelect?.value || 'placed';

      let filtered = companies.filter(c => {
        // Query match
        if (q) {
          const matchName = c.name.toLowerCase().includes(q);
          const matchRoles = c.roles && c.roles.some(r => r.title.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q)));
          const matchPay = c.pay && c.pay.toLowerCase().includes(q);
          const matchBranch = c.branches && c.branches.toLowerCase().includes(q);
          const matchCgpa = c.cgpaCriteria && c.cgpaCriteria.toLowerCase().includes(q);
          const matchBoards = c.boardsCriteria && c.boardsCriteria.toLowerCase().includes(q);
          if (!matchName && !matchRoles && !matchPay && !matchBranch && !matchCgpa && !matchBoards) return false;
        }

        // Role filter
        if (role !== 'all') {
          if (!c.offers || !c.offers.includes(role)) return false;
        }

        // Branch filter
        if (branch !== 'all') {
          const bText = (c.branches || '').toLowerCase();
          if (bText.includes('all branches open')) {
            // matches
          } else if (branch === 'cse' && !bText.includes('cse') && !bText.includes('computer')) {
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
      if (sort === 'placed') {
        filtered.sort((a, b) => (b.out?.students || 0) - (a.out?.students || 0));
      } else if (sort === 'pay') {
        filtered.sort((a, b) => (b.payRank || 0) - (a.payRank || 0));
      } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'latest') {
        filtered.sort((a, b) => (b.last || '').localeCompare(a.last || ''));
      }

      if (countEl) {
        countEl.textContent = \`Showing \${filtered.length} of \${companies.length} companies (Batch '\${batch.year.slice(2)})\`;
      }

      if (filtered.length === 0) {
        listEl.innerHTML = '';
        noResultsEl?.classList.remove('hidden');
        return;
      }

      noResultsEl?.classList.add('hidden');

      listEl.innerHTML = filtered.map((c, idx) => {
        const num = String(idx + 1).padStart(3, '0');
        const logo = c.logo 
          ? \`<img alt="\${c.name}" loading="lazy" width="34" height="34" class="shrink-0 object-contain rounded-md bg-panel p-0.5" src="\${c.logo}" />\`
          : \`<span class="grid size-[34px] shrink-0 place-items-center rounded-md bg-line font-display text-[15px] font-bold text-muted">\${c.name.charAt(0)}</span>\`;

        let chips = '';
        if (c.offers && c.offers.includes('internship')) chips += '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern</span>';
        if (c.offers && c.offers.includes('fulltime')) chips += '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';
        if (c.offers && c.offers.includes('ppo')) chips += '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>';

        const offersMade = (c.out && c.out.students) ? \`\${c.out.students} placed\` : (c.status || 'Active');
        const paySubtitle = c.payKind === 'Stipend' ? 'Monthly Stipend' : 'Advertised CTC';

        // Short CGPA text
        const cgpaShort = c.cgpaCriteria ? (c.cgpaCriteria.length > 22 ? c.cgpaCriteria.slice(0, 22) + '…' : c.cgpaCriteria) : 'Open';

        return \`
          <li>
            <a class="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 py-4 lg:grid-cols-[3rem_minmax(0,1fr)_8rem_10rem_8rem_9rem_9rem] lg:items-center lg:py-3.5 border-b border-line transition-colors" href="/companies/company.html?slug=\${c.slug}\${is2028 ? '&batch=2028' : ''}">
              <span aria-hidden="true" class="row-curtain absolute inset-y-0 -inset-x-4 z-0 origin-bottom scale-y-0 bg-fg transition-transform duration-[320ms] ease-[var(--ease)] group-hover:origin-top group-hover:scale-y-100 group-focus-visible:scale-y-100"></span>
              <span class="label num text-faint group-hover:text-bg max-lg:hidden relative z-10">\${num}</span>
              <span class="flex min-w-0 items-center gap-3 lg:gap-4 transition-transform duration-[350ms] ease-[var(--ease)] group-hover:translate-x-3 relative z-10">
                \${logo}
                <span class="truncate pb-[0.06em] font-display text-[clamp(20px,2.8vw,36px)] leading-[1.08] tracking-[-0.035em] text-fg group-hover:text-bg">\${c.name}</span>
              </span>
              <span class="flex flex-wrap gap-x-2 gap-y-1 group-hover:text-bg max-lg:col-span-2 max-lg:row-start-2 relative z-10">
                \${chips}
              </span>
              <span class="group-hover:text-bg max-lg:col-start-2 max-lg:row-start-1 max-lg:text-right relative z-10">
                <span class="num block text-[15px] text-fg group-hover:text-bg">\${c.pay || 'Competitive'}</span>
                <span class="label block text-[11px] text-faint group-hover:text-bg/60">\${paySubtitle}</span>
              </span>
              <span class="group-hover:text-bg max-lg:col-span-2 max-lg:row-start-3 max-lg:flex max-lg:gap-4 relative z-10">
                <span class="num block text-[15px] text-fg group-hover:text-bg">\${offersMade}</span>
                <span class="label block text-[11px] text-faint group-hover:text-bg/60">\${c.status || ''}</span>
              </span>
              <span class="label truncate text-muted group-hover:text-bg max-lg:hidden relative z-10" title="\${c.cgpaCriteria || ''}">\${cgpaShort}</span>
              <span class="label truncate text-muted group-hover:text-bg max-lg:hidden relative z-10">\${c.branches || 'All branches open'}</span>
            </a>
          </li>
        \`;
      }).join('');
    }

    searchInput?.addEventListener('input', renderCompanies);
    roleSelect?.addEventListener('change', renderCompanies);
    branchSelect?.addEventListener('change', renderCompanies);
    sortSelect?.addEventListener('change', renderCompanies);

    renderCompanies();
  `;

  const html = pageTemplate({
    title: `Companies · Placed · ${siteConfig.collegeShort}`,
    activePath: '/companies/',
    content,
    extraScript
  });

  fs.writeFileSync('companies/index.html', html);
  console.log('companies/index.html created successfully with Multi-Batch & Classified Criteria support!');
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
            <a id="back-to-companies-btn" class="label rounded-full border border-line-strong px-4 py-2 text-muted transition-colors hover:border-fg hover:text-fg" href="/companies/">
              ← Back to Companies
            </a>
          </div>
        </header>

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

        <!-- Official Eligibility & Drive Details Card -->
        <section class="mt-12 rounded-3xl border border-line-strong bg-panel p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
            <div>
              <p class="label text-faint">Official SPIT Placement Records</p>
              <h2 class="display-m mt-1 text-[22px] sm:text-[26px]">Recruitment Drive & Criteria</h2>
            </div>
            <div id="company-visit-badge" class="flex items-center gap-2 text-[13px] text-muted font-mono">
              <!-- Timeline Date Badge -->
            </div>
          </div>

          <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-2xl border border-line bg-bg/50 p-4">
              <span class="label text-[11px] text-faint block uppercase tracking-wider">Official CGPA Requirement</span>
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
    
    // Choose active batch from URL param or global
    const currentBatch = batchParam === '2028' || batchParam === '2027' ? batchParam : getBatchKey();
    const batchData = allBatches[currentBatch] || getActiveBatchData();
    const is2028 = currentBatch === '2028';

    // Find company in current batch first, then in alternate batch as fallback
    let company = batchData.companies.find(c => c.slug.toLowerCase() === slug);
    let matchedBatchYear = currentBatch;
    if (!company) {
      const altYear = currentBatch === '2028' ? '2027' : '2028';
      company = allBatches[altYear]?.companies.find(c => c.slug.toLowerCase() === slug);
      if (company) matchedBatchYear = altYear;
    }

    const loadingEl = document.getElementById('company-loading');
    const contentEl = document.getElementById('company-content');
    const notFoundEl = document.getElementById('company-not-found');

    if (!company) {
      loadingEl?.classList.add('hidden');
      notFoundEl?.classList.remove('hidden');
    } else {
      loadingEl?.classList.add('hidden');
      contentEl?.classList.remove('hidden');

      document.title = company.name + ' · Placed ’' + matchedBatchYear.slice(2) + ' · SPIT';

      // Breadcrumb & Links
      const bcLink = document.getElementById('breadcrumb-companies-link');
      const backBtn = document.getElementById('back-to-companies-btn');
      const targetHref = matchedBatchYear === '2028' ? '/companies/?batch=2028' : '/companies/';
      if (bcLink) bcLink.href = targetHref;
      if (backBtn) backBtn.href = targetHref;

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
      document.getElementById('stat-pay').textContent = company.pay || 'Competitive';
      document.getElementById('stat-pay-kind').textContent = company.payKind === 'Stipend' ? 'Monthly Stipend' : 'Annual CTC';
      
      document.getElementById('stat-total').textContent = company.out?.students || 0;
      const cohortLabel = document.getElementById('stat-cohort-label');
      if (cohortLabel) cohortLabel.textContent = "Batch '" + matchedBatchYear.slice(2) + " offers";

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

      // Detailed Criteria Box
      document.getElementById('detail-cgpa').textContent = company.cgpaCriteria || 'No minimum cutoff reported (good academic standing advised).';
      document.getElementById('detail-boards').textContent = company.boardsCriteria || 'Standard SPIT university eligibility criteria.';
      document.getElementById('detail-branches').textContent = company.branches || 'All Engineering branches eligible.';

      // Visit Date Badge
      const visitBadge = document.getElementById('company-visit-badge');
      if (visitBadge && (company.visitTimeline || company.first)) {
        visitBadge.innerHTML = '<span>📅 Drive Date:</span> <span class="text-fg">' + (company.visitTimeline || company.first) + '</span>';
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
                    <span class="text-faint">💰 Compensation Breakdown:</span>
                    <span class="font-medium">\${r.rawCompensation}</span>
                  </div>
                \` : ''}

                \${r.visitDate ? \`
                  <div class="text-[12px] text-muted font-mono flex items-center gap-1.5">
                    <span>📅 Timeline:</span>
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
        rolesEl.innerHTML = '<p class="text-muted">Standard campus roles advertised.</p>';
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
      }
    }
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
