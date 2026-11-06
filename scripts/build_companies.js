const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateCompaniesPage() {
  const content = `
    <div vt-update="none">
      <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
        <p id="companies-page-badge" class="label text-muted">Companies · Detailed statistics</p>
        <h1 class="display-l mt-6 max-w-[16ch]">Every company, every offer.</h1>
      </section>

      <div class="wrap">
        <dl class="grid grid-cols-2 border-t border-line" style="--cols:5">
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Offered internships</dt>
            <dd id="stat-internships" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">--</dd>
            <dd id="stat-internships-sub" class="label order-3 mt-1 text-[11px] text-faint">--</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Hired full-time</dt>
            <dd id="stat-fulltime" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">--</dd>
            <dd id="stat-fulltime-sub" class="label order-3 mt-1 text-[11px] text-faint">--</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Average CTC</dt>
            <dd id="stat-avg-ctc" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">--</dd>
            <dd id="stat-avg-ctc-sub" class="label order-3 mt-1 text-[11px] text-faint">--</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r">
            <dt class="order-2 mt-2 text-muted">Median CTC</dt>
            <dd id="stat-med-ctc" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">--</dd>
            <dd id="stat-med-ctc-sub" class="label order-3 mt-1 text-[11px] text-faint">--</dd>
          </div>
          <div class="flex flex-col border-b border-line py-5 pr-4 max-lg:[&:nth-child(odd)]:border-r max-lg:[&:nth-child(even)]:pl-4 lg:border-b-0 lg:px-5 lg:first:pl-0 lg:[&:not(:last-child)]:border-r max-lg:col-span-2 max-lg:!border-r-0">
            <dt class="order-2 mt-2 text-muted">Average, full-time only</dt>
            <dd id="stat-avg-ft" class="num order-1 font-display text-[clamp(30px,3.2vw,48px)] leading-[1.05] tracking-[-0.035em]">--</dd>
            <dd id="stat-avg-ft-sub" class="label order-3 mt-1 text-[11px] text-faint">--</dd>
          </div>
          <style>@media (min-width:1024px){dl[style*="--cols"]{grid-template-columns:repeat(var(--cols),minmax(0,1fr))}}</style>
        </dl>
      </div>

      <div class="wrap mt-12">
        <div>
          <div class="sticky top-16 z-20 -mx-[var(--gutter)] border-b border-line bg-bg/90 px-[var(--gutter)] pb-4 pt-4 backdrop-blur-md">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label class="flex h-10 w-full min-w-0 shrink-0 items-center gap-3 rounded-full border lg:w-auto lg:flex-1 border-line-strong px-4 transition-colors focus-within:border-fg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-muted" aria-hidden="true">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-3.5-3.5"></path>
                </svg>
                <input id="company-search" type="search" placeholder="Search companies" aria-label="Search companies" class="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint" value="" />
              </label>

              <div class="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Role</span>
                    <span class="font-medium" id="role-val">All</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="role-filter" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full">
                    <option value="all">All</option>
                    <option value="internship">Intern</option>
                    <option value="fulltime">Full-time</option>
                    <option value="ppo">PPO</option>
                  </select>
                </div>

                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Branch</span>
                    <span class="font-medium" id="branch-val">Any</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="branch-filter" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full">
                    <option value="all">Any</option>
                    <option value="cse">CSE</option>
                    <option value="it">IT</option>
                    <option value="extc">EXTC</option>
                    <option value="aids">AI &amp; DS</option>
                  </select>
                </div>

                <div class="relative shrink-0">
                  <button type="button" aria-haspopup="listbox" aria-expanded="false" class="flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors border-line-strong hover:border-faint">
                    <span class="text-muted">Sort</span>
                    <span class="font-medium" id="sort-val">Latest</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="transition-transform"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
                  </button>
                  <select id="sort-order" class="absolute inset-0 cursor-pointer opacity-0 w-full h-full">
                    <option value="latest">Latest</option>
                    <option value="placed">Selections</option>
                    <option value="pay">Highest CTC</option>
                    <option value="name">Name</option>
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
        </div>
      </div>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const companies = batch.companies || [];

    // Header badge
    const badgeEl = document.getElementById('companies-page-badge');
    if (badgeEl) {
      badgeEl.textContent = \`Companies · SPIT Class of \${batch.year}\`;
    }

    // Populate Top KPI Summary Stats
    const statInternships = document.getElementById('stat-internships');
    const statInternshipsSub = document.getElementById('stat-internships-sub');
    const statFulltime = document.getElementById('stat-fulltime');
    const statFulltimeSub = document.getElementById('stat-fulltime-sub');
    const statAvgCtc = document.getElementById('stat-avg-ctc');
    const statAvgCtcSub = document.getElementById('stat-avg-ctc-sub');
    const statMedCtc = document.getElementById('stat-med-ctc');
    const statMedCtcSub = document.getElementById('stat-med-ctc-sub');
    const statAvgFt = document.getElementById('stat-avg-ft');
    const statAvgFtSub = document.getElementById('stat-avg-ft-sub');

    if (is2028) {
      if (statInternships) statInternships.textContent = '5';
      if (statInternshipsSub) statInternshipsSub.textContent = '5 with a PPO path';
      if (statFulltime) statFulltime.textContent = '1';
      if (statFulltimeSub) statFulltimeSub.textContent = 'Early summer drives';
      if (statAvgCtc) statAvgCtc.innerHTML = '₹14.2<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statAvgCtcSub) statAvgCtcSub.textContent = '5 drives with selections';
      if (statMedCtc) statMedCtc.innerHTML = '₹14<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statMedCtcSub) statMedCtcSub.textContent = 'Range ₹13–15.05 LPA';
      if (statAvgFt) statAvgFt.innerHTML = '₹15.05<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statAvgFtSub) statAvgFtSub.textContent = '45 total selections announced';
    } else {
      const internCount = companies.filter(c => c.offers && c.offers.includes('internship')).length;
      const ppoCount = companies.filter(c => c.offers && c.offers.includes('ppo')).length;
      const ftCount = companies.filter(c => c.offers && c.offers.includes('fulltime')).length;
      const bothCount = companies.filter(c => c.offers && c.offers.includes('internship') && c.offers.includes('fulltime')).length;

      if (statInternships) statInternships.textContent = internCount || '23';
      if (statInternshipsSub) statInternshipsSub.textContent = \`\${ppoCount || 19} with a PPO path\`;
      if (statFulltime) statFulltime.textContent = ftCount || '17';
      if (statFulltimeSub) statFulltimeSub.textContent = \`\${bothCount || 11} offered both\`;
      if (statAvgCtc) statAvgCtc.innerHTML = '₹18.6<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statAvgCtcSub) statAvgCtcSub.textContent = '29 drives with selections';
      if (statMedCtc) statMedCtc.innerHTML = '₹15<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statMedCtcSub) statMedCtcSub.textContent = 'Range ₹6–44 LPA';
      if (statAvgFt) statAvgFt.innerHTML = '₹19.2<span class="ml-[0.2em] font-sans text-[0.4em] font-medium tracking-normal text-muted">LPA</span>';
      if (statAvgFtSub) statAvgFtSub.textContent = 'Median ₹15 LPA · 287 offers in all';
    }

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
          const matchRoles = c.roles && c.roles.some(r => (r.title && r.title.toLowerCase().includes(q)) || (r.notes && r.notes.toLowerCase().includes(q)));
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
          if (bText.includes('all branches') || bText.includes('all')) {
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
        if (!q && role === 'all' && branch === 'all') {
          countEl.textContent = \`All \${companies.length} companies\`;
        } else {
          countEl.textContent = \`Showing \${filtered.length} of \${companies.length} companies\`;
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

        let paySubtitle = '&nbsp;';
        if (c.pay && c.pay !== 'Not disclosed') {
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

        if (c.out && c.out.fulltimeOffers && c.out.internships) {
          offersMain = \`\${c.out.fulltimeOffers} full-time\`;
          offersSub = \`\${c.out.internships} internships\`;
        } else if (c.out && c.out.fulltimeOffers) {
          offersMain = \`\${c.out.fulltimeOffers} full-time\`;
          offersSub = '&nbsp;';
        } else if (c.out && c.out.internships) {
          offersMain = '—';
          offersSub = \`\${c.out.internships} internships\`;
        } else if (c.out && c.out.students) {
          offersMain = \`\${c.out.students} placed\`;
          offersSub = '&nbsp;';
        } else if (c.status) {
          offersMain = c.status;
          offersSub = '&nbsp;';
        }

        const logoHtml = c.logo 
          ? \`<img alt="" aria-hidden="true" loading="lazy" width="34" height="34" decoding="async" class="shrink-0 object-contain max-h-[34px] max-w-[70px]" src="\${c.logo}" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden');" /><span class="hidden grid size-[34px] shrink-0 place-items-center rounded bg-line font-display text-[15px] font-bold text-muted">\${c.name.charAt(0)}</span>\`
          : \`<span class="grid size-[34px] shrink-0 place-items-center rounded bg-line font-display text-[15px] font-bold text-muted">\${c.name.charAt(0)}</span>\`;

        return \`
          <li style="view-transition-name:c-\${c.slug};view-transition-class:row">
            <a class="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-b border-line py-4 lg:grid-cols-[3.5rem_minmax(0,1fr)_9rem_12rem_9rem_11rem] lg:items-center lg:py-3.5" href="/companies/company.html?slug=\${c.slug}\${is2028 ? '&batch=2028' : ''}">
              <span aria-hidden="true" class="absolute inset-y-0 -inset-x-[var(--gutter)] -z-10 origin-bottom scale-y-0 bg-fg transition-transform duration-[350ms] ease-[var(--ease)] group-hover:origin-top group-hover:scale-y-100 group-focus-visible:scale-y-100"></span>
              <span class="label num text-faint group-hover:text-bg max-lg:hidden">\${num}</span>
              <span class="flex min-w-0 items-center gap-3 lg:gap-4 transition-transform duration-[350ms] ease-[var(--ease)] group-hover:translate-x-3">
                \${logoHtml}
                <span class="truncate pb-[0.06em] font-display leading-[1.08] tracking-[-0.035em] group-hover:text-bg text-[clamp(26px,3.6vw,54px)]">\${c.name}</span>
              </span>
              <span class="flex flex-wrap gap-x-3 gap-y-1 group-hover:text-bg max-lg:col-span-2 max-lg:row-start-2">
                \${chips}
              </span>
              <span class="group-hover:text-bg max-lg:col-start-2 max-lg:row-start-1 max-lg:text-right">
                <span class="num block text-[15px]">\${c.pay || 'Not disclosed'}</span>
                <span class="label block text-[11px] text-faint group-hover:text-bg/60">\${paySubtitle}</span>
              </span>
              <span class="group-hover:text-bg max-lg:col-span-2 max-lg:row-start-3 max-lg:flex max-lg:gap-4 \${(!hasOffers && !c.status) ? 'max-lg:hidden' : ''}">
                <span class="num block text-[15px]">\${offersMain}</span>
                <span class="label block text-[11px] text-faint group-hover:text-bg/60">\${offersSub}</span>
              </span>
              <span class="label truncate text-muted group-hover:text-bg max-lg:hidden">\${c.branches || 'All branches'}</span>
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
