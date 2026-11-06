const fs = require('fs');
const path = require('path');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateAdminPage() {
  const content = `
    <div class="wrap pb-20 pt-[clamp(32px,5vw,64px)]">
      <!-- Admin Top Header -->
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div class="flex items-center gap-3">
            <span class="chip font-mono text-[11px] text-intern border-intern/40 bg-intern/10">Admin Workspace</span>
            <span class="label text-faint">Restricted Access</span>
          </div>
          <h1 class="display-l mt-2 leading-none">Placement Data Manager</h1>
          <p class="mt-2 text-[15px] text-muted">Add new recruiters, update compensation, configure eligibility criteria, and manage interview funnels.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Batch Selector -->
          <div class="inline-flex rounded-full border border-line-strong bg-panel p-1">
            <button id="batch-btn-2027" type="button" class="cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-fg text-bg">Batch '27</button>
            <button id="batch-btn-2028" type="button" class="cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg">Batch '28</button>
          </div>

          <a href="/companies/" target="_blank" class="label rounded-full border border-line-strong px-4 py-2 text-[13px] text-muted transition-colors hover:border-fg hover:text-fg">
            View Public Site ↗
          </a>
        </div>
      </div>

      <!-- Batch Overview Banner -->
      <div id="batch-overview-bar" class="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line-strong bg-panel/60 p-4 text-[13px]">
        <div class="flex flex-wrap items-center gap-6">
          <span class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-intern"></span>
            <span class="text-muted">Total Companies:</span>
            <strong id="summary-total-companies" class="num font-semibold text-fg">--</strong>
          </span>
          <span class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-ppo"></span>
            <span class="text-muted">Total Offers:</span>
            <strong id="summary-total-offers" class="num font-semibold text-fg">--</strong>
          </span>
          <span class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-fulltime"></span>
            <span class="text-muted">Active Batch:</span>
            <strong id="summary-active-batch" class="font-semibold text-fg">Class of 2027</strong>
          </span>
        </div>
        <div class="text-[12px] text-faint">
          All modifications automatically trigger real-time static re-compilation.
        </div>
      </div>

      <!-- Main Layout Grid: Sidebar Directory + Form Editor -->
      <div class="mt-8 grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        
        <!-- Left Sidebar: Companies Directory -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <input id="admin-search-input" type="search" placeholder="Search company or role..." class="w-full rounded-full border border-line-strong bg-panel px-4 py-2.5 text-[13px] text-fg outline-none transition-colors placeholder:text-faint focus:border-fg" />
            </div>
            <button id="btn-new-company" type="button" class="shrink-0 cursor-pointer rounded-full bg-fg px-4 py-2.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
              + New
            </button>
          </div>

          <div class="rounded-2xl border border-line-strong bg-panel overflow-hidden">
            <div class="border-b border-line px-4 py-3 flex items-center justify-between text-[12px] text-faint">
              <span id="directory-count">Companies list</span>
              <span>Click to edit</span>
            </div>
            <div id="admin-companies-list" class="max-h-[750px] divide-y divide-line overflow-y-auto">
              <!-- Rendered via script -->
              <div class="p-8 text-center text-[13px] text-muted">Loading companies...</div>
            </div>
          </div>
        </div>

        <!-- Right Workspace: Full Company Editor -->
        <div class="flex flex-col gap-6">
          <form id="company-editor-form" class="rounded-3xl border border-line-strong bg-panel p-6 sm:p-8" onsubmit="return false;">
            
            <!-- Editor Title Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
              <div>
                <div class="flex items-center gap-2.5">
                  <span id="editor-mode-badge" class="chip text-[11px] font-mono text-intern border-intern/30 bg-intern/10">Editing</span>
                  <h2 id="editor-title" class="display-m text-[24px] sm:text-[28px] leading-tight">Company Details</h2>
                </div>
                <p id="editor-subtitle" class="mt-1 text-[13px] text-muted">Configure corporate identity, roles, packages, eligibility, and funnels.</p>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <a id="btn-view-live" href="#" target="_blank" class="hidden label rounded-full border border-line px-3.5 py-2 text-[12px] text-muted hover:border-fg hover:text-fg">
                  View Live ↗
                </a>
                <button id="btn-delete-company" type="button" class="hidden cursor-pointer label rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-[12px] text-red-400 hover:bg-red-500/20 transition-colors">
                  Delete
                </button>
                <button id="btn-reset-form" type="button" class="cursor-pointer label rounded-full border border-line-strong px-3.5 py-2 text-[12px] text-muted hover:border-fg hover:text-fg transition-colors">
                  Clear
                </button>
                <button id="btn-save-company" type="button" class="cursor-pointer label rounded-full bg-fg px-5 py-2 text-[13px] font-semibold text-bg transition-opacity hover:opacity-90 flex items-center gap-2">
                  <span>Save & Rebuild</span>
                </button>
              </div>
            </div>

            <!-- Tab Navigation inside Form -->
            <div class="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
              <button type="button" class="tab-btn active cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-fg text-bg" data-tab="tab-basics">1. Identity & Pay</button>
              <button type="button" class="tab-btn cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg" data-tab="tab-criteria">2. Criteria & Dates</button>
              <button type="button" class="tab-btn cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg" data-tab="tab-roles">3. Roles & CTC (<span id="tab-roles-count">0</span>)</button>
              <button type="button" class="tab-btn cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg" data-tab="tab-funnel">4. Selection Funnel</button>
            </div>

            <!-- Tab 1: Identity & Pay -->
            <div id="tab-basics" class="tab-content mt-6 space-y-6">
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Company Name *</label>
                  <input id="field-name" type="text" required placeholder="e.g. JPMorgan Chase & Co. or PhonePe" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Slug (URL Identifier) *</label>
                  <input id="field-slug" type="text" required placeholder="e.g. jpmc or phonepe" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg font-mono" />
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-3">
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Advertised Pay Display</label>
                  <input id="field-pay" type="text" placeholder="e.g. ₹33 LPA or ₹1.60L / mo" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Pay Kind</label>
                  <select id="field-pay-kind" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg">
                    <option value="CTC">Annual CTC (LPA)</option>
                    <option value="Stipend">Monthly Stipend (/ mo)</option>
                  </select>
                </div>
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Pay Sort Rank (Numeric)</label>
                  <input id="field-pay-rank" type="number" placeholder="e.g. 3300 or 160000" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg font-mono" />
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Logo Path or URL</label>
                  <div class="flex items-center gap-2">
                    <input id="field-logo" type="text" placeholder="e.g. /logos/phonepe.png" class="flex-1 rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg font-mono text-[13px]" />
                    <div id="field-logo-preview" class="size-10 shrink-0 rounded-lg border border-line bg-bg p-1 flex items-center justify-center overflow-hidden">
                      <span class="text-[10px] text-faint">Preview</span>
                    </div>
                  </div>
                  <p class="mt-1 text-[11px] text-faint">Saved in /logos/ directory (SVG or PNG recommended).</p>
                </div>
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Status Headline</label>
                  <input id="field-status" type="text" placeholder="e.g. 6 confirmed offers or Selections announced" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg" />
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2 border-t border-line pt-5">
                <div>
                  <span class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Recruitment Offer Types</span>
                  <div class="flex flex-wrap items-center gap-4 text-[13px]">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input id="check-offer-intern" type="checkbox" class="accent-intern" />
                      <span>Internship</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input id="check-offer-fulltime" type="checkbox" class="accent-fulltime" />
                      <span>Full-time</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input id="check-offer-ppo" type="checkbox" class="accent-ppo" />
                      <span>PPO Pathway</span>
                    </label>
                  </div>
                </div>
                <div>
                  <span class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Tier Classification</span>
                  <label class="flex items-center gap-2 cursor-pointer text-[13px]">
                    <input id="check-dream" type="checkbox" class="accent-ppo" />
                    <span>Dream / Super Dream Recruiter (&gt; ₹14 LPA or &gt; ₹75k/mo stipend)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Tab 2: Criteria & Dates -->
            <div id="tab-criteria" class="tab-content mt-6 space-y-6 hidden">
              <div>
                <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Eligible Engineering Branches</label>
                <input id="field-branches" type="text" placeholder="e.g. All branches open or CSE, IT, AI & DS" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg" />
                <div class="mt-2 flex flex-wrap gap-2 text-[12px] text-muted">
                  <button type="button" class="btn-quick-branch chip cursor-pointer hover:border-fg">All branches open</button>
                  <button type="button" class="btn-quick-branch chip cursor-pointer hover:border-fg">CSE, IT, AI & DS</button>
                  <button type="button" class="btn-quick-branch chip cursor-pointer hover:border-fg">CSE, IT, AI & DS, EXTC</button>
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Official CGPA Requirement</label>
                  <textarea id="field-cgpa-criteria" rows="3" placeholder="e.g. 8.0+; No official cutoff (good CGPA beneficial); 6.75 on Superset" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[13px] text-fg outline-none transition-colors focus:border-fg leading-relaxed"></textarea>
                </div>
                <div>
                  <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Class X & XII Boards Criteria</label>
                  <textarea id="field-boards-criteria" rows="3" placeholder="e.g. 80% in Class XII (before resume review); Standard SPIT eligibility" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[13px] text-fg outline-none transition-colors focus:border-fg leading-relaxed"></textarea>
                </div>
              </div>

              <div>
                <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Campus Visit Schedule & Timeline</label>
                <input id="field-timeline" type="text" placeholder="e.g. PPT 24 Jun, OA 27 Jun, Interviews 2-3 Jul 2026" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none transition-colors focus:border-fg font-mono text-[13px]" />
              </div>

              <div>
                <label class="label block text-[11px] text-faint uppercase tracking-wider mb-2">Placement Cell Verification Notes & Confidence</label>
                <textarea id="field-notes" rows="3" placeholder="e.g. Verified from official SPIT placement PDFs. 9 candidates interviewed, all selected." class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[13px] text-fg outline-none transition-colors focus:border-fg leading-relaxed"></textarea>
              </div>
            </div>

            <!-- Tab 3: Roles & Packages -->
            <div id="tab-roles" class="tab-content mt-6 space-y-6 hidden">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display text-[18px] text-fg font-medium">Recruitment Roles</h3>
                  <p class="text-[12px] text-muted">Add one or multiple distinct offerings (e.g. SDE, Data Analyst, Banking).</p>
                </div>
                <button id="btn-add-role" type="button" class="cursor-pointer rounded-full border border-line-strong bg-panel px-4 py-1.5 text-[12px] font-medium text-fg hover:border-fg transition-colors">
                  + Add Role
                </button>
              </div>

              <div id="roles-repeater-container" class="space-y-4">
                <!-- Dynamic role forms -->
              </div>
            </div>

            <!-- Tab 4: Funnel & Stages -->
            <div id="tab-funnel" class="tab-content mt-6 space-y-6 hidden">
              <!-- Smart Quick-Parse Pipeline String -->
              <div class="rounded-2xl border border-line bg-bg/50 p-4">
                <label class="label block text-[11px] text-faint uppercase tracking-wider mb-1.5">Quick Pipeline Parser</label>
                <p class="text-[12px] text-muted mb-3">Paste a round trail like <code class="font-mono text-fg">OA 310 -> Tech R1 26 -> Tech R2 16 -> Hiring Manager 9 -> 6 offers</code> to auto-generate the stage list.</p>
                <div class="flex items-center gap-2">
                  <input id="field-funnel-raw" type="text" placeholder="e.g. OA 150 -> Tech R1 30 -> Tech R2 15 -> HR 8 -> 6 offers" class="flex-1 rounded-xl border border-line-strong bg-bg px-4 py-2 text-[13px] font-mono text-fg outline-none transition-colors focus:border-fg" />
                  <button id="btn-parse-funnel" type="button" class="shrink-0 cursor-pointer rounded-xl bg-panel border border-line-strong px-4 py-2 text-[12px] font-medium text-fg hover:border-fg transition-colors">
                    Parse Pipeline
                  </button>
                </div>
              </div>

              <!-- Stages Table / Repeater -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="label text-[11px] text-faint uppercase tracking-wider">Recruitment Stages & Shortlisted Candidates</label>
                  <button id="btn-add-stage" type="button" class="cursor-pointer text-[12px] text-intern hover:underline">
                    + Add Stage
                  </button>
                </div>

                <div id="stages-repeater-container" class="space-y-2.5">
                  <!-- Dynamic stage rows -->
                </div>
              </div>

              <!-- Live Funnel Preview -->
              <div class="border-t border-line pt-6">
                <h4 class="label text-[11px] text-faint uppercase tracking-wider mb-4">Live Funnel Visual Preview</h4>
                <div id="funnel-live-preview" class="rounded-2xl border border-line bg-bg/40 p-5 space-y-3">
                  <p class="text-[13px] text-muted text-center py-4">Add stages above to see live visual preview.</p>
                </div>
              </div>
            </div>

            <!-- Footer Save Actions Bar -->
            <div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line pt-6">
              <span id="form-save-status" class="text-[13px] text-muted">Ready to edit or save.</span>
              <div class="flex items-center gap-3">
                <button id="btn-save-bottom" type="button" class="cursor-pointer label rounded-full bg-fg px-6 py-2.5 text-[14px] font-semibold text-bg transition-opacity hover:opacity-90">
                  Save Company & Rebuild Site
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <div id="admin-toast" class="fixed bottom-6 right-6 z-50 transform transition-all duration-300 translate-y-20 opacity-0 pointer-events-none rounded-2xl border border-line-strong bg-panel px-5 py-3.5 shadow-2xl flex items-center gap-3">
      <span id="toast-icon" class="text-[18px]">✔</span>
      <span id="toast-message" class="text-[13px] text-fg font-medium">Notification</span>
    </div>
  `;

  const extraScript = `
    let currentBatch = '2027';
    let allCompanies = [];
    let activeCompanySlug = null;
    let rolesData = [];
    let stagesData = [];

    // DOM Elements
    const batch2027Btn = document.getElementById('batch-btn-2027');
    const batch2028Btn = document.getElementById('batch-btn-2028');
    const listContainer = document.getElementById('admin-companies-list');
    const searchInput = document.getElementById('admin-search-input');
    const btnNewCompany = document.getElementById('btn-new-company');
    const btnSaveTop = document.getElementById('btn-save-company');
    const btnSaveBottom = document.getElementById('btn-save-bottom');
    const btnDelete = document.getElementById('btn-delete-company');
    const btnReset = document.getElementById('btn-reset-form');
    const btnViewLive = document.getElementById('btn-view-live');
    const formStatus = document.getElementById('form-save-status');

    // Load Companies from API
    async function loadBatchData(batch) {
      currentBatch = batch;
      if (batch === '2027') {
        batch2027Btn.classList.add('bg-fg', 'text-bg');
        batch2027Btn.classList.remove('text-muted');
        batch2028Btn.classList.remove('bg-fg', 'text-bg');
        batch2028Btn.classList.add('text-muted');
        document.getElementById('summary-active-batch').textContent = "Class of 2027";
      } else {
        batch2028Btn.classList.add('bg-fg', 'text-bg');
        batch2028Btn.classList.remove('text-muted');
        batch2027Btn.classList.remove('bg-fg', 'text-bg');
        batch2027Btn.classList.add('text-muted');
        document.getElementById('summary-active-batch').textContent = "Class of 2028";
      }

      listContainer.innerHTML = '<div class="p-8 text-center text-[13px] text-muted">Loading companies...</div>';
      try {
        const res = await fetch('/api/companies?batch=' + batch);
        const data = await res.json();
        if (data.success) {
          allCompanies = data.companies || [];
          updateSummaryMetrics();
          renderCompaniesList();
          // Select first company by default if none selected
          if (allCompanies.length > 0 && !activeCompanySlug) {
            selectCompany(allCompanies[0].slug);
          } else if (activeCompanySlug) {
            const exists = allCompanies.some(c => c.slug === activeCompanySlug);
            if (exists) selectCompany(activeCompanySlug);
            else resetForm();
          }
        }
      } catch (err) {
        listContainer.innerHTML = '<div class="p-8 text-center text-[13px] text-red-400">Failed to load companies: ' + err.message + '</div>';
      }
    }

    function updateSummaryMetrics() {
      document.getElementById('summary-total-companies').textContent = allCompanies.length;
      const totalOffers = allCompanies.reduce((acc, c) => acc + (c.out?.students || 0), 0);
      document.getElementById('summary-total-offers').textContent = totalOffers;
      document.getElementById('directory-count').textContent = allCompanies.length + ' companies';
    }

    function renderCompaniesList() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const filtered = allCompanies.filter(c => {
        if (!q) return true;
        const mName = c.name.toLowerCase().includes(q);
        const mRole = c.roles && c.roles.some(r => r.title.toLowerCase().includes(q));
        const mPay = c.pay && c.pay.toLowerCase().includes(q);
        return mName || mRole || mPay;
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = '<div class="p-8 text-center text-[13px] text-muted">No companies match query.</div>';
        return;
      }

      listContainer.innerHTML = filtered.map(c => {
        const isActive = c.slug === activeCompanySlug;
        const logo = c.logo 
          ? \`<img alt="" class="size-6 object-contain rounded-md shrink-0 bg-panel p-0.5" src="\${c.logo}" />\`
          : \`<span class="size-6 grid place-items-center rounded-md bg-line text-[11px] font-bold text-muted">\${c.name.charAt(0)}</span>\`;

        return \`
          <button type="button" class="company-list-item w-full cursor-pointer px-4 py-3 text-left transition-colors flex items-center justify-between gap-3 \${isActive ? 'bg-line-strong/60 border-l-2 border-fg' : 'hover:bg-line/40'}" data-slug="\${c.slug}">
            <div class="flex items-center gap-3 min-w-0">
              \${logo}
              <div class="truncate">
                <span class="block text-[14px] font-medium text-fg truncate">\${c.name}</span>
                <span class="block text-[11px] text-faint truncate">\${c.pay || 'Competitive'} · \${c.out?.students || 0} placed</span>
              </div>
            </div>
            \${c.dream ? '<span class="chip text-[10px] text-ppo border-ppo/30 shrink-0">Dream</span>' : ''}
          </button>
        \`;
      }).join('');

      // Add click listeners
      listContainer.querySelectorAll('.company-list-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = btn.getAttribute('data-slug');
          selectCompany(s);
        });
      });
    }

    function selectCompany(slug) {
      activeCompanySlug = slug;
      renderCompaniesList();

      const company = allCompanies.find(c => c.slug === slug);
      if (!company) return;

      document.getElementById('editor-mode-badge').textContent = 'Editing: ' + company.name;
      document.getElementById('editor-mode-badge').className = 'chip text-[11px] font-mono text-intern border-intern/30 bg-intern/10';
      document.getElementById('editor-title').textContent = company.name;
      document.getElementById('editor-subtitle').textContent = "Slug: " + company.slug + " · " + (company.status || '');

      btnViewLive.classList.remove('hidden');
      btnViewLive.href = '/companies/company.html?slug=' + company.slug + (currentBatch === '2028' ? '&batch=2028' : '');
      btnDelete.classList.remove('hidden');

      // Populate basic fields
      document.getElementById('field-name').value = company.name || '';
      document.getElementById('field-slug').value = company.slug || '';
      document.getElementById('field-pay').value = company.pay || '';
      document.getElementById('field-pay-kind').value = company.payKind || 'CTC';
      document.getElementById('field-pay-rank').value = company.payRank || '';
      document.getElementById('field-logo').value = company.logo || '';
      updateLogoPreview(company.logo);

      document.getElementById('field-status').value = company.status || '';
      document.getElementById('check-offer-intern').checked = company.offers?.includes('internship') || false;
      document.getElementById('check-offer-fulltime').checked = company.offers?.includes('fulltime') || false;
      document.getElementById('check-offer-ppo').checked = company.offers?.includes('ppo') || false;
      document.getElementById('check-dream').checked = Boolean(company.dream);

      // Criteria
      document.getElementById('field-branches').value = company.branches || '';
      document.getElementById('field-cgpa-criteria').value = company.cgpaCriteria || '';
      document.getElementById('field-boards-criteria').value = company.boardsCriteria || '';
      document.getElementById('field-timeline').value = company.visitTimeline || company.first || '';
      document.getElementById('field-notes').value = company.notes || '';

      // Roles
      rolesData = JSON.parse(JSON.stringify(company.roles || []));
      renderRolesRepeater();

      // Funnel
      document.getElementById('field-funnel-raw').value = company.funnelRaw || '';
      stagesData = JSON.parse(JSON.stringify(company.stages || []));
      renderStagesRepeater();
      renderFunnelPreview();

      formStatus.textContent = "Loaded " + company.name;
    }

    function resetForm() {
      activeCompanySlug = null;
      renderCompaniesList();

      document.getElementById('editor-mode-badge').textContent = 'New Company';
      document.getElementById('editor-mode-badge').className = 'chip text-[11px] font-mono text-fg border-fg/30 bg-fg/10';
      document.getElementById('editor-title').textContent = 'Create New Company';
      document.getElementById('editor-subtitle').textContent = 'Add a new recruitment organization to Batch ' + currentBatch;

      btnViewLive.classList.add('hidden');
      btnDelete.classList.add('hidden');

      // Clear fields
      document.getElementById('field-name').value = '';
      document.getElementById('field-slug').value = '';
      document.getElementById('field-pay').value = '';
      document.getElementById('field-pay-kind').value = 'CTC';
      document.getElementById('field-pay-rank').value = '';
      document.getElementById('field-logo').value = '';
      updateLogoPreview('');
      document.getElementById('field-status').value = '';
      document.getElementById('check-offer-intern').checked = true;
      document.getElementById('check-offer-fulltime').checked = true;
      document.getElementById('check-offer-ppo').checked = false;
      document.getElementById('check-dream').checked = false;

      document.getElementById('field-branches').value = 'All branches open';
      document.getElementById('field-cgpa-criteria').value = '';
      document.getElementById('field-boards-criteria').value = 'Standard SPIT eligibility';
      document.getElementById('field-timeline').value = '';
      document.getElementById('field-notes').value = '';

      rolesData = [
        {
          title: "Graduate Engineer",
          type: "fulltime",
          count: 5,
          ctc: "₹12 LPA",
          stipend: null,
          rawCompensation: "Base CTC 12 LPA",
          visitDate: "",
          notes: "",
          funnelRaw: ""
        }
      ];
      renderRolesRepeater();

      stagesData = [
        { name: "Online Coding Assessment (OA)", count: 150 },
        { name: "Technical Interview Round 1", count: 30 },
        { name: "HR & Culture-Fit Interview", count: 10 },
        { name: "Offers Extended", count: 5 }
      ];
      document.getElementById('field-funnel-raw').value = '';
      renderStagesRepeater();
      renderFunnelPreview();

      formStatus.textContent = "New company form ready.";
    }

    // Logo preview helper
    function updateLogoPreview(src) {
      const container = document.getElementById('field-logo-preview');
      if (src) {
        container.innerHTML = '<img src="' + src + '" class="size-full object-contain" onerror="this.onerror=null;this.parentElement.innerHTML=\\'?\\'" />';
      } else {
        container.innerHTML = '<span class="text-[10px] text-faint">None</span>';
      }
    }
    document.getElementById('field-logo')?.addEventListener('input', (e) => {
      updateLogoPreview(e.target.value);
    });

    // Auto slug from name
    document.getElementById('field-name')?.addEventListener('input', (e) => {
      if (!activeCompanySlug) {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        document.getElementById('field-slug').value = val;
        if (!document.getElementById('field-logo').value) {
          document.getElementById('field-logo').value = '/logos/' + val + '.svg';
          updateLogoPreview('/logos/' + val + '.svg');
        }
      }
    });

    // Quick Branch Buttons
    document.querySelectorAll('.btn-quick-branch').forEach(b => {
      b.addEventListener('click', () => {
        document.getElementById('field-branches').value = b.textContent;
      });
    });

    // Roles Repeater Logic
    function renderRolesRepeater() {
      const container = document.getElementById('roles-repeater-container');
      document.getElementById('tab-roles-count').textContent = rolesData.length;

      if (rolesData.length === 0) {
        container.innerHTML = '<p class="text-[13px] text-muted py-4 text-center">No roles added yet. Click "+ Add Role" above.</p>';
        return;
      }

      container.innerHTML = rolesData.map((r, idx) => \`
        <div class="role-card rounded-2xl border border-line bg-bg/50 p-4 sm:p-5 relative" data-index="\${idx}">
          <div class="flex items-center justify-between border-b border-line pb-3 mb-4">
            <span class="label text-[11px] text-faint uppercase tracking-wider font-mono">Role #\${idx + 1}</span>
            <button type="button" class="btn-remove-role cursor-pointer text-[12px] text-red-400 hover:text-red-300" data-index="\${idx}">
              Remove Role
            </button>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <label class="label block text-[11px] text-faint mb-1.5">Role Title *</label>
              <input type="text" class="role-input-title w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${r.title || ''}" placeholder="e.g. SDE or Financial Analyst" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Type</label>
              <select class="role-input-type w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg">
                <option value="fulltime" \${r.type === 'fulltime' ? 'selected' : ''}>Full-time</option>
                <option value="internship" \${r.type === 'internship' ? 'selected' : ''}>Internship</option>
                <option value="both" \${r.type === 'both' ? 'selected' : ''}>Dual (Intern + PPO)</option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-3 mt-3">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Confirmed Offers Count *</label>
              <input type="number" class="role-input-count w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg font-mono" value="\${r.count || 1}" min="1" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Advertised CTC</label>
              <input type="text" class="role-input-ctc w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${r.ctc || ''}" placeholder="e.g. ₹16 LPA" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Monthly Stipend</label>
              <input type="text" class="role-input-stipend w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${r.stipend || ''}" placeholder="e.g. ₹60k / mo" />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 mt-3">
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Compensation Breakdown</label>
              <input type="text" class="role-input-rawcomp w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${r.rawCompensation || ''}" placeholder="e.g. 14L fixed + 2L joining bonus" />
            </div>
            <div>
              <label class="label block text-[11px] text-faint mb-1.5">Role Timeline Date</label>
              <input type="text" class="role-input-date w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg font-mono text-[12px]" value="\${r.visitDate || ''}" placeholder="e.g. 14 Oct 2026" />
            </div>
          </div>

          <div class="mt-3">
            <label class="label block text-[11px] text-faint mb-1.5">Role Notes / Confidence</label>
            <input type="text" class="role-input-notes w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${r.notes || ''}" placeholder="e.g. Verified via PDF; includes PPO pathway" />
          </div>
        </div>
      \`).join('');

      // Bind events to update rolesData on input
      container.querySelectorAll('.role-card').forEach(card => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        card.querySelector('.role-input-title').addEventListener('input', e => rolesData[idx].title = e.target.value);
        card.querySelector('.role-input-type').addEventListener('change', e => rolesData[idx].type = e.target.value);
        card.querySelector('.role-input-count').addEventListener('input', e => rolesData[idx].count = parseInt(e.target.value, 10) || 0);
        card.querySelector('.role-input-ctc').addEventListener('input', e => rolesData[idx].ctc = e.target.value);
        card.querySelector('.role-input-stipend').addEventListener('input', e => rolesData[idx].stipend = e.target.value);
        card.querySelector('.role-input-rawcomp').addEventListener('input', e => rolesData[idx].rawCompensation = e.target.value);
        card.querySelector('.role-input-date').addEventListener('input', e => rolesData[idx].visitDate = e.target.value);
        card.querySelector('.role-input-notes').addEventListener('input', e => rolesData[idx].notes = e.target.value);

        card.querySelector('.btn-remove-role').addEventListener('click', () => {
          rolesData.splice(idx, 1);
          renderRolesRepeater();
        });
      });
    }

    document.getElementById('btn-add-role')?.addEventListener('click', () => {
      rolesData.push({
        title: "Software Engineer",
        type: "fulltime",
        count: 1,
        ctc: "₹12 LPA",
        stipend: null,
        rawCompensation: "",
        visitDate: "",
        notes: "",
        funnelRaw: ""
      });
      renderRolesRepeater();
    });

    // Funnel & Stages Repeater Logic
    function renderStagesRepeater() {
      const container = document.getElementById('stages-repeater-container');
      if (stagesData.length === 0) {
        container.innerHTML = '<p class="text-[13px] text-muted py-2">No stages defined. Use the Quick Pipeline parser above or click "+ Add Stage".</p>';
        return;
      }

      container.innerHTML = stagesData.map((s, idx) => \`
        <div class="stage-row flex items-center gap-3" data-index="\${idx}">
          <span class="label text-[11px] text-faint font-mono w-6 text-right shrink-0">#\${idx + 1}</span>
          <input type="text" class="stage-name-input flex-1 rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg" value="\${s.name || ''}" placeholder="Stage Name (e.g. Online Assessment)" />
          <input type="number" class="stage-count-input w-24 rounded-lg border border-line-strong bg-panel px-3 py-2 text-[13px] text-fg outline-none focus:border-fg font-mono text-right" value="\${s.count || 0}" placeholder="Count" />
          <button type="button" class="btn-remove-stage cursor-pointer text-muted hover:text-red-400 p-1" title="Remove stage">✕</button>
        </div>
      \`).join('');

      container.querySelectorAll('.stage-row').forEach(row => {
        const idx = parseInt(row.getAttribute('data-index'), 10);
        row.querySelector('.stage-name-input').addEventListener('input', e => {
          stagesData[idx].name = e.target.value;
          renderFunnelPreview();
        });
        row.querySelector('.stage-count-input').addEventListener('input', e => {
          stagesData[idx].count = parseInt(e.target.value, 10) || 0;
          renderFunnelPreview();
        });
        row.querySelector('.btn-remove-stage').addEventListener('click', () => {
          stagesData.splice(idx, 1);
          renderStagesRepeater();
          renderFunnelPreview();
        });
      });
    }

    function renderFunnelPreview() {
      const container = document.getElementById('funnel-live-preview');
      if (stagesData.length === 0) {
        container.innerHTML = '<p class="text-[13px] text-muted text-center py-4">No stages to preview.</p>';
        return;
      }

      const maxVal = stagesData[0]?.count || 100;
      container.innerHTML = stagesData.map((s, idx) => {
        const pct = Math.max(Math.round(((s.count || 0) / maxVal) * 100), 4);
        const isLast = idx === stagesData.length - 1;
        return \`
          <div class="grid grid-cols-[12rem_1fr_4rem] items-center gap-4 text-[13px]">
            <span class="truncate \${isLast ? 'text-fg font-semibold' : 'text-muted'}">\${s.name || 'Stage'}</span>
            <div class="h-2.5 w-full bg-line rounded-full overflow-hidden">
              <div class="h-full \${isLast ? 'bg-intern' : 'bg-fg'} rounded-full transition-all duration-300" style="width: \${pct}%"></div>
            </div>
            <span class="num text-right font-medium \${isLast ? 'text-intern font-bold' : 'text-fg'}">\${s.count || 0}</span>
          </div>
        \`;
      }).join('');
    }

    document.getElementById('btn-add-stage')?.addEventListener('click', () => {
      stagesData.push({ name: "Technical Round", count: 10 });
      renderStagesRepeater();
      renderFunnelPreview();
    });

    // Quick Pipeline Parser
    document.getElementById('btn-parse-funnel')?.addEventListener('click', () => {
      const rawText = document.getElementById('field-funnel-raw')?.value || '';
      if (!rawText.trim()) return;

      const parts = rawText.split('->').map(s => s.trim()).filter(Boolean);
      const newStages = [];

      parts.forEach((p, idx) => {
        const numMatch = p.match(/(\d+)/);
        let count = numMatch ? parseInt(numMatch[1], 10) : 10;
        let name = p;

        if (idx === parts.length - 1) name = 'Offers Extended';
        else if (/OA|online assessment/i.test(p)) name = 'Online Coding Assessment (OA)';
        else if (/GD|group discussion/i.test(p)) name = 'Group Discussion (GD)';
        else if (/HR|culture/i.test(p)) name = 'HR & Culture-Fit Interview';
        else if (/manager/i.test(p)) name = 'Hiring Manager Round';
        else if (/resume|shortlist/i.test(p)) name = 'Resume Shortlist';
        else if (/tech/i.test(p)) {
          if (/2/i.test(p)) name = 'Technical Interview Round 2';
          else if (/3/i.test(p)) name = 'Technical Interview Round 3';
          else name = 'Technical Interview Round 1';
        }

        newStages.push({ name, count });
      });

      if (newStages.length > 0) {
        stagesData = newStages;
        renderStagesRepeater();
        renderFunnelPreview();
        showToast('Parsed ' + newStages.length + ' stages from pipeline!');
      }
    });

    // Tab Switching inside Form
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active', 'bg-fg', 'text-bg');
          b.classList.add('text-muted');
        });
        btn.classList.add('active', 'bg-fg', 'text-bg');
        btn.classList.remove('text-muted');

        const targetTab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(targetTab)?.classList.remove('hidden');
      });
    });

    // Toast Notification System
    function showToast(msg, isError = false) {
      const toast = document.getElementById('admin-toast');
      const icon = document.getElementById('toast-icon');
      const text = document.getElementById('toast-message');

      icon.textContent = isError ? '⚠' : '✔';
      icon.className = isError ? 'text-red-400 text-[18px]' : 'text-intern text-[18px]';
      text.textContent = msg;

      toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      }, 3500);
    }

    // Save Company to Server
    async function saveCompanyHandler() {
      const name = document.getElementById('field-name').value.trim();
      const slug = document.getElementById('field-slug').value.trim();

      if (!name || !slug) {
        showToast('Company Name and Slug are required!', true);
        return;
      }

      formStatus.textContent = "Saving company and rebuilding site...";
      btnSaveTop.disabled = true;
      btnSaveBottom.disabled = true;

      // Collect offers
      const offers = [];
      if (document.getElementById('check-offer-intern').checked) offers.push('internship');
      if (document.getElementById('check-offer-fulltime').checked) offers.push('fulltime');
      if (document.getElementById('check-offer-ppo').checked) offers.push('ppo');

      const companyPayload = {
        name,
        slug,
        offers,
        seasons: ["TE", "BE"],
        pay: document.getElementById('field-pay').value.trim() || 'Competitive',
        payKind: document.getElementById('field-pay-kind').value,
        payRank: parseInt(document.getElementById('field-pay-rank').value, 10) || 1000,
        dream: document.getElementById('check-dream').checked,
        logo: document.getElementById('field-logo').value.trim() || ('/logos/' + slug + '.svg'),
        status: document.getElementById('field-status').value.trim() || '',
        branches: document.getElementById('field-branches').value.trim() || 'All branches open',
        cgpaCriteria: document.getElementById('field-cgpa-criteria').value.trim(),
        boardsCriteria: document.getElementById('field-boards-criteria').value.trim(),
        visitTimeline: document.getElementById('field-timeline').value.trim(),
        notes: document.getElementById('field-notes').value.trim(),
        funnelRaw: document.getElementById('field-funnel-raw').value.trim(),
        roles: rolesData,
        stages: stagesData
      };

      try {
        const res = await fetch('/api/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch: currentBatch, company: companyPayload })
        });

        const result = await res.json();
        if (result.success) {
          showToast(result.message || 'Saved successfully!');
          formStatus.textContent = 'Saved at ' + new Date().toLocaleTimeString();
          // Reload batch data and select the saved company
          await loadBatchData(currentBatch);
          selectCompany(slug);
        } else {
          showToast(result.error || 'Save failed', true);
          formStatus.textContent = 'Error: ' + result.error;
        }
      } catch (err) {
        showToast('Network error: ' + err.message, true);
        formStatus.textContent = 'Network error: ' + err.message;
      } finally {
        btnSaveTop.disabled = false;
        btnSaveBottom.disabled = false;
      }
    }

    // Delete Company Handler
    async function deleteCompanyHandler() {
      if (!activeCompanySlug) return;
      const comp = allCompanies.find(c => c.slug === activeCompanySlug);
      const conf = confirm(\`Are you sure you want to delete '\${comp?.name || activeCompanySlug}' from Batch '\${currentBatch.slice(2)}?\`);
      if (!conf) return;

      try {
        const res = await fetch('/api/company?slug=' + activeCompanySlug + '&batch=' + currentBatch, {
          method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
          showToast(\`Company '\${activeCompanySlug}' deleted successfully.\`);
          resetForm();
          await loadBatchData(currentBatch);
        } else {
          showToast(result.error || 'Failed to delete company', true);
        }
      } catch (err) {
        showToast('Error deleting: ' + err.message, true);
      }
    }

    // Event Bindings
    batch2027Btn.addEventListener('click', () => loadBatchData('2027'));
    batch2028Btn.addEventListener('click', () => loadBatchData('2028'));
    searchInput.addEventListener('input', renderCompaniesList);
    btnNewCompany.addEventListener('click', resetForm);
    btnReset.addEventListener('click', resetForm);
    btnSaveTop.addEventListener('click', saveCompanyHandler);
    btnSaveBottom.addEventListener('click', saveCompanyHandler);
    btnDelete.addEventListener('click', deleteCompanyHandler);

    // Ctrl+S / Cmd+S Keyboard Shortcut
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCompanyHandler();
      }
    });

    // Initial Load
    loadBatchData('2027');
  `;

  const html = pageTemplate({
    title: `Placement Admin Portal · SPIT`,
    activePath: '/admin/',
    content,
    extraScript
  });

  const adminDir = path.resolve(__dirname, '..', 'admin');
  if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(path.join(adminDir, 'index.html'), html);
  console.log('admin/index.html created successfully!');
}

generateAdminPage();
