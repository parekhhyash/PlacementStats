const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateBranchesPage() {
  const content = `
    <!-- Full-page Container with Complete Blur and Centered Data Not Available Overlay -->
    <div class="relative min-h-[85vh] w-full overflow-hidden">
      <!-- 1. The whole branches page content underneath - deeply blurred, low opacity, unclickable, unselectable -->
      <div id="branches-blurred-content" class="filter blur-[16px] opacity-15 select-none pointer-events-none transition-all" aria-hidden="true" tabindex="-1">
        <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
          <p id="branches-page-badge" class="label text-muted">Branches · Pay and placement</p>
          <h1 class="display-l mt-6 max-w-[16ch]">Every branch, by the numbers.</h1>
          <p id="branches-page-desc" class="mt-8 max-w-[62ch] text-[17px] leading-relaxed text-muted">
            Pick a branch to see what its students were offered: the typical package, the spread from lowest to highest, how many are placed and who hired them.
          </p>
        </section>

        <div class="wrap">
          <!-- Branch Tab Buttons -->
          <div id="branch-tabs" role="tablist" class="-mx-1 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            <!-- Dynamic tabs rendered by script -->
          </div>

          <!-- Active Branch Card -->
          <div id="branch-active-card" class="relative mt-8 overflow-hidden rounded-3xl border border-line-strong bg-panel p-6 sm:p-10">
            <!-- Rendered dynamically -->
          </div>

          <!-- Side by Side Comparison Section -->
          <section class="mt-20 pb-16">
            <div class="border-t border-line pt-6">
              <p class="label text-faint">Comparison</p>
              <h2 class="display-m mt-3">Side by side</h2>
              <p class="mt-2 text-[15px] text-muted">Branch-wise comparative breakdown across key recruitment metrics.</p>
            </div>

            <div class="mt-8 overflow-x-auto">
              <table class="w-full text-left text-[14px]">
                <thead>
                  <tr class="border-b border-line text-faint label">
                    <th class="py-3 pr-4">Branch</th>
                    <th class="py-3 px-4">Batch size</th>
                    <th class="py-3 px-4">Placed students</th>
                    <th class="py-3 px-4">Placement rate</th>
                    <th class="py-3 px-4">Median CTC</th>
                    <th class="py-3 px-4">Average CTC</th>
                    <th class="py-3 px-4">Highest CTC</th>
                    <th class="py-3 pl-4">PPOs</th>
                  </tr>
                </thead>
                <tbody id="branch-table-body" class="divide-y divide-line">
                  <!-- Rendered dynamically -->
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <!-- 2. Full-page overlay: ONLY this card is sharp, visible and accessible -->
      <div class="absolute inset-0 z-20 flex items-center justify-center p-4 backdrop-blur-[6px] bg-bg/50">
        <div class="w-full max-w-[540px] rounded-3xl border border-line-strong bg-[#0e0f12]/95 p-8 sm:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center">
          <div class="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-5 border border-amber-500/20">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <p class="label font-mono text-[11px] text-faint tracking-wider uppercase">Official Department Records</p>
          <h2 class="display-m mt-2 text-[28px] sm:text-[32px] text-fg">Data not available</h2>
          <p class="mt-3 text-[14px] leading-relaxed text-muted max-w-[44ch] mx-auto">
            Official department-wise placement and salary breakdown reports have not yet been released or verified for this batch.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button type="button" id="btn-open-branch-submit" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-fg px-7 py-3.5 text-[13px] font-medium text-bg shadow-md transition-opacity hover:opacity-90 cursor-pointer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Submit data here if you have it</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Branch Data Submission Modal Dialog -->
    <div id="branch-submit-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div class="relative w-full max-w-[560px] rounded-3xl border border-line-strong bg-panel p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 class="font-display text-[20px] font-bold text-fg">Submit Branch Placement Data</h3>
            <p class="text-[13px] text-muted mt-1">Help complete branch statistics. Submissions are reviewed on the admin dashboard.</p>
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
                <option value="CSE" class="bg-[#121316] text-[#ededed]">Computer Engineering (CSE)</option>
                <option value="IT" class="bg-[#121316] text-[#ededed]">Information Technology (IT)</option>
                <option value="EXTC" class="bg-[#121316] text-[#ededed]">Electronics & Telecom (EXTC)</option>
                <option value="AIDS" class="bg-[#121316] text-[#ededed]">AI & Data Science (AI & DS)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Company Name *</label>
              <input id="modal-company-name" type="text" required placeholder="e.g. Barclays, JPMC, PhonePe..." class="w-full rounded-xl border border-line-strong bg-bg px-3.5 py-2.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Role Title & Type</label>
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

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const branches = batch.branches || [];

    const badgeEl = document.getElementById('branches-page-badge');
    if (badgeEl) {
      badgeEl.textContent = \`Branches · SPIT Class of \${batch.year}\`;
    }
    const descEl = document.getElementById('branches-page-desc');
    if (descEl) {
      descEl.textContent = \`Recruitment analytics for \${branches.length} departments across the \${batch.year} cohort: package distribution, selection volumes, and top recruiting firms.\`;
    }

    let selectedBranchId = branches[0]?.id || 'ce';

    const tabsContainer = document.getElementById('branch-tabs');
    const cardContainer = document.getElementById('branch-active-card');
    const tableBody = document.getElementById('branch-table-body');

    function renderTabs() {
      tabsContainer.innerHTML = branches.map(b => {
        const isSelected = b.id === selectedBranchId;
        const baseClass = "group relative flex shrink-0 items-center gap-2.5 rounded-full border px-4 py-2.5 transition-all duration-300 cursor-pointer ";
        const activeClass = isSelected 
          ? "border-fg bg-fg text-bg" 
          : "border-line-strong text-muted hover:border-fg hover:text-fg";

        return \`
          <button role="tab" type="button" data-id="\${b.id}" aria-selected="\${isSelected}" class="\${baseClass} \${activeClass}">
            <i class="dot" style="background:\${b.color}"></i>
            <span class="label">\${b.shortName}</span>
            <span class="num text-[12px] \${isSelected ? 'text-bg/70' : 'text-faint'}">\${b.placedPercentage}%</span>
          </button>
        \`;
      }).join('');

      // Add click events
      tabsContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedBranchId = btn.getAttribute('data-id');
          renderTabs();
          renderCard();
        });
      });
    }

    function renderCard() {
      const b = branches.find(item => item.id === selectedBranchId) || branches[0];
      if (!b) return;

      cardContainer.innerHTML = \`
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <i class="dot size-3" style="background:\${b.color}"></i>
              <h3 class="font-display text-[clamp(28px,4vw,44px)] font-bold text-fg leading-none">\${b.name}</h3>
            </div>
            <p class="mt-3 text-[16px] text-muted max-w-[50ch]">\${b.summary || 'Department placement report'}</p>
          </div>

          <div class="flex items-baseline gap-2 shrink-0">
            <span class="num font-display text-[clamp(48px,6vw,72px)] font-bold text-fg leading-none">\${b.placedPercentage}%</span>
            <span class="label text-muted">placed</span>
          </div>
        </div>

        <!-- 4-Column Branch Highlights -->
        <dl class="mt-10 grid grid-cols-2 border-t border-line sm:grid-cols-4 pt-6 gap-6">
          <div>
            <dt class="label text-faint text-[12px]">Placed Students</dt>
            <dd class="num font-display text-[28px] text-fg mt-1">\${b.placedStudents} <span class="text-[14px] text-muted font-sans font-normal">/ \${b.totalStudents}</span></dd>
          </div>
          <div>
            <dt class="label text-faint text-[12px]">Median CTC</dt>
            <dd class="num font-display text-[28px] text-fg mt-1">\${b.medianCTC}</dd>
          </div>
          <div>
            <dt class="label text-faint text-[12px]">Average CTC</dt>
            <dd class="num font-display text-[28px] text-fg mt-1">\${b.averageCTC}</dd>
          </div>
          <div>
            <dt class="label text-faint text-[12px]">Highest CTC</dt>
            <dd class="num font-display text-[28px] text-fg mt-1">\${b.highestCTC}</dd>
          </div>
        </dl>

        <!-- Top Recruiters in this Branch -->
        <div class="mt-10 border-t border-line pt-6">
          <p class="label text-faint text-[12px] mb-4">Top Recruiters for \${b.shortName}</p>
          <div class="flex flex-wrap gap-2.5">
            \${b.topRecruiters ? b.topRecruiters.map(r => \`
              <span class="chip text-fg font-medium bg-line/60">
                <i class="dot" style="background:\${b.color}"></i>
                \${r}
              </span>
            \`).join('') : '<span class="text-muted">Recruiters active</span>'}
          </div>
        </div>
      \`;
    }

    function renderTable() {
      tableBody.innerHTML = branches.map(b => \`
        <tr class="hover:bg-panel transition-colors cursor-pointer" data-row-id="\${b.id}">
          <td class="py-4 pr-4">
            <div class="flex items-center gap-2.5 font-medium text-fg">
              <i class="dot" style="background:\${b.color}"></i>
              \${b.name}
            </div>
          </td>
          <td class="py-4 px-4 num text-muted">\${b.totalStudents}</td>
          <td class="py-4 px-4 num text-fg font-semibold">\${b.placedStudents}</td>
          <td class="py-4 px-4 num text-fg font-bold">\${b.placedPercentage}%</td>
          <td class="py-4 px-4 num text-muted">\${b.medianCTC}</td>
          <td class="py-4 px-4 num text-muted">\${b.averageCTC}</td>
          <td class="py-4 px-4 num text-fg font-semibold">\${b.highestCTC}</td>
          <td class="py-4 pl-4 num text-muted">\${b.ppoCount || 0}</td>
        </tr>
      \`).join('');

      tableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          selectedBranchId = row.getAttribute('data-row-id');
          renderTabs();
          renderCard();
          window.scrollTo({ top: 120, behavior: 'smooth' });
        });
      });
    }

    renderTabs();
    renderCard();
    renderTable();

    // Supabase Submission Handler for Branch Data
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    const modal = document.getElementById('branch-submit-modal');
    const btnOpen = document.getElementById('btn-open-branch-submit');
    const btnClose = document.getElementById('btn-close-branch-submit');
    const btnCancel = document.getElementById('btn-cancel-branch-submit');
    const form = document.getElementById('branch-submit-form');
    const statusEl = document.getElementById('branch-submit-status');
    const spinner = document.getElementById('spinner-branch-submit');
    const submitBtn = document.getElementById('btn-submit-branch-data');
    const submitBtnText = document.getElementById('btn-submit-text');

    btnOpen?.addEventListener('click', () => {
      modal?.classList.remove('hidden');
      const modalBatch = document.getElementById('modal-batch-year');
      if (modalBatch && batch?.year) modalBatch.value = batch.year;
    });

    const closeModal = () => {
      modal?.classList.add('hidden');
      statusEl?.classList.add('hidden');
    };

    btnClose?.addEventListener('click', closeModal);
    btnCancel?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      submitBtn.disabled = true;
      spinner?.classList.remove('hidden');
      if (submitBtnText) submitBtnText.textContent = 'Submitting...';
      statusEl?.classList.add('hidden');

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

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to submit data');
        }

        statusEl.className = 'rounded-xl p-3 text-[13px] bg-intern/10 border border-intern/30 text-intern';
        statusEl.textContent = '✔ Thank you! Your branch data has been submitted and sent to the admin dashboard for verification.';
        statusEl.classList.remove('hidden');
        form.reset();
        setTimeout(() => {
          closeModal();
        }, 2500);
      } catch (err) {
        statusEl.className = 'rounded-xl p-3 text-[13px] bg-red-500/10 border border-red-500/30 text-red-300';
        statusEl.textContent = 'Submission error: ' + (err.message || 'Please try again.');
        statusEl.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        spinner?.classList.add('hidden');
        if (submitBtnText) submitBtnText.textContent = 'Submit Data';
      }
    });
  `;

  const html = pageTemplate({
    title: `Branches · Placed · ${siteConfig.collegeShort}`,
    activePath: '/branches/',
    content,
    extraScript
  });

  fs.writeFileSync('branches/index.html', html);
  console.log('branches/index.html created successfully with Multi-Batch support!');
}

generateBranchesPage();
