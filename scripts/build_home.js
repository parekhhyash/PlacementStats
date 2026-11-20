const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateHomePage() {
  const sec1 = `
    <section class="wrap pb-10 pt-[clamp(56px,10vw,140px)]">
      <h1 id="hero-title" class="display-xl">
        ${siteConfig.stats.totalCompanies} companies so far.<br/>
        <span class="text-muted">${siteConfig.stats.studentsPlaced} students placed, and counting.</span>
      </h1>
      <p id="hero-desc" class="mt-10 max-w-[56ch] text-[18px] leading-relaxed text-muted">
        Every company that recruited ${siteConfig.collegeName}’s ${siteConfig.batchYear} batch on campus, from internships to final placements: what each one offered, what it advertised, roles, and selection outcomes.
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <a id="hero-browse-btn" class="label rounded-full bg-fg px-5 py-3 text-bg transition-opacity hover:opacity-85" href="/companies/">Browse all ${siteConfig.stats.totalCompanies} companies</a>
        <span class="label flex items-center gap-2.5 px-2 text-muted">
          <span class="relative flex size-2" aria-hidden="true">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-intern opacity-60"></span>
            <span class="relative inline-flex size-2 rounded-full bg-intern"></span>
          </span>
          <span id="hero-status-badge">Placements in progress</span>
        </span>
      </div>
    </section>
  `;

  // Section 01: Latest on campus (Dynamic SPIT companies)
  const sec3 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p class="label text-faint">01 — Latest</p>
          <h2 class="display-m mt-3 max-w-[18ch]">Latest on campus</h2>
        </div>
        <div class="flex flex-col justify-end gap-4 lg:items-start">
          <a id="latest-heading-link" class="label link-underline text-fg" href="/companies/">All ${siteConfig.stats.totalCompanies} companies →</a>
        </div>
      </div>
      <div class="mt-10">
        <div class="label hidden grid-cols-[3.5rem_minmax(0,1fr)_9rem_12rem_9rem_11rem] gap-4 border-b border-line py-3 text-faint lg:grid">
          <span>No.</span>
          <span>Company</span>
          <span>Offered</span>
          <span>Advertised pay</span>
          <span>Offers made</span>
          <span>Branches</span>
        </div>
        <ol id="home-latest-companies">
          <!-- Injected via script from active batch dataset -->
        </ol>

        <!-- Submit Company Data Modal for Home Page -->
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
                    <option value="CE" class="bg-[#121316] text-[#ededed]">Computer Engineering (CE)</option>
                    <option value="CSE" class="bg-[#121316] text-[#ededed]">Computer Science Engineering (CSE)</option>
                    <option value="EXTC" class="bg-[#121316] text-[#ededed]">Electronics and Telecommunications Engineering (EXTC)</option>
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
    </section>
  `;

  // Section 4: Recap teaser
  const sec4 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="mb-8 flex items-center justify-between gap-4 border-t border-line pt-6">
        <p class="label flex items-center gap-2.5 text-faint">
          <span class="relative flex size-2" aria-hidden="true">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-intern opacity-60"></span>
            <span class="relative inline-flex size-2 rounded-full bg-intern"></span>
          </span>
          Latest results
        </p>
        <a class="label link-underline text-fg" href="/stats/">Full stats →</a>
      </div>
      <section class="glow-ring rounded-[28px] p-px">
        <div class="relative overflow-hidden rounded-[27px] bg-bg p-5 sm:p-7">
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
            <div>
              <p id="home-recap-season" class="label text-muted">Stats · Marquee Recruiters · Season 2027</p>
              <h2 class="display-m mt-3">The flagship recruiters</h2>
            </div>
          </div>
          <div id="home-recap-cards" class="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </section>
    </section>
  `;

  // Section 02: Timeline
  const sec5 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p class="label text-faint">02 — Timeline</p>
          <h2 class="display-m mt-3 max-w-[18ch]">When companies came to campus</h2>
        </div>
        <div class="flex flex-col justify-end gap-4 lg:items-start">
          <a class="label link-underline text-fg" href="/timeline/">Full timeline →</a>
        </div>
      </div>
      <div class="mt-10">
        <div id="home-timeline-container" class="relative overflow-x-auto rounded-2xl border border-line-strong bg-panel p-6 [scrollbar-width:none]">
          <!-- Rendered dynamically based on active batch -->
        </div>
      </div>
    </section>
  `;

  // Section 03: Pay
  const sec6 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p class="label text-faint">03 — Offers</p>
          <h2 class="display-m mt-3 max-w-[18ch]">What the offers advertised</h2>
        </div>
        <div class="flex flex-col justify-end gap-4 lg:items-start">
          <a class="label link-underline text-fg" href="/offers/">All offers &amp; packages →</a>
        </div>
      </div>
      <div class="mt-10">
        <div id="home-pay-chips" class="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          <!-- Rendered dynamically -->
        </div>

        <div id="home-pay-tiers" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </section>
  `;

  // Section 04: Offers / Branch distribution
  const sec7 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p class="label text-faint">04 — Offers</p>
          <h2 class="display-m mt-3 max-w-[18ch]">Where students got offers</h2>
        </div>
        <div class="flex flex-col justify-end gap-4 lg:items-start">
          <a class="label link-underline text-fg" href="/stats/">Offers breakdown →</a>
        </div>
      </div>
      <div class="mt-10">
        <div id="home-top-hiring-companies" class="grid gap-4">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </section>
  `;

  // Section 05: Selectivity / Funnels
  const sec8 = `
    <section class="wrap mt-[clamp(56px,6.5vw,96px)]">
      <div class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p class="label text-faint">05 — Selectivity</p>
          <h2 class="display-m mt-3 max-w-[18ch]">How many made it through</h2>
        </div>
        <div class="flex flex-col justify-end gap-4 lg:items-start">
          <a class="label link-underline text-fg" href="/companies/">Browse all companies →</a>
        </div>
      </div>
      <div class="mt-10">
        <div id="home-funnels" class="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </section>
  `;

  const mainContent = `
    ${sec1}
    ${sec3}
    ${sec4}
    ${sec5}
    ${sec6}
    ${sec7}
    ${sec8}
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const totalComps = batch.companies ? batch.companies.length : (batch.stats?.totalCompanies || 33);
    const totalPlaced = batch.companies ? batch.companies.reduce((sum, c) => sum + (c.out?.students || 0), 0) : (batch.stats?.studentsPlaced || 267);

    // 1. Update Hero
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = \`
        \${totalComps} companies so far.<br/>
        <span class="text-muted">\${totalPlaced} students placed, and counting.</span>
      \`;
    }
    const heroDesc = document.getElementById('hero-desc');
    if (heroDesc) {
      heroDesc.textContent = \`Every company that recruited SPIT’s \${batch.year} batch on campus, from internships to final placements: what each one offered, what it advertised, roles, and selection outcomes.\`;
    }
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    if (heroBrowseBtn) {
      heroBrowseBtn.textContent = \`Browse all \${totalComps} companies\`;
      heroBrowseBtn.href = is2028 ? '/companies/?batch=2028' : '/companies/';
    }
    const heroStatusBadge = document.getElementById('hero-status-badge');
    if (heroStatusBadge) {
      heroStatusBadge.textContent = batch.statusBadge;
    }
    const latestHeadingLink = document.getElementById('latest-heading-link');
    if (latestHeadingLink) {
      latestHeadingLink.textContent = \`All \${totalComps} companies →\`;
      latestHeadingLink.href = is2028 ? '/companies/?batch=2028' : '/companies/';
    }

    // Helper to extract visit date timestamp for accurate chronological sorting
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

    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    // Quick Submission Modal Logic on Home Page
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

    // 2. Populate latest companies list based on visit date
    function renderLatestList() {
      const latestList = document.getElementById('home-latest-companies');
      if (!latestList) return;

      const sortedByVisit = [...batch.companies].filter(c => !c.isAmbiguous).sort((a, b) => {
        const diff = parseCompanyVisitTimestamp(b) - parseCompanyVisitTimestamp(a);
        if (diff !== 0) return diff;
        return (b.out?.students || 0) - (a.out?.students || 0);
      });

      const topCompanies = sortedByVisit.slice(0, 7);
      latestList.innerHTML = topCompanies.map((c, idx) => {
        const num = String(idx + 1).padStart(3, '0');
        const logo = c.logo ? '<img alt="' + c.name + '" loading="lazy" width="34" height="34" class="shrink-0 object-contain rounded-md bg-panel p-0.5" src="' + c.logo + '" />' : '<span class="grid size-[34px] shrink-0 place-items-center rounded-md bg-line font-display text-[15px] font-bold text-muted">' + c.name.charAt(0) + '</span>';
        
        let chips = '';
        if (c.offers && c.offers.includes('internship')) chips += '<span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern</span>';
        if (c.offers && c.offers.includes('fulltime')) chips += '<span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>';
        if (c.offers && c.offers.includes('ppo')) chips += '<span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>';

        let offersMain = '—';
        let offersSub = '&nbsp;';
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
        const hasOffers = totalOffersCount > 0 || c.isAmbiguous;
        const isNoDetails = !hasOffers || c.noDetailsAvailable;

        if (c.isAmbiguous) {
          offersMain = String(c.out?.students || 25);
          offersSub = 'Estimated';
        } else if (totalOffersCount > 0) {
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
        }

        const paySubtitle = c.paySubtext || (c.payKind === 'Stipend' ? 'Monthly Stipend' : 'Advertised CTC');

        return \`
          <li>
            <a class="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 py-4 lg:grid-cols-[3.5rem_minmax(0,1fr)_9rem_12rem_9rem_11rem] lg:items-center lg:py-3.5 border-b border-line" href="/companies/company.html?slug=\${c.slug}\${is2028 ? '&batch=2028' : ''}\${isNoDetails ? '&submit=1' : ''}">
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
              <span class="group-hover:text-bg max-lg:col-span-2 max-lg:row-start-3 max-lg:flex max-lg:items-baseline max-lg:gap-2.5 relative z-10">
                \${hasOffers ? \`
                  <span class="num block text-[15px] font-medium text-fg group-hover:text-bg">\${offersMain}</span>
                  <span class="label block text-[11px] text-faint group-hover:text-bg/60 normal-case">\${offersSub}</span>
                \` : \`
                  <button type="button" class="btn-open-quick-sub text-left label block group-hover:text-bg cursor-pointer hover:underline relative z-20" data-slug="\${c.slug}" data-name="\${c.name}">
                    <span class="text-amber-400 font-medium text-[13px] block leading-tight">No details available</span>
                    <span class="text-[11px] text-intern group-hover:text-bg/80 font-normal block mt-0.5">Submit data if you have →</span>
                  </button>
                \`}
              </span>
              <span class="label truncate text-muted group-hover:text-bg max-lg:hidden relative z-10">\${c.branches || 'All branches open'}</span>
            </a>
          </li>
        \`;
      }).join('');

      latestList.querySelectorAll('.btn-open-quick-sub').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const compName = btn.getAttribute('data-name');
          openQuickSubmitModal(compName);
        });
      });
    }

    renderLatestList();

    // Background live Supabase sync
    async function syncLiveHome() {
      try {
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
            rows.forEach(d => {
              const mapped = {
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
              const idx = batch.companies.findIndex(c => c.slug === d.slug);
              if (idx >= 0) {
                batch.companies[idx] = Object.assign(batch.companies[idx], mapped);
              } else {
                batch.companies.push(mapped);
              }
            });
            renderLatestList();

            // Keep hero metrics synchronized with live Supabase data
            const liveTotalComps = batch.companies.length;
            const liveTotalPlaced = batch.companies.reduce((sum, c) => sum + (c.out?.students || 0), 0);
            if (heroTitle) {
              heroTitle.innerHTML = \`
                \${liveTotalComps} companies so far.<br/>
                <span class="text-muted">\${liveTotalPlaced} students placed, and counting.</span>
              \`;
            }
            if (heroBrowseBtn) {
              heroBrowseBtn.textContent = \`Browse all \${liveTotalComps} companies\`;
            }
            if (latestHeadingLink) {
              latestHeadingLink.textContent = \`All \${liveTotalComps} companies →\`;
            }
          }
        }
      } catch (e) {}
    }
    syncLiveHome();

    // 4. Populate Marquee Cards
    const recapSeason = document.getElementById('home-recap-season');
    if (recapSeason) {
      recapSeason.textContent = \`Stats · Flagship Recruiters · Season \${batch.year}\`;
    }
    const recapCards = document.getElementById('home-recap-cards');
    if (recapCards) {
      if (is2028) {
        recapCards.innerHTML = \`
          <div class="rounded-2xl border border-line-strong bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Barclays</h4>
                <p class="text-[12px] text-muted">25 selections (16 Interns + 9 Dev)</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>₹75k/mo</span>
              <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>₹15.05 LPA</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line-strong bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/mastercard.svg" alt="Mastercard" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Mastercard</h4>
                <p class="text-[12px] text-muted">9 software intern selections</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>₹50k/mo</span>
              <span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO Opportunity</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line-strong bg-panel p-4 col-span-2 sm:col-span-1">
            <div class="flex items-center gap-3">
              <img src="/logos/general-mills.png" alt="General Mills" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">General Mills & IBM</h4>
                <p class="text-[12px] text-muted">11 combined summer offers</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Gen Mills: 6</span>
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>IBM: 5</span>
            </div>
          </div>
        \`;
      } else {
        recapCards.innerHTML = \`
          <div class="rounded-2xl border border-line-strong bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/phonepe.png" alt="PhonePe" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">PhonePe</h4>
                <p class="text-[12px] text-muted">6 SDEs · ₹33.0 LPA (₹80k/mo)</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>Intern</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line-strong bg-panel p-4">
            <div class="flex items-center gap-3">
              <img src="/logos/jpmc.svg" alt="JPMC" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">JPMorgan Chase</h4>
                <p class="text-[12px] text-muted">31 selections · up to ₹1.60L/mo</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>5 Tracks</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line-strong bg-panel p-4 col-span-2 sm:col-span-1">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-8 object-contain" />
              <div>
                <h4 class="font-display font-medium text-fg">Barclays</h4>
                <p class="text-[12px] text-muted">28 total offers · ₹15.05 LPA &amp; ₹75k/mo</p>
              </div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="chip"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
              <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>₹75k/mo</span>
            </div>
          </div>
        \`;
      }
    }

    // 5. Timeline Chart Container
    const timelineContainer = document.getElementById('home-timeline-container');
    if (timelineContainer) {
      if (is2028) {
        timelineContainer.innerHTML = \`
          <div class="flex items-center justify-between pb-4 border-b border-line text-[13px] text-faint">
            <span>Drives by month: Sep – Nov 2026</span>
            <span class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-intern)"></i>Internships</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
            </span>
          </div>
          <div class="mt-6 grid grid-cols-3 gap-6 items-end h-[180px] pt-4 max-w-md mx-auto">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">1</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 30%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[11px] text-muted">Sep '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">3</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 90%;">
                <div style="height: 65%; background: var(--color-intern)"></div>
                <div style="height: 35%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-fg font-medium">Oct '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">1</span>
              <div class="w-full max-w-[60px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 30%;">
                <div style="height: 100%; background: var(--color-intern)"></div>
              </div>
              <span class="label text-[11px] text-muted">Nov '26</span>
            </div>
          </div>
        \`;
      } else {
        timelineContainer.innerHTML = \`
          <div class="flex items-center justify-between pb-4 border-b border-line text-[13px] text-faint">
            <span>Drives by month: Jun – Oct 2026</span>
            <span class="flex items-center gap-4">
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-intern)"></i>Internships</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-fulltime)"></i>Full-time</span>
              <span class="flex items-center gap-1.5"><i class="dot" style="background:var(--color-ppo)"></i>PPO</span>
            </span>
          </div>
          <div class="mt-6 grid grid-cols-5 gap-4 items-end h-[180px] pt-4">
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">2</span>
              <div class="w-full max-w-[50px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 18%;">
                <div style="height: 50%; background: var(--color-intern)"></div>
                <div style="height: 50%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-muted">Jun '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">11</span>
              <div class="w-full max-w-[50px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 100%;">
                <div style="height: 45%; background: var(--color-intern)"></div>
                <div style="height: 55%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-fg font-medium">Jul '26 (Peak)</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">6</span>
              <div class="w-full max-w-[50px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 55%;">
                <div style="height: 50%; background: var(--color-intern)"></div>
                <div style="height: 50%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-muted">Aug '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">5</span>
              <div class="w-full max-w-[50px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 45%;">
                <div style="height: 40%; background: var(--color-intern)"></div>
                <div style="height: 60%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-muted">Sep '26</span>
            </div>
            <div class="flex flex-col items-center gap-2 h-full justify-end">
              <span class="num text-[13px] text-fg font-medium">8</span>
              <div class="w-full max-w-[50px] bg-line rounded-t-lg overflow-hidden flex flex-col justify-end" style="height: 73%;">
                <div style="height: 25%; background: var(--color-intern)"></div>
                <div style="height: 75%; background: var(--color-fulltime)"></div>
              </div>
              <span class="label text-[11px] text-muted">Oct '26</span>
            </div>
          </div>
        \`;
      }
    }

    // 6. Pay chips & tiers
    const payChips = document.getElementById('home-pay-chips');
    if (payChips) {
      if (is2028) {
        payChips.innerHTML = \`
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="4 4"></line></svg>
            Median Stipend \${batch.stats.medianStipend}
          </span>
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="1 3"></line></svg>
            Average Stipend \${batch.stats.averageStipend}
          </span>
          <span class="chip text-fg">
            <i class="dot" style="background:var(--color-intern)"></i>
            Top Stipend \${batch.stats.highestStipend} (Barclays)
          </span>
          <span class="chip text-muted">
            <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"></circle></svg>
            \${companies.length} recruiting companies · 100% Summer Intern
          </span>
        \`;
      } else {
        payChips.innerHTML = \`
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="4 4"></line></svg>
            Median \${batch.stats.medianCTC}
          </span>
          <span class="chip text-fg">
            <svg width="18" height="10" aria-hidden="true"><line x1="1" x2="17" y1="5" y2="5" stroke="currentColor" stroke-dasharray="1 3"></line></svg>
            Average \${batch.stats.averageCTC}
          </span>
          <span class="chip text-fg">
            <i class="dot" style="background:var(--color-ppo)"></i>
            Highest \${batch.stats.highestCTC} (PhonePe)
          </span>
          <span class="chip text-fg">
            <i class="dot" style="background:var(--color-intern)"></i>
            Top Stipend \${batch.stats.highestStipend} (JPMC)
          </span>
        \`;
      }
    }

    const payTiers = document.getElementById('home-pay-tiers');
    if (payTiers) {
      if (is2028) {
        payTiers.innerHTML = \`
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Top Stipend</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Barclays</h4>
            <p class="text-[13px] text-muted mt-1">₹75,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">25 offers</span>
              <span class="label text-[12px] text-muted">Summer Intern</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Fintech & Quant</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Mastercard & Russell</h4>
            <p class="text-[13px] text-muted mt-1">₹50k – ₹60k / mo</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">14 offers</span>
              <span class="label text-[12px] text-muted">Mastercard: 9 · Russell: 5</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Global Sales</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">IBM</h4>
            <p class="text-[13px] text-muted mt-1">₹50,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">5 offers</span>
              <span class="label text-[12px] text-muted">Global Sales Intern</span>
            </div>
          </div>
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Enterprise</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">General Mills</h4>
            <p class="text-[13px] text-muted mt-1">₹35,000 / month</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">6 offers</span>
              <span class="label text-[12px] text-muted">Digital & Tech Intern</span>
            </div>
          </div>
        \`;
      } else {
        payTiers.innerHTML = \`
          <div class="rounded-2xl border border-line bg-panel p-5">
            <span class="label text-faint">Tier 1</span>
            <h4 class="font-display text-[22px] font-semibold text-fg mt-1">Super Dream</h4>
            <p class="text-[13px] text-muted mt-1">&gt; ₹20 LPA</p>
            <div class="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span class="num text-[28px] font-bold text-fg">6 offers</span>
              <span class="label text-[12px] text-muted">PhonePe SDE (₹33.0L)</span>
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

    // 7. Top hiring companies
    const topHiringCompanies = document.getElementById('home-top-hiring-companies');
    if (topHiringCompanies) {
      if (is2028) {
        topHiringCompanies.innerHTML = \`
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">Barclays</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 100%; background: var(--color-fulltime)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">25 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/mastercard.svg" alt="Mastercard" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">Mastercard</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 36%; background: var(--color-intern)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">9 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/general-mills.png" alt="General Mills" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">General Mills</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 24%; background: var(--color-intern)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">6 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/ibm.svg" alt="IBM" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">IBM</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 20%; background: var(--color-intern)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">5 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/russell-investments.svg" alt="Russell Investments" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">Russell Investments</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 20%; background: var(--color-ppo)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">5 offers</span>
            </div>
          </div>
        \`;
      } else {
        topHiringCompanies.innerHTML = \`
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/jpmc.svg" alt="JPMC" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">JPMorgan Chase & Co.</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 100%; background: var(--color-ppo)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">31 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/barclays.png" alt="Barclays" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">Barclays</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 90%; background: var(--color-fulltime)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">28 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/iss-stoxx.svg" alt="ISS / STOXX" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">ISS / STOXX</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 48%; background: var(--color-fulltime)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">15 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/ubs.svg" alt="UBS" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">UBS</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 45%; background: var(--color-fulltime)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">14 offers</span>
            </div>
          </div>
          <div class="rounded-xl border border-line bg-panel p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logos/transunion.svg" alt="TransUnion" class="size-6 object-contain" />
              <span class="font-display font-medium text-fg">TransUnion</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-36 sm:w-64 h-2.5 bg-line rounded-full overflow-hidden">
                <div class="h-full rounded-full" style="width: 32%; background: var(--color-fulltime)"></div>
              </div>
              <span class="num text-[15px] font-semibold text-fg">10 offers</span>
            </div>
          </div>
        \`;
      }
    }

    // 8. Funnels
    const funnelsContainer = document.getElementById('home-funnels');
    if (funnelsContainer) {
      if (is2028) {
        funnelsContainer.innerHTML = \`
          <figure class="flex flex-col border-t border-line pt-4">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=barclays&batch=2028">Barclays</a>
              <span class="label num text-muted">25 offers (16 int + 9 dev)</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Online Assessment</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">240</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Round 1</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:29%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">70</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Final Interview</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:16%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">40</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Offers Extended</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:10.4%;background:var(--color-fulltime)"></span></span>
                <span class="num text-right text-fg font-bold">25</span>
              </li>
            </ol>
          </figure>

          <figure class="flex flex-col border-t border-line pt-4">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=mastercard&batch=2028">Mastercard</a>
              <span class="label num text-muted">9 offers</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Coding Assessment</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">180</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Interview</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:19%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">35</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Final HR</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:8%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">15</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Selected Interns</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:5%;background:var(--color-intern)"></span></span>
                <span class="num text-right text-fg font-bold">9</span>
              </li>
            </ol>
          </figure>

          <figure class="flex flex-col border-t border-line pt-4 col-span-2 md:col-span-1">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=general-mills&batch=2028">General Mills</a>
              <span class="label num text-muted">6 offers</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Aptitude & Coding</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">140</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Round</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:20%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">28</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Management Round</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:9%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">12</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Offers</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:4.2%;background:var(--color-intern)"></span></span>
                <span class="num text-right text-fg font-bold">6</span>
              </li>
            </ol>
          </figure>
        \`;
      } else {
        funnelsContainer.innerHTML = \`
          <figure class="flex flex-col border-t border-line pt-4">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=phonepe">PhonePe</a>
              <span class="label num text-muted">1 in 30 (6 SDEs)</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Shortlisted for test</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">180</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Round 1</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:25%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">45</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Final Interview</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:8%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">15</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Selected</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:3.3%;background:var(--color-ppo)"></span></span>
                <span class="num text-right text-fg font-bold">6</span>
              </li>
            </ol>
          </figure>

          <figure class="flex flex-col border-t border-line pt-4">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=jpmc">JPMorgan Chase</a>
              <span class="label num text-muted">31 selections across 5 tracks</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Applied / Resume</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">300+</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Online Assessment</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:40%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">122</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Rounds</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:20%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">61</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Offers Extended</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:10.3%;background:var(--color-fulltime)"></span></span>
                <span class="num text-right text-fg font-bold">31</span>
              </li>
            </ol>
          </figure>

          <figure class="flex flex-col border-t border-line pt-4 col-span-2 md:col-span-1">
            <figcaption class="flex items-baseline justify-between gap-4">
              <a class="font-display text-[22px] tracking-[-0.02em] hover:underline text-fg" href="/companies/company.html?slug=barclays">Barclays</a>
              <span class="label num text-muted">28 offers</span>
            </figcaption>
            <ol class="mt-4 grid gap-2">
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Online Assessment</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:100%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">220</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">Technical Round</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:34%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">75</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-muted">HR / Behavioral</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:19%;background:var(--color-line-strong)"></span></span>
                <span class="num text-right text-muted">42</span>
              </li>
              <li class="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
                <span class="truncate text-fg font-medium">Placed (Dev + Intern)</span>
                <span class="h-2.5"><span class="block h-full rounded-[2px]" style="width:12.7%;background:var(--color-intern)"></span></span>
                <span class="num text-right text-fg font-bold">28</span>
              </li>
            </ol>
          </figure>
        \`;
      }
    }
  `;

  const html = pageTemplate({
    title: "Placed ’27 · SPIT Placement Statistics & Campus Recruitment Analytics",
    description: `Explore verified Sardar Patel Institute of Technology (SPIT) placement data for Class of 2027 & 2028: ${siteConfig.stats.studentsPlaced} confirmed offers, ${siteConfig.stats.averageCTC} average CTC, ${siteConfig.stats.highestCTC} highest package, recruiter packages, and branch analytics.`,
    keywords: "Sardar Patel Institute of Technology (SPIT) placement data, SPIT placement statistics, SPIT placements 2027, Sardar Patel Institute of Technology placements, SPIT Mumbai average package, SPIT highest package, SPIT placement report, SPIT recruiters 2027, SPIT branchwise placement",
    activePath: '/',
    content: mainContent,
    extraScript
  });

  fs.writeFileSync('index.html', html);
  console.log('index.html created successfully with Multi-Batch support!');
}

generateHomePage();
