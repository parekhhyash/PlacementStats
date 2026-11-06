const fs = require('fs');
const path = require('path');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateAdminPage() {
  const content = `
    <!-- 1. Authentication Login Gate Screen (Shown when logged out) -->
    <div id="admin-login-screen" class="wrap flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div class="w-full max-w-[440px] rounded-3xl border border-line-strong bg-panel p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div class="text-center">
          <span class="inline-flex size-14 items-center justify-center rounded-2xl bg-fg/10 text-fg mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <p class="label font-mono text-[11px] text-intern tracking-wider uppercase">Placed · SPIT Portal</p>
          <h1 class="display-m mt-2 text-[26px]">Admin Workspace</h1>
          <p class="mt-2 text-[14px] text-muted leading-relaxed">Enter your administrator credentials to access and manage placement datasets.</p>
        </div>

        <form id="admin-login-form" class="mt-8 flex flex-col gap-4" onsubmit="return false;">
          <div id="login-error-banner" class="hidden rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[13px] text-red-300">
            <!-- Error message text -->
          </div>

          <div>
            <label class="label block text-[11px] text-faint mb-1.5 uppercase tracking-wider">Username or Email</label>
            <input id="login-username" type="text" autocomplete="username" value="" required class="w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-[14px] text-fg outline-none transition-colors focus:border-fg" placeholder="Username" />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label block text-[11px] text-faint uppercase tracking-wider">Password</label>
              <button type="button" id="btn-toggle-login-pass" class="text-[11px] text-muted hover:text-fg">Show</button>
            </div>
            <div class="relative">
              <input id="login-password" type="password" autocomplete="current-password" required class="w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-[14px] text-fg outline-none transition-colors focus:border-fg" placeholder="Enter password" />
            </div>
          </div>

          <div class="flex items-center justify-between text-[12px] text-muted mt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" id="login-remember" checked class="rounded border-line-strong bg-bg" />
              <span>Remember this session</span>
            </label>
          </div>

          <button id="btn-submit-login" type="submit" class="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-fg font-medium text-bg transition-opacity hover:opacity-90 cursor-pointer">
            <span id="login-btn-text">Sign In to Workspace</span>
            <span id="login-btn-spinner" class="hidden ml-2 size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
          </button>
        </form>

        <div class="mt-6 border-t border-line pt-4 text-center">
          <p class="text-[11px] text-faint flex items-center justify-center gap-1.5">
            <span class="size-1.5 rounded-full bg-intern"></span>
            <span>Secured with Supabase Postgres Authentication</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Protected Admin Workspace Dashboard (Shown only when authenticated) -->
    <div id="admin-workspace-dashboard" class="hidden wrap pb-20 pt-[clamp(32px,5vw,64px)]">
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
          <!-- Live Supabase Status Badge -->
          <div class="hidden sm:flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-[11px] text-muted font-mono">
            <span class="size-2 rounded-full bg-intern animate-pulse"></span>
            <span id="db-status-badge">Supabase Connected</span>
          </div>

          <!-- Batch Selector -->
          <div class="inline-flex rounded-full border border-line-strong bg-panel p-1">
            <button id="batch-btn-2027" type="button" class="cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-fg text-bg">Batch '27</button>
            <button id="batch-btn-2028" type="button" class="cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg">Batch '28</button>
          </div>

          <!-- User Badge & Logout -->
          <div class="flex items-center gap-2">
            <span class="label text-[12px] text-muted hidden md:inline">User: <strong id="admin-user-display" class="text-fg">Admin</strong></span>
            <button id="btn-admin-logout" type="button" class="label cursor-pointer rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] text-muted transition-colors hover:border-fg hover:text-fg">
              Sign Out
            </button>
          </div>

          <a href="/companies/" target="_blank" class="label rounded-full border border-line-strong px-4 py-2 text-[13px] text-muted transition-colors hover:border-fg hover:text-fg">
            View Public Site ↗
          </a>
        </div>
      </div>

      <!-- Admin Workspace Navigation Tabs -->
      <div class="mt-6 flex border-b border-line gap-2 overflow-x-auto [scrollbar-width:none]">
        <button id="nav-btn-companies" type="button" class="admin-main-nav-btn active flex items-center gap-2 border-b-2 border-fg px-4 py-3 text-[14px] font-semibold text-fg transition-colors cursor-pointer" data-view="view-companies">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <span>Companies & Drives</span>
          <span id="badge-companies-count" class="rounded-full bg-line px-2 py-0.5 text-[11px] font-mono">--</span>
        </button>

        <button id="nav-btn-branch-submissions" type="button" class="admin-main-nav-btn flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-[14px] font-medium text-muted hover:text-fg transition-colors cursor-pointer" data-view="view-branch-submissions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <span>Branch Submissions</span>
          <span id="badge-branch-submissions" class="rounded-full bg-intern/20 text-intern font-bold px-2 py-0.5 text-[11px] font-mono">0</span>
        </button>

        <button id="nav-btn-reports" type="button" class="admin-main-nav-btn flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-[14px] font-medium text-muted hover:text-fg transition-colors cursor-pointer" data-view="view-reports">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          <span>Reports & Feedback</span>
          <span id="badge-reports" class="rounded-full bg-ppo/20 text-ppo font-bold px-2 py-0.5 text-[11px] font-mono">0</span>
        </button>
      </div>

      <!-- VIEW 1: Companies & Drives Manager -->
      <div id="view-companies" class="admin-view-tab">
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
          All modifications sync live to Supabase Postgres database.
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
            <button id="btn-open-import" type="button" class="shrink-0 cursor-pointer rounded-full border border-line-strong bg-panel px-3.5 py-2.5 text-[13px] font-medium text-fg transition-colors hover:border-fg hover:bg-line/50" title="Import from CSV or JSON">
              <span class="hidden sm:inline">Import</span> CSV/JSON
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
                <button id="btn-editor-open-import" type="button" class="cursor-pointer rounded-full border border-line-strong px-4 py-2 text-[12px] font-medium text-muted hover:border-fg hover:text-fg transition-colors inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Import CSV / JSON</span>
                </button>
                <a id="btn-view-live" href="#" target="_blank" class="hidden label rounded-full border border-line px-3.5 py-2 text-[12px] text-muted hover:border-fg hover:text-fg">
                  View Live ↗
                </a>
                <button id="btn-save-company-top" type="button" class="cursor-pointer rounded-full bg-fg px-5 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">
                  Save Changes
                </button>
              </div>
            </div>

            <!-- Editor Navigation Tabs -->
            <div class="mt-6 flex border-b border-line overflow-x-auto [scrollbar-width:none]">
              <button type="button" class="tab-btn active border-b-2 border-fg px-4 py-2.5 text-[13px] font-medium text-fg transition-colors" data-tab="tab-overview">
                1. Overview & Identity
              </button>
              <button type="button" class="tab-btn border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium text-muted hover:text-fg transition-colors" data-tab="tab-eligibility">
                2. Criteria & Eligibility
              </button>
              <button type="button" class="tab-btn border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium text-muted hover:text-fg transition-colors" data-tab="tab-roles">
                3. Roles & Breakdown (<span id="tab-roles-count">0</span>)
              </button>
              <button type="button" class="tab-btn border-b-2 border-transparent px-4 py-2.5 text-[13px] font-medium text-muted hover:text-fg transition-colors" data-tab="tab-funnel">
                4. Selection Funnel
              </button>
            </div>

            <!-- Tab 1: Overview & Identity -->
            <div id="tab-overview" class="tab-content mt-6 space-y-6">
              <!-- Quick CSV / JSON Importer Banner -->
              <div class="rounded-2xl border border-line bg-bg/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                <div class="flex items-center gap-2.5 text-muted">
                  <span class="text-[18px]">📄</span>
                  <span>Have CSV or JSON data? Use the automated extractor to auto-fill this company.</span>
                </div>
                <button id="btn-banner-open-import" type="button" class="cursor-pointer text-intern font-semibold hover:underline shrink-0 text-left">
                  Open CSV / JSON Importer →
                </button>
              </div>
              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Company Name *</label>
                  <input id="field-name" type="text" required placeholder="e.g. JPMorgan Chase" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Slug (URL identifier) *</label>
                  <input id="field-slug" type="text" required placeholder="e.g. jpmc" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg font-mono text-[13px]" />
                </div>
              </div>

              <div class="grid gap-6 sm:grid-cols-3">
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Headline Display Pay *</label>
                  <input id="field-pay" type="text" placeholder="e.g. ₹16.0 LPA or ₹1.35L / mo" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Pay Type</label>
                  <select id="field-pay-kind" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg">
                    <option value="CTC">CTC (Annual Package)</option>
                    <option value="Stipend">Stipend (Monthly)</option>
                  </select>
                </div>
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Numeric Pay Rank (Sorting)</label>
                  <input id="field-pay-rank" type="number" placeholder="1600000" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg font-mono" />
                </div>
              </div>

              <!-- Offer Types Checkboxes -->
              <div class="rounded-2xl border border-line bg-bg/50 p-5">
                <label class="label block text-[12px] text-faint mb-3">Offer Classification</label>
                <div class="flex flex-wrap gap-6">
                  <label class="flex items-center gap-2.5 cursor-pointer text-[14px]">
                    <input id="check-offer-intern" type="checkbox" class="size-4 rounded border-line-strong bg-bg" />
                    <span>Internship (TE / Summer)</span>
                  </label>
                  <label class="flex items-center gap-2.5 cursor-pointer text-[14px]">
                    <input id="check-offer-fulltime" type="checkbox" class="size-4 rounded border-line-strong bg-bg" />
                    <span>Full-time (BE / Final)</span>
                  </label>
                  <label class="flex items-center gap-2.5 cursor-pointer text-[14px]">
                    <input id="check-offer-ppo" type="checkbox" class="size-4 rounded border-line-strong bg-bg" />
                    <span>PPO Pathway</span>
                  </label>
                  <label class="flex items-center gap-2.5 cursor-pointer text-[14px] ml-auto">
                    <input id="check-dream" type="checkbox" class="size-4 rounded border-line-strong bg-bg" />
                    <span class="text-yellow-400 font-medium">★ Dream / Super-Dream Offer</span>
                  </label>
                </div>
              </div>

              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Logo Path or URL</label>
                  <div class="flex items-center gap-3">
                    <input id="field-logo" type="text" placeholder="/logos/company.svg" class="flex-1 rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg font-mono text-[13px]" />
                    <div id="field-logo-preview" class="size-10 rounded-lg border border-line bg-bg grid place-items-center overflow-hidden shrink-0">
                      <span class="text-[10px] text-faint">None</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Status / Result Summary</label>
                  <input id="field-status" type="text" placeholder="e.g. 10 confirmed offers or 4 full-time" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                </div>
              </div>
            </div>

            <!-- Tab 2: Criteria & Eligibility -->
            <div id="tab-eligibility" class="tab-content mt-6 space-y-6 hidden">
              <div>
                <label class="label block text-[12px] text-faint mb-2">Eligible Branches Summary</label>
                <input id="field-branches" type="text" placeholder="e.g. All branches open or CSE, IT, AI & DS" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg" />
                <div class="mt-2 flex flex-wrap gap-2 text-[12px] text-muted">
                  <span class="text-faint">Quick presets:</span>
                  <button type="button" class="btn-quick-branch rounded bg-line px-2 py-0.5 hover:bg-line-strong">All branches open</button>
                  <button type="button" class="btn-quick-branch rounded bg-line px-2 py-0.5 hover:bg-line-strong">CSE, IT, AI & DS</button>
                  <button type="button" class="btn-quick-branch rounded bg-line px-2 py-0.5 hover:bg-line-strong">CSE, IT</button>
                  <button type="button" class="btn-quick-branch rounded bg-line px-2 py-0.5 hover:bg-line-strong">EXTC Only</button>
                </div>
              </div>

              <div class="grid gap-6 sm:grid-cols-2">
                <div>
                  <label class="label block text-[12px] text-faint mb-2">CGPA Cutoff & Notes</label>
                  <textarea id="field-cgpa-criteria" rows="3" placeholder="e.g. 7.0 CGPA; 8.0+ preferred for shortlisting" class="w-full rounded-xl border border-line-strong bg-bg p-3.5 text-[13px] text-fg outline-none focus:border-fg"></textarea>
                </div>
                <div>
                  <label class="label block text-[12px] text-faint mb-2">Class X / XII Boards Cutoff</label>
                  <textarea id="field-boards-criteria" rows="3" placeholder="e.g. 80% in 10th & 12th; no active backlogs" class="w-full rounded-xl border border-line-strong bg-bg p-3.5 text-[13px] text-fg outline-none focus:border-fg"></textarea>
                </div>
              </div>

              <div>
                <label class="label block text-[12px] text-faint mb-2">Recruitment Drive Timeline / Dates</label>
                <input id="field-timeline" type="text" placeholder="e.g. PPT 24 Jun, OA 27 Jun, Interviews 2-3 Jul 2026" class="w-full rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[14px] text-fg outline-none focus:border-fg font-mono text-[13px]" />
              </div>

              <div>
                <label class="label block text-[12px] text-faint mb-2">Placement Cell Notes</label>
                <textarea id="field-notes" rows="2" placeholder="e.g. Verified via circulars and TPO tracker." class="w-full rounded-xl border border-line-strong bg-bg p-3.5 text-[13px] text-fg outline-none focus:border-fg"></textarea>
              </div>
            </div>

            <!-- Tab 3: Roles & Compensation Breakdown -->
            <div id="tab-roles" class="tab-content mt-6 space-y-6 hidden">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display text-[18px]">Recruited Roles</h3>
                  <p class="text-[13px] text-muted">Add specific job profiles, stipends, and offer counts for this company.</p>
                </div>
                <button id="btn-add-role" type="button" class="cursor-pointer rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-fg hover:bg-line">
                  + Add Role
                </button>
              </div>

              <div id="roles-repeater-container" class="space-y-4">
                <!-- Injected via JavaScript -->
              </div>
            </div>

            <!-- Tab 4: Selection Funnel -->
            <div id="tab-funnel" class="tab-content mt-6 space-y-6 hidden">
              <div>
                <label class="label block text-[12px] text-faint mb-2">Quick Pipeline String (Auto-Parser)</label>
                <div class="flex items-center gap-3">
                  <input id="field-funnel-raw" type="text" placeholder="e.g. Applied 200 -> OA 60 -> Tech 25 -> HR 10 -> 8 offers" class="flex-1 rounded-xl border border-line-strong bg-bg px-4 py-2.5 text-[13px] text-fg outline-none focus:border-fg font-mono" />
                  <button id="btn-parse-funnel" type="button" class="rounded-xl border border-line bg-line px-4 py-2.5 text-[12px] text-fg hover:bg-line-strong cursor-pointer shrink-0">
                    Parse Pipeline
                  </button>
                </div>
                <p class="mt-1.5 text-[11px] text-faint">Type stages separated by "->" or arrows to instantly build the visual funnel bars.</p>
              </div>

              <div class="border-t border-line pt-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="font-display text-[16px]">Funnels Stage Breakdown</h4>
                  <button id="btn-add-stage" type="button" class="cursor-pointer text-[12px] text-intern hover:underline">
                    + Add Single Stage
                  </button>
                </div>

                <div id="stages-repeater-container" class="space-y-3">
                  <!-- Injected via JS -->
                </div>
              </div>

              <!-- Live Visual Funnel Preview -->
              <div class="rounded-2xl border border-line bg-bg/50 p-5">
                <span class="label text-[11px] text-faint block uppercase tracking-wider mb-4">Live Visual Funnel Preview</span>
                <div id="funnel-live-preview" class="space-y-3">
                  <!-- Rendered Bars -->
                </div>
              </div>
            </div>

            <!-- Bottom Actions Bar -->
            <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <div class="flex items-center gap-3">
                <button id="btn-delete-company" type="button" class="hidden cursor-pointer rounded-full border border-red-500/40 px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10">
                  Delete Company
                </button>
                <button id="btn-reset-form" type="button" class="cursor-pointer rounded-full border border-line-strong px-4 py-2 text-[13px] text-muted hover:border-fg hover:text-fg">
                  Reset Form
                </button>
              </div>

              <div class="flex items-center gap-4">
                <span id="form-save-status" class="text-[12px] text-faint"></span>
                <button id="btn-save-company-bottom" type="button" class="cursor-pointer rounded-full bg-fg px-6 py-2.5 text-[14px] font-medium text-bg transition-opacity hover:opacity-90">
                  Save Company
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div> <!-- End view-companies -->

    <!-- VIEW 2: Branch Data Submissions -->
    <div id="view-branch-submissions" class="admin-view-tab hidden mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="chip font-mono text-[11px] text-intern border-intern/40 bg-intern/10">Department Inflow</span>
            <span id="badge-branch-sub-total" class="label text-faint">0 submissions</span>
          </div>
          <h2 class="display-m mt-2 text-[24px] sm:text-[28px]">Branch Placement Submissions</h2>
          <p class="text-[14px] text-muted mt-1 max-w-[68ch]">
            Direct contributions from students received on the blurred branches page ("Submit data here if you have it"). Review, verify, or quickly promote them into the company directory.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btn-refresh-branch-submissions" type="button" class="cursor-pointer inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] text-muted hover:border-fg hover:text-fg transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            <span>Refresh Submissions</span>
          </button>
        </div>
      </div>

      <!-- Submissions List Container -->
      <div id="branch-submissions-container" class="mt-8 grid gap-4">
        <div class="p-12 text-center text-[14px] text-muted">Connecting to Supabase...</div>
      </div>
    </div>

    <!-- VIEW 3: Reports & Feedback -->
    <div id="view-reports" class="admin-view-tab hidden mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="chip font-mono text-[11px] text-ppo border-ppo/40 bg-ppo/10">Feedback & Audits</span>
            <span id="badge-reports-total" class="label text-faint">0 reports</span>
          </div>
          <h2 class="display-m mt-2 text-[24px] sm:text-[28px]">Correction Reports & Feedback</h2>
          <p class="text-[14px] text-muted mt-1 max-w-[68ch]">
            Audits reported by users across companies and site feedback from the community.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btn-refresh-reports" type="button" class="cursor-pointer inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] text-muted hover:border-fg hover:text-fg transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            <span>Refresh Reports</span>
          </button>
        </div>
      </div>

      <!-- Reports List Container -->
      <div id="reports-container" class="mt-8 grid gap-4">
        <div class="p-12 text-center text-[14px] text-muted">Connecting to Supabase...</div>
      </div>
    </div>

    <!-- CSV / JSON Import Modal -->
    <div id="import-company-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div class="relative w-full max-w-2xl rounded-3xl border border-line-strong bg-panel p-6 sm:p-8 shadow-2xl my-8">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="chip font-mono text-[11px] text-intern border-intern/40 bg-intern/10">Automated Extractor</span>
              <span class="label text-[12px] text-faint">CSV & JSON Supported</span>
            </div>
            <h3 class="font-display text-[22px] font-bold text-fg mt-1">Import Company Data</h3>
            <p class="text-[13px] text-muted mt-1">
              Upload a file or paste raw content below. The parser extracts company info, eligibility, and roles straight into the editor.
            </p>
          </div>
          <button id="btn-close-import-modal" type="button" class="size-8 rounded-full border border-line grid place-items-center text-muted hover:text-fg hover:border-fg transition-colors cursor-pointer text-[16px]">
            ✕
          </button>
        </div>

        <!-- Required Format Reference Section -->
        <div class="mt-6 rounded-2xl border border-line bg-bg/60 p-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="label text-[12px] text-fg font-medium">Format Reference:</span>
              <div class="inline-flex rounded-full border border-line bg-panel p-0.5 text-[11px]">
                <button id="fmt-tab-csv" type="button" class="cursor-pointer rounded-full px-3 py-1 font-medium bg-fg text-bg transition-colors">CSV Format</button>
                <button id="fmt-tab-json" type="button" class="cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-colors">JSON Format</button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button id="btn-copy-csv-fmt" type="button" class="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-panel px-3 py-1 text-[11px] font-medium text-muted hover:border-fg hover:text-fg transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="btn-copy-csv-label">Copy CSV Format</span>
              </button>
              <button id="btn-copy-json-fmt" type="button" class="hidden cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-panel px-3 py-1 text-[11px] font-medium text-muted hover:border-fg hover:text-fg transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="btn-copy-json-label">Copy JSON Format</span>
              </button>
            </div>
          </div>

          <!-- CSV Format Display -->
          <div id="fmt-display-csv" class="space-y-2">
            <p class="text-[12px] text-muted">
              Supported Columns: <code class="font-mono text-intern bg-intern/10 px-1.5 py-0.5 rounded text-[11px]">name, slug, pay, payKind, offers, branches, cgpaCriteria, boardsCriteria, visitTimeline, students, roles, notes</code>
            </p>
            <div class="relative overflow-x-auto rounded-xl border border-line bg-panel p-3 font-mono text-[11px] text-faint select-all whitespace-pre leading-relaxed">name,slug,pay,payKind,offers,branches,cgpaCriteria,boardsCriteria,visitTimeline,students,roles,notes
Kelp Global,kelp-global,₹16 LPA,CTC,internship;fulltime,All branches open,8.0+ CGPA,Standard eligibility,Oct 2026,5,Blockchain Engineer:fulltime:5:₹16 LPA,Campus recruitment drive</div>
            <p class="text-[11px] text-faint">💡 Tip: In CSV, multiple roles can be separated by <code class="font-mono text-muted">;</code> formatted as <code class="font-mono text-muted">Title:Type:Count:CTC</code>.</p>
          </div>

          <!-- JSON Format Display -->
          <div id="fmt-display-json" class="hidden space-y-2">
            <p class="text-[12px] text-muted">
              JSON Structure (single company object or array of companies):
            </p>
            <div class="relative max-h-48 overflow-y-auto rounded-xl border border-line bg-panel p-3 font-mono text-[11px] text-faint select-all whitespace-pre leading-relaxed">{
  "name": "Kelp Global",
  "slug": "kelp-global",
  "pay": "₹16 LPA",
  "payKind": "CTC",
  "offers": ["internship", "fulltime"],
  "dream": false,
  "branches": "All branches open",
  "cgpaCriteria": "8.0+ CGPA",
  "boardsCriteria": "Standard eligibility",
  "visitTimeline": "Oct 2026",
  "out": {
    "students": 5,
    "fulltimeOffers": 5,
    "internships": 5
  },
  "roles": [
    {
      "title": "Blockchain Engineer",
      "type": "fulltime",
      "count": 5,
      "ctc": "₹16 LPA",
      "stipend": null,
      "rawCompensation": "14L fixed + 2L bonus",
      "visitDate": "Oct 2026",
      "notes": ""
    }
  ],
  "funnelRaw": "Applied 120 -> OA 40 -> Tech 15 -> 5 offers",
  "notes": "Campus recruitment drive"
}</div>
          </div>
        </div>

        <!-- Drag & Drop / File Input Box -->
        <div class="mt-6">
          <label class="label block text-[12px] text-faint mb-2">Option A: Upload File (.csv or .json)</label>
          <div id="drop-zone" class="relative rounded-2xl border-2 border-dashed border-line-strong hover:border-fg bg-bg/40 p-6 text-center transition-colors cursor-pointer">
            <input id="import-file-input" type="file" accept=".csv, .json, text/csv, application/json" class="absolute inset-0 size-full opacity-0 cursor-pointer" />
            <div class="flex flex-col items-center gap-2 pointer-events-none">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="text-muted"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="text-[13px] text-fg font-medium">Click to select or drag and drop your CSV / JSON file</p>
              <p id="file-chosen-name" class="text-[11px] text-faint font-mono">Accepts .csv or .json files</p>
            </div>
          </div>
        </div>

        <!-- Raw Paste Textarea -->
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <label class="label block text-[12px] text-faint">Option B: Or Paste Raw Content Directly</label>
            <button id="btn-clear-paste" type="button" class="text-[11px] text-muted hover:text-fg cursor-pointer">Clear</button>
          </div>
          <textarea id="import-text-input" rows="6" placeholder="Paste raw CSV lines or JSON code here..." class="w-full rounded-2xl border border-line-strong bg-bg p-4 font-mono text-[12px] text-fg outline-none focus:border-fg placeholder:text-faint"></textarea>
          <div id="import-parse-status" class="mt-2 text-[12px] text-red-400 hidden"></div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <button id="btn-cancel-import" type="button" class="cursor-pointer rounded-full border border-line-strong px-5 py-2 text-[13px] text-muted hover:border-fg hover:text-fg transition-colors">
            Cancel
          </button>

          <button id="btn-do-extract" type="button" class="cursor-pointer inline-flex items-center gap-2 rounded-full bg-fg px-6 py-2.5 text-[13px] font-medium text-bg hover:opacity-90 transition-opacity">
            <span>Extract & Populate Form</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div id="admin-toast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-line-strong bg-panel px-5 py-3.5 shadow-2xl transition-all duration-300 translate-y-20 opacity-0 pointer-events-none">
      <span id="toast-icon" class="text-intern text-[18px]">✔</span>
      <span id="toast-message" class="text-[13px] text-fg font-medium">Changes saved successfully</span>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey, setBatch, allBatches } from '/src/data/batches.js';

    // Supabase Configuration
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    // -------------------------------------------------------------
    // 1. Authentication System
    // -------------------------------------------------------------
    const loginScreen = document.getElementById('admin-login-screen');
    const dashboard = document.getElementById('admin-workspace-dashboard');
    const loginForm = document.getElementById('admin-login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorBanner = document.getElementById('login-error-banner');
    const btnSubmitLogin = document.getElementById('btn-submit-login');
    const loginBtnText = document.getElementById('login-btn-text');
    const loginBtnSpinner = document.getElementById('login-btn-spinner');
    const btnTogglePass = document.getElementById('btn-toggle-login-pass');
    const btnLogout = document.getElementById('btn-admin-logout');
    const userDisplay = document.getElementById('admin-user-display');
    const dbStatusBadge = document.getElementById('db-status-badge');

    // SHA-256 via Web Crypto
    async function hashPassword(salt, password) {
      const enc = new TextEncoder();
      const data = enc.encode(salt + password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function checkAuth() {
      const token = sessionStorage.getItem('spit_admin_auth') || localStorage.getItem('spit_admin_auth');
      if (token) {
        try {
          const parsed = JSON.parse(token);
          if (parsed && parsed.user && (parsed.expiry > Date.now())) {
            return parsed;
          }
        } catch (e) {}
      }
      return null;
    }

    function setAuthSession(user, remember) {
      const payload = {
        user,
        expiry: Date.now() + (remember ? (14 * 24 * 60 * 60 * 1000) : (8 * 60 * 60 * 1000))
      };
      const json = JSON.stringify(payload);
      sessionStorage.setItem('spit_admin_auth', json);
      if (remember) {
        localStorage.setItem('spit_admin_auth', json);
      }
    }

    function clearAuthSession() {
      sessionStorage.removeItem('spit_admin_auth');
      localStorage.removeItem('spit_admin_auth');
    }

    async function authenticateUser(username, password) {
      const cleanUser = username.trim().toLowerCase();
      // 1. Try Supabase cloud auth table
      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/admin_auth?username=eq.\${encodeURIComponent(cleanUser)}\`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });
        if (res.ok) {
          const records = await res.json();
          if (records && records.length > 0) {
            const row = records[0];
            const computed = await hashPassword(row.salt || 'spit_salt_2027', password);
            if (computed === row.password_hash) {
              return { success: true, user: cleanUser };
            }
          }
        }
      } catch (err) {
        console.warn('Supabase auth network check skipped:', err);
      }

      // 2. Direct SHA-256 fallback (yash@spit2027 or spit2027)
      const computedLocal = await hashPassword('spit_salt_2027', password);
      if (
        computedLocal === '443b91a662495949cd66c2ec0fa119ba3785b1f586d9c3c196fb6efc8dd36f09' || // yash@spit2027
        computedLocal === '3440d464349a27f212ae4e92761c0b2e98d086e6c5652fb5d52626d4e46aee58'    // spit2027
      ) {
        return { success: true, user: cleanUser || 'Admin' };
      }

      return { success: false, error: 'Invalid username or password. Please try again.' };
    }

    // Toggle Password Visibility
    btnTogglePass?.addEventListener('click', () => {
      const isPass = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPass ? 'text' : 'password';
      btnTogglePass.textContent = isPass ? 'Hide' : 'Show';
    });

    // Login Form Submit Handler
    loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = loginUsernameInput.value.trim();
      const p = loginPasswordInput.value;

      if (!u || !p) {
        loginErrorBanner.textContent = 'Please enter both username and password.';
        loginErrorBanner.classList.remove('hidden');
        return;
      }

      loginBtnText.textContent = 'Authenticating...';
      loginBtnSpinner.classList.remove('hidden');
      btnSubmitLogin.disabled = true;
      loginErrorBanner.classList.add('hidden');

      const result = await authenticateUser(u, p);
      if (result.success) {
        const remember = document.getElementById('login-remember')?.checked;
        setAuthSession(result.user, remember);
        showWorkspace(result.user);
      } else {
        loginErrorBanner.textContent = result.error || 'Authentication failed.';
        loginErrorBanner.classList.remove('hidden');
        loginBtnText.textContent = 'Sign In to Workspace';
        loginBtnSpinner.classList.add('hidden');
        btnSubmitLogin.disabled = false;
      }
    });

    btnLogout?.addEventListener('click', () => {
      clearAuthSession();
      loginPasswordInput.value = '';
      dashboard.classList.add('hidden');
      loginScreen.classList.remove('hidden');
      loginBtnText.textContent = 'Sign In to Workspace';
      loginBtnSpinner.classList.add('hidden');
      btnSubmitLogin.disabled = false;
    });

    function showWorkspace(user) {
      loginScreen.classList.add('hidden');
      dashboard.classList.remove('hidden');
      if (userDisplay) userDisplay.textContent = user;
      loadBatchData(currentBatch);
      fetchSubmissionsAndReports();
    }

    // Check Initial Auth State
    const session = checkAuth();
    if (session) {
      showWorkspace(session.user);
    } else {
      loginScreen.classList.remove('hidden');
      dashboard.classList.add('hidden');
    }

    // -------------------------------------------------------------
    // 2. Admin Workspace & Supabase Data Manager
    // -------------------------------------------------------------
    let currentBatch = '2027';
    let allCompanies = [];
    let activeCompanySlug = null;
    let rolesData = [];
    let stagesData = [];

    // DOM Elements
    const batch2027Btn = document.getElementById('batch-btn-2027');
    const batch2028Btn = document.getElementById('batch-btn-2028');
    const searchInput = document.getElementById('admin-search-input');
    const companiesListContainer = document.getElementById('admin-companies-list');
    const directoryCount = document.getElementById('directory-count');

    const sumTotalCompanies = document.getElementById('summary-total-companies');
    const sumTotalOffers = document.getElementById('summary-total-offers');
    const sumActiveBatch = document.getElementById('summary-active-batch');

    const editorTitle = document.getElementById('editor-title');
    const editorModeBadge = document.getElementById('editor-mode-badge');
    const btnViewLive = document.getElementById('btn-view-live');
    const btnSaveTop = document.getElementById('btn-save-company-top');
    const btnSaveBottom = document.getElementById('btn-save-company-bottom');
    const btnDelete = document.getElementById('btn-delete-company');
    const btnReset = document.getElementById('btn-reset-form');
    const btnNewCompany = document.getElementById('btn-new-company');
    const formStatus = document.getElementById('form-save-status');

    // Fetch batch data (prioritizes live Supabase database)
    async function loadBatchData(batchYear) {
      currentBatch = batchYear;

      // Update Switcher Buttons
      if (batchYear === '2027') {
        batch2027Btn.className = "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-fg text-bg";
        batch2028Btn.className = "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg";
      } else {
        batch2028Btn.className = "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-fg text-bg";
        batch2027Btn.className = "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors text-muted hover:text-fg";
      }

      sumActiveBatch.textContent = \`Class of \${batchYear}\`;
      companiesListContainer.innerHTML = '<div class="p-8 text-center text-[13px] text-muted">Connecting to Supabase...</div>';

      // 1. Fetch from Supabase Postgres
      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/companies?batch_year=eq.\${batchYear}&order=out_students.desc\`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });

        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0) {
            allCompanies = rows.map(d => ({
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
            }));
            if (dbStatusBadge) dbStatusBadge.textContent = 'Supabase Cloud DB Connected';
          } else {
            fallbackLocalBatch(batchYear);
          }
        } else {
          fallbackLocalBatch(batchYear);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, loading local bundled batch data:', err);
        fallbackLocalBatch(batchYear);
      }

      updateSummaryBar();
      renderCompaniesList();

      if (allCompanies.length > 0) {
        selectCompany(allCompanies[0].slug);
      } else {
        resetForm();
      }
    }

    function fallbackLocalBatch(batchYear) {
      const bData = allBatches[batchYear] || allBatches['2027'];
      allCompanies = JSON.parse(JSON.stringify(bData.companies || []));
      if (dbStatusBadge) dbStatusBadge.textContent = 'Local DB Mode';
    }

    function updateSummaryBar() {
      sumTotalCompanies.textContent = allCompanies.length;
      const totalOffers = allCompanies.reduce((acc, c) => acc + (c.out?.students || 0), 0);
      sumTotalOffers.textContent = totalOffers;
    }

    function renderCompaniesList() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const filtered = allCompanies.filter(c => {
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
      });

      directoryCount.textContent = \`\${filtered.length} of \${allCompanies.length} companies\`;

      if (filtered.length === 0) {
        companiesListContainer.innerHTML = '<div class="p-8 text-center text-[13px] text-muted">No matching companies found.</div>';
        return;
      }

      companiesListContainer.innerHTML = filtered.map(c => {
        const isSelected = c.slug === activeCompanySlug;
        const count = c.out?.students || 0;
        const isDream = c.dream ? '★ ' : '';

        return \`
          <div class="company-list-item cursor-pointer px-4 py-3 transition-colors flex items-center justify-between gap-3 \${isSelected ? 'bg-line-strong text-fg font-medium' : 'hover:bg-line/50 text-muted hover:text-fg'}" data-slug="\${c.slug}">
            <div class="min-w-0 flex items-center gap-3">
              <span class="size-2 rounded-full \${count > 0 ? 'bg-intern' : 'bg-line-strong'} shrink-0"></span>
              <div class="truncate">
                <span class="text-[14px] truncate block text-fg">\${isDream}\${c.name}</span>
                <span class="text-[11px] text-faint font-mono block truncate">\${c.pay || 'Pay N/A'}</span>
              </div>
            </div>
            <span class="num text-[12px] font-mono text-faint shrink-0">\${count} offers</span>
          </div>
        \`;
      }).join('');

      companiesListContainer.querySelectorAll('.company-list-item').forEach(item => {
        item.addEventListener('click', () => {
          const slug = item.getAttribute('data-slug');
          selectCompany(slug);
        });
      });
    }

    function selectCompany(slug) {
      activeCompanySlug = slug;
      const company = allCompanies.find(c => c.slug === slug);
      if (!company) return;

      renderCompaniesList();

      editorTitle.textContent = company.name;
      editorModeBadge.textContent = "Editing";
      editorModeBadge.className = "chip text-[11px] font-mono text-intern border-intern/30 bg-intern/10";
      btnViewLive.classList.remove('hidden');
      btnViewLive.href = \`/companies/company.html?slug=\${company.slug}\${currentBatch === '2028' ? '&batch=2028' : ''}\`;
      btnDelete.classList.remove('hidden');

      document.getElementById('field-name').value = company.name || '';
      document.getElementById('field-slug').value = company.slug || '';
      document.getElementById('field-pay').value = company.pay || '';
      document.getElementById('field-pay-kind').value = company.payKind || 'CTC';
      document.getElementById('field-pay-rank').value = company.payRank || '';
      document.getElementById('field-status').value = company.status || '';
      document.getElementById('field-branches').value = company.branches || '';
      document.getElementById('field-cgpa-criteria').value = company.cgpaCriteria || '';
      document.getElementById('field-boards-criteria').value = company.boardsCriteria || '';
      document.getElementById('field-timeline').value = company.visitTimeline || '';
      document.getElementById('field-notes').value = company.notes || '';
      document.getElementById('field-logo').value = company.logo || '';
      updateLogoPreview(company.logo);

      const offers = company.offers || [];
      document.getElementById('check-offer-intern').checked = offers.includes('internship');
      document.getElementById('check-offer-fulltime').checked = offers.includes('fulltime');
      document.getElementById('check-offer-ppo').checked = offers.includes('ppo');
      document.getElementById('check-dream').checked = !!company.dream;

      rolesData = JSON.parse(JSON.stringify(company.roles || []));
      renderRolesRepeater();

      if (rolesData.length > 0 && rolesData[0].funnel && rolesData[0].funnel.length > 0) {
        stagesData = JSON.parse(JSON.stringify(rolesData[0].funnel));
      } else if (company.funnelRaw) {
        parsePipelineString(company.funnelRaw);
      } else {
        stagesData = [
          { name: "Online Assessment", count: company.out?.students ? company.out.students * 5 : 50 },
          { name: "Interview Round", count: company.out?.students ? company.out.students * 2 : 20 },
          { name: "Offers Extended", count: company.out?.students || 5 }
        ];
      }
      document.getElementById('field-funnel-raw').value = company.funnelRaw || '';
      renderStagesRepeater();
      renderFunnelPreview();

      formStatus.textContent = \`Loaded \${company.name}\`;
    }

    function resetForm() {
      activeCompanySlug = null;
      renderCompaniesList();

      editorTitle.textContent = "New Company";
      editorModeBadge.textContent = "Creating";
      editorModeBadge.className = "chip text-[11px] font-mono text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      btnViewLive.classList.add('hidden');
      btnDelete.classList.add('hidden');

      document.getElementById('company-editor-form').reset();
      updateLogoPreview('');

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

      const maxCount = Math.max(...stagesData.map(s => s.count || 1), 1);

      container.innerHTML = stagesData.map((s, idx) => {
        const pct = Math.max(Math.round(((s.count || 0) / maxCount) * 100), 5);
        const isFinal = idx === stagesData.length - 1;
        const color = isFinal ? 'var(--color-intern)' : 'var(--color-line-strong)';

        return \`
          <div class="grid grid-cols-[140px_minmax(0,1fr)_50px] items-center gap-3 text-[13px]">
            <span class="truncate text-muted font-medium">\${s.name || 'Stage'}</span>
            <div class="h-2 rounded bg-line overflow-hidden">
              <div class="h-full rounded transition-all duration-300" style="width: \${pct}%; background: \${color};"></div>
            </div>
            <span class="num text-right font-mono text-[12px] \${isFinal ? 'text-intern font-bold' : 'text-faint'}">\${s.count || 0}</span>
          </div>
        \`;
      }).join('');
    }

    document.getElementById('btn-add-stage')?.addEventListener('click', () => {
      stagesData.push({ name: "Technical Round", count: 10 });
      renderStagesRepeater();
      renderFunnelPreview();
    });

    function parsePipelineString(str) {
      if (!str) return;
      const parts = str.split(/->|→|\\|/).map(p => p.trim()).filter(Boolean);
      const newStages = [];

      parts.forEach(part => {
        const numMatch = part.match(/\\d+/g);
        const count = numMatch ? parseInt(numMatch[numMatch.length - 1], 10) : 0;
        let cleanName = part.replace(/\\d+/g, '').replace(/offers|placed|students|selects|selected/gi, '').trim();
        if (!cleanName) cleanName = part.trim();
        newStages.push({ name: cleanName, count });
      });

      if (newStages.length > 0) {
        stagesData = newStages;
        renderStagesRepeater();
        renderFunnelPreview();
      }
    }

    document.getElementById('btn-parse-funnel')?.addEventListener('click', () => {
      const raw = document.getElementById('field-funnel-raw').value.trim();
      parsePipelineString(raw);
      showToast('Parsed ' + stagesData.length + ' stages from pipeline!');
    });

    // Tab Switching inside Form
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active', 'border-fg', 'text-fg');
          b.classList.add('border-transparent', 'text-muted');
        });
        btn.classList.add('active', 'border-fg', 'text-fg');
        btn.classList.remove('border-transparent', 'text-muted');

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

    // Save Company to Supabase Postgres (and localhost node server if available)
    async function saveCompanyHandler() {
      const name = document.getElementById('field-name').value.trim();
      const slug = document.getElementById('field-slug').value.trim();

      if (!name || !slug) {
        showToast('Company Name and Slug are required!', true);
        return;
      }

      formStatus.textContent = "Saving to Supabase Postgres database...";
      btnSaveTop.disabled = true;
      btnSaveBottom.disabled = true;

      const offers = [];
      if (document.getElementById('check-offer-intern').checked) offers.push('internship');
      if (document.getElementById('check-offer-fulltime').checked) offers.push('fulltime');
      if (document.getElementById('check-offer-ppo').checked) offers.push('ppo');

      // Calculate selections
      const finalCount = (stagesData.length > 0) ? (stagesData[stagesData.length - 1].count || 0) : (rolesData.reduce((a, r) => a + (r.count || 0), 0) || 0);

      const supabaseRecord = {
        slug,
        batch_year: String(currentBatch),
        name,
        offers,
        seasons: ["TE", "BE"],
        pay: document.getElementById('field-pay').value.trim() || 'Competitive',
        pay_kind: document.getElementById('field-pay-kind').value,
        pay_rank: parseInt(document.getElementById('field-pay-rank').value, 10) || 1000,
        dream: document.getElementById('check-dream').checked,
        logo: document.getElementById('field-logo').value.trim() || ('/logos/' + slug + '.svg'),
        out_students: finalCount,
        out_internships: offers.includes('internship') ? finalCount : 0,
        out_fulltime: offers.includes('fulltime') ? finalCount : 0,
        out_ppo: offers.includes('ppo') ? finalCount : 0,
        open_branches: document.getElementById('field-branches').value.trim() || 'All branches open',
        branches: document.getElementById('field-branches').value.trim() || 'All branches open',
        cgpa: null,
        cgpa_criteria: document.getElementById('field-cgpa-criteria').value.trim(),
        boards_criteria: document.getElementById('field-boards-criteria').value.trim(),
        first_date: '',
        last_date: '',
        visit_timeline: document.getElementById('field-timeline').value.trim(),
        funnel_raw: document.getElementById('field-funnel-raw').value.trim(),
        status: document.getElementById('field-status').value.trim() || \`\${finalCount} selections\`,
        roles: rolesData
      };

      try {
        // 1. Direct Save to Supabase Postgres
        const sRes = await fetch(\`\${SUPABASE_URL}/rest/v1/companies?on_conflict=slug,batch_year\`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify([supabaseRecord])
        });

        if (!sRes.ok) {
          const errBody = await sRes.text();
          throw new Error('Supabase save error: ' + errBody);
        }

        // 2. Also try localhost server API if available
        try {
          fetch('/api/company', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batch: currentBatch, company: supabaseRecord })
          }).catch(() => {});
        } catch(e) {}

        showToast(\`Saved '\${name}' directly to Supabase Postgres!\`);
        formStatus.textContent = 'Saved to cloud at ' + new Date().toLocaleTimeString();

        // Refresh list
        await loadBatchData(currentBatch);
        selectCompany(slug);

      } catch (err) {
        showToast('Save failed: ' + err.message, true);
        formStatus.textContent = 'Error: ' + err.message;
      } finally {
        btnSaveTop.disabled = false;
        btnSaveBottom.disabled = false;
      }
    }

    // Delete Company Handler
    async function deleteCompanyHandler() {
      if (!activeCompanySlug) return;
      const comp = allCompanies.find(c => c.slug === activeCompanySlug);
      const conf = confirm(\`Are you sure you want to delete '\${comp?.name || activeCompanySlug}' from Batch '\${currentBatch.slice(2)} in Supabase?\`);
      if (!conf) return;

      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/companies?slug=eq.\${encodeURIComponent(activeCompanySlug)}&batch_year=eq.\${encodeURIComponent(currentBatch)}\`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });

        if (res.ok) {
          showToast(\`Company '\${activeCompanySlug}' removed from Supabase.\`);
          resetForm();
          await loadBatchData(currentBatch);
        } else {
          showToast('Failed to delete company from Supabase', true);
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

    // -------------------------------------------------------------
    // Workspace Navigation (Companies vs Branch Submissions vs Reports)
    // -------------------------------------------------------------
    const navBtnCompanies = document.getElementById('nav-btn-companies');
    const navBtnBranchSubmissions = document.getElementById('nav-btn-branch-submissions');
    const navBtnReports = document.getElementById('nav-btn-reports');

    const viewCompanies = document.getElementById('view-companies');
    const viewBranchSubmissions = document.getElementById('view-branch-submissions');
    const viewReports = document.getElementById('view-reports');

    const allNavBtns = [navBtnCompanies, navBtnBranchSubmissions, navBtnReports];
    const allViews = [viewCompanies, viewBranchSubmissions, viewReports];

    function switchAdminView(targetViewId) {
      allNavBtns.forEach(btn => {
        if (!btn) return;
        const matches = btn.getAttribute('data-view') === targetViewId;
        if (matches) {
          btn.classList.add('active', 'border-fg', 'text-fg', 'font-semibold');
          btn.classList.remove('border-transparent', 'text-muted');
        } else {
          btn.classList.remove('active', 'border-fg', 'text-fg', 'font-semibold');
          btn.classList.add('border-transparent', 'text-muted');
        }
      });

      allViews.forEach(v => {
        if (!v) return;
        if (v.id === targetViewId) {
          v.classList.remove('hidden');
        } else {
          v.classList.add('hidden');
        }
      });

      fetchSubmissionsAndReports();
    }

    allNavBtns.forEach(btn => {
      btn?.addEventListener('click', () => {
        const viewId = btn.getAttribute('data-view');
        switchAdminView(viewId);
      });
    });

    document.getElementById('btn-refresh-branch-submissions')?.addEventListener('click', fetchSubmissionsAndReports);
    document.getElementById('btn-refresh-reports')?.addEventListener('click', fetchSubmissionsAndReports);

    // -------------------------------------------------------------
    // Branch Submissions & Reports Feed
    // -------------------------------------------------------------
    let allSubmissions = [];

    async function fetchSubmissionsAndReports() {
      const branchContainer = document.getElementById('branch-submissions-container');
      const reportsContainer = document.getElementById('reports-container');
      const badgeBranch = document.getElementById('badge-branch-submissions');
      const badgeBranchTotal = document.getElementById('badge-branch-sub-total');
      const badgeReports = document.getElementById('badge-reports');
      const badgeReportsTotal = document.getElementById('badge-reports-total');
      const badgeCompCount = document.getElementById('badge-companies-count');

      if (badgeCompCount) badgeCompCount.textContent = allCompanies.length;

      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/submissions?order=created_at.desc\`, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });

        if (!res.ok) throw new Error(await res.text());
        allSubmissions = await res.json();

        // 1. Branch Data Submissions
        const branchSubs = allSubmissions.filter(s => s.type === 'branch_data');
        const pendingBranchSubs = branchSubs.filter(s => s.status === 'pending');
        if (badgeBranch) badgeBranch.textContent = pendingBranchSubs.length;
        if (badgeBranchTotal) badgeBranchTotal.textContent = \`\${branchSubs.length} total (\${pendingBranchSubs.length} pending)\`;
        renderBranchSubmissions(branchSubs);

        // 2. Reports & Feedback
        const reports = allSubmissions.filter(s => s.type !== 'branch_data');
        const pendingReports = reports.filter(s => s.status === 'pending');
        if (badgeReports) badgeReports.textContent = pendingReports.length;
        if (badgeReportsTotal) badgeReportsTotal.textContent = \`\${reports.length} total (\${pendingReports.length} pending)\`;
        renderReports(reports);

      } catch (err) {
        console.warn('Failed to load submissions:', err);
        if (branchContainer) branchContainer.innerHTML = \`<div class="p-8 text-center text-red-400">Failed to load branch submissions: \${err.message}</div>\`;
        if (reportsContainer) reportsContainer.innerHTML = \`<div class="p-8 text-center text-red-400">Failed to load reports: \${err.message}</div>\`;
      }
    }

    function renderBranchSubmissions(list) {
      const container = document.getElementById('branch-submissions-container');
      if (!container) return;

      if (list.length === 0) {
        container.innerHTML = \`
          <div class="rounded-3xl border border-line bg-panel p-12 text-center">
            <span class="text-[32px] block mb-3">📥</span>
            <h3 class="font-display text-[18px] font-semibold text-fg">No Branch Submissions Yet</h3>
            <p class="text-[14px] text-muted max-w-[45ch] mx-auto mt-2">
              When students or contributors submit branch-wise placement numbers from the branches page, they will show up here live for your review.
            </p>
          </div>
        \`;
        return;
      }

      const branchColors = {
        'CSE': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        'IT': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        'EXTC': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        'AIDS': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      };

      container.innerHTML = list.map(s => {
        const branchClass = branchColors[s.branch] || 'bg-line text-fg border-line-strong';
        const isApproved = s.status === 'approved';
        const dateStr = s.created_at ? new Date(s.created_at).toLocaleString() : 'Recent';

        return \`
          <div class="rounded-2xl border border-line-strong bg-panel p-6 shadow-sm flex flex-col gap-4">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="rounded-full border px-3 py-1 font-mono text-[11px] font-bold \${branchClass}">
                  \${s.branch || 'Department'}
                </span>
                <span class="label text-[12px] text-muted font-mono">
                  Batch '\${(s.batch_year || '2027').slice(2)}
                </span>
                <span class="label text-[12px] \${isApproved ? 'text-intern' : 'text-amber-400'} font-medium">
                  \${isApproved ? '✔ Verified / Approved' : '⏳ Pending Review'}
                </span>
              </div>
              <span class="text-[12px] text-faint font-mono">\${dateStr}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <h3 class="font-display text-[20px] font-bold text-fg">
                  \${s.company_name}
                  \${s.role_title ? '<span class=\"text-muted text-[16px] font-normal\"> · ' + s.role_title + '</span>' : ''}
                </h3>
              </div>
              <div class="flex items-center gap-3">
                <span class="num text-[17px] font-semibold text-fg">\${s.compensation || 'Package not stated'}</span>
                <span class="chip bg-line/80 text-[12px] font-semibold text-fg">\${s.offers_count || 1} \${(s.offers_count === 1) ? 'offer' : 'offers'}</span>
              </div>
            </div>

            \${s.details ? \`
              <div class="rounded-xl border border-line bg-bg/60 p-3.5 text-[13px] text-muted">
                <strong class="text-fg block mb-1">Verification Reference / Proof:</strong>
                \${s.details}
              </div>
            \` : ''}

            <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-3 text-[12px]">
              <span class="text-faint">
                Submitted by: <strong class="text-muted">\${s.submitter_name || 'Anonymous'}</strong>
                \${s.submitter_contact ? '<span class=\"text-faint\"> (' + s.submitter_contact + ')</span>' : ''}
              </span>

              <div class="flex items-center gap-2">
                \${!isApproved ? \`
                  <button type="button" data-action="approve-sub" data-id="\${s.id}" class="cursor-pointer rounded-full bg-intern px-4 py-1.5 text-[12px] font-semibold text-bg hover:opacity-90 transition-opacity">
                    Mark Approved
                  </button>
                \` : ''}
                <button type="button" data-action="quick-add-sub" data-id="\${s.id}" class="cursor-pointer rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg transition-colors">
                  Quick Add Company
                </button>
                <button type="button" data-action="delete-sub" data-id="\${s.id}" class="cursor-pointer rounded-full border border-red-500/30 px-3 py-1.5 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      // Wire action buttons
      container.querySelectorAll('[data-action="approve-sub"]').forEach(btn => {
        btn.addEventListener('click', () => updateSubmissionStatus(btn.getAttribute('data-id'), 'approved'));
      });
      container.querySelectorAll('[data-action="quick-add-sub"]').forEach(btn => {
        btn.addEventListener('click', () => quickAddFromSubmission(btn.getAttribute('data-id')));
      });
      container.querySelectorAll('[data-action="delete-sub"]').forEach(btn => {
        btn.addEventListener('click', () => deleteSubmissionItem(btn.getAttribute('data-id')));
      });
    }

    function renderReports(list) {
      const container = document.getElementById('reports-container');
      if (!container) return;

      if (list.length === 0) {
        container.innerHTML = \`
          <div class="rounded-3xl border border-line bg-panel p-12 text-center">
            <span class="text-[32px] block mb-3">🚩</span>
            <h3 class="font-display text-[18px] font-semibold text-fg">No Reports or Feedback</h3>
            <p class="text-[14px] text-muted max-w-[45ch] mx-auto mt-2">
              User-submitted correction reports and feedback will appear here live.
            </p>
          </div>
        \`;
        return;
      }

      container.innerHTML = list.map(r => {
        const isCorrection = r.type === 'correction';
        const isResolved = r.status === 'resolved';
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleString() : 'Recent';

        return \`
          <div class="rounded-2xl border border-line-strong bg-panel p-6 shadow-sm flex flex-col gap-4">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="rounded-full border px-3 py-1 font-mono text-[11px] font-bold \${isCorrection ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-intern/20 text-intern border-intern/30'}">
                  \${isCorrection ? 'Correction Report' : 'Community Feedback'}
                </span>
                \${r.company_name ? \`<span class="label text-[13px] font-semibold text-fg">\${r.company_name}</span>\` : ''}
                \${r.role_title ? \`<span class="label text-[12px] text-muted">\${r.role_title}</span>\` : ''}
                <span class="label text-[12px] \${isResolved ? 'text-intern' : 'text-amber-400'} font-medium">
                  \${isResolved ? '✔ Resolved' : '⏳ Pending'}
                </span>
              </div>
              <span class="text-[12px] text-faint font-mono">\${dateStr}</span>
            </div>

            <div class="rounded-xl border border-line bg-bg/60 p-4 text-[14px] text-fg leading-relaxed">
              \${r.details || 'No additional details provided.'}
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-3 text-[12px]">
              <span class="text-faint">
                From: <strong class="text-muted">\${r.submitter_name || 'Visitor'}</strong>
                \${r.submitter_contact ? '<span class=\"text-faint\"> (' + r.submitter_contact + ')</span>' : ''}
                \${r.branch ? '<span class=\"text-muted\"> · Branch: ' + r.branch + '</span>' : ''}
              </span>

              <div class="flex items-center gap-2">
                \${!isResolved ? \`
                  <button type="button" data-action="resolve-report" data-id="\${r.id}" class="cursor-pointer rounded-full bg-fg px-4 py-1.5 text-[12px] font-medium text-bg hover:opacity-90 transition-opacity">
                    Mark Resolved
                  </button>
                \` : ''}
                <button type="button" data-action="delete-report" data-id="\${r.id}" class="cursor-pointer rounded-full border border-red-500/30 px-3 py-1.5 text-[12px] text-red-400 hover:bg-red-500/10 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      container.querySelectorAll('[data-action="resolve-report"]').forEach(btn => {
        btn.addEventListener('click', () => updateSubmissionStatus(btn.getAttribute('data-id'), 'resolved'));
      });
      container.querySelectorAll('[data-action="delete-report"]').forEach(btn => {
        btn.addEventListener('click', () => deleteSubmissionItem(btn.getAttribute('data-id')));
      });
    }

    async function updateSubmissionStatus(id, newStatus) {
      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/submissions?id=eq.\${id}\`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error(await res.text());
        showToast(\`Updated status to '\${newStatus}'\`);
        await fetchSubmissionsAndReports();
      } catch (err) {
        showToast('Error updating status: ' + err.message, true);
      }
    }

    async function deleteSubmissionItem(id) {
      if (!confirm('Are you sure you want to permanently delete this submission record?')) return;
      try {
        const res = await fetch(\`\${SUPABASE_URL}/rest/v1/submissions?id=eq.\${id}\`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': \`Bearer \${SUPABASE_KEY}\`
          }
        });
        if (!res.ok) throw new Error(await res.text());
        showToast('Submission deleted successfully');
        await fetchSubmissionsAndReports();
      } catch (err) {
        showToast('Delete error: ' + err.message, true);
      }
    }

    function quickAddFromSubmission(id) {
      const sub = allSubmissions.find(s => s.id === id);
      if (!sub) return;

      // Switch to companies view
      switchAdminView('view-companies');
      resetForm();

      document.getElementById('field-name').value = sub.company_name || '';
      document.getElementById('field-slug').value = (sub.company_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      document.getElementById('field-pay').value = sub.compensation || '';
      document.getElementById('field-branches').value = sub.branch ? \`\${sub.branch}, All branches open\` : 'All branches open';

      if (sub.role_title) {
        rolesData = [{
          title: sub.role_title,
          type: 'fulltime',
          count: sub.offers_count || 1,
          ctc: sub.compensation || 'Competitive',
          stipend: null,
          rawCompensation: sub.compensation || '',
          notes: sub.details || ''
        }];
        renderRolesRepeater();
      }

      showToast(\`Loaded submission for '\${sub.company_name}' into form editor!\`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // -------------------------------------------------------------
    // CSV / JSON Importer & Template System
    // -------------------------------------------------------------
    const importModal = document.getElementById('import-company-modal');
    const btnOpenImportSidebar = document.getElementById('btn-open-import');
    const btnOpenImportEditor = document.getElementById('btn-editor-open-import');
    const btnOpenImportBanner = document.getElementById('btn-banner-open-import');
    const btnCloseImport = document.getElementById('btn-close-import-modal');
    const btnCancelImport = document.getElementById('btn-cancel-import');

    const fmtTabCsv = document.getElementById('fmt-tab-csv');
    const fmtTabJson = document.getElementById('fmt-tab-json');
    const fmtDisplayCsv = document.getElementById('fmt-display-csv');
    const fmtDisplayJson = document.getElementById('fmt-display-json');
    const btnCopyCsvFmt = document.getElementById('btn-copy-csv-fmt');
    const btnCopyJsonFmt = document.getElementById('btn-copy-json-fmt');

    const dropZone = document.getElementById('drop-zone');
    const importFileInput = document.getElementById('import-file-input');
    const fileChosenName = document.getElementById('file-chosen-name');
    const importTextInput = document.getElementById('import-text-input');
    const btnClearPaste = document.getElementById('btn-clear-paste');
    const importParseStatus = document.getElementById('import-parse-status');
    const btnDoExtract = document.getElementById('btn-do-extract');

    const CSV_TEMPLATE = 'name,slug,pay,payKind,offers,branches,cgpaCriteria,boardsCriteria,visitTimeline,students,roles,notes\\nKelp Global,kelp-global,₹16 LPA,CTC,internship;fulltime,All branches open,8.0+ CGPA,Standard eligibility,Oct 2026,5,Blockchain Engineer:fulltime:5:₹16 LPA,Campus recruitment drive';

    const JSON_TEMPLATE = JSON.stringify({
      name: "Kelp Global",
      slug: "kelp-global",
      pay: "₹16 LPA",
      payKind: "CTC",
      offers: ["internship", "fulltime"],
      dream: false,
      branches: "All branches open",
      cgpaCriteria: "8.0+ CGPA",
      boardsCriteria: "Standard eligibility",
      visitTimeline: "Oct 2026",
      out: {
        students: 5,
        fulltimeOffers: 5,
        internships: 5
      },
      roles: [
        {
          title: "Blockchain Engineer",
          type: "fulltime",
          count: 5,
          ctc: "₹16 LPA",
          stipend: null,
          rawCompensation: "14L fixed + 2L bonus",
          visitDate: "Oct 2026",
          notes: ""
        }
      ],
      funnelRaw: "Applied 120 -> OA 40 -> Tech 15 -> 5 offers",
      notes: "Campus recruitment drive"
    }, null, 2);

    function openImportModal() {
      if (!importModal) return;
      importModal.classList.remove('hidden');
      importModal.classList.add('flex');
      importParseStatus?.classList.add('hidden');
    }

    function closeImportModal() {
      if (!importModal) return;
      importModal.classList.add('hidden');
      importModal.classList.remove('flex');
    }

    [btnOpenImportSidebar, btnOpenImportEditor, btnOpenImportBanner].forEach(btn => {
      btn?.addEventListener('click', openImportModal);
    });

    [btnCloseImport, btnCancelImport].forEach(btn => {
      btn?.addEventListener('click', closeImportModal);
    });

    importModal?.addEventListener('click', (e) => {
      if (e.target === importModal) closeImportModal();
    });

    // Format Tab Switching
    fmtTabCsv?.addEventListener('click', () => {
      fmtTabCsv.className = "cursor-pointer rounded-full px-3 py-1 font-medium bg-fg text-bg transition-colors";
      fmtTabJson.className = "cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-colors";
      fmtDisplayCsv?.classList.remove('hidden');
      fmtDisplayJson?.classList.add('hidden');
      btnCopyCsvFmt?.classList.remove('hidden');
      btnCopyJsonFmt?.classList.add('hidden');
    });

    fmtTabJson?.addEventListener('click', () => {
      fmtTabJson.className = "cursor-pointer rounded-full px-3 py-1 font-medium bg-fg text-bg transition-colors";
      fmtTabCsv.className = "cursor-pointer rounded-full px-3 py-1 font-medium text-muted hover:text-fg transition-colors";
      fmtDisplayJson?.classList.remove('hidden');
      fmtDisplayCsv?.classList.add('hidden');
      btnCopyJsonFmt?.classList.remove('hidden');
      btnCopyCsvFmt?.classList.add('hidden');
    });

    // Copy Format Buttons
    btnCopyCsvFmt?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CSV_TEMPLATE);
        const label = document.getElementById('btn-copy-csv-label');
        if (label) {
          const orig = label.textContent;
          label.textContent = '✔ Copied!';
          setTimeout(() => { label.textContent = orig; }, 2000);
        }
        showToast('CSV format template copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy: ' + err.message, true);
      }
    });

    btnCopyJsonFmt?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(JSON_TEMPLATE);
        const label = document.getElementById('btn-copy-json-label');
        if (label) {
          const orig = label.textContent;
          label.textContent = '✔ Copied!';
          setTimeout(() => { label.textContent = orig; }, 2000);
        }
        showToast('JSON format template copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy: ' + err.message, true);
      }
    });

    // File Input & Drag and Drop Handling
    function handleFileSelected(file) {
      if (!file) return;
      if (fileChosenName) {
        fileChosenName.textContent = file.name + ' (' + (file.size < 1024 ? file.size + ' B' : Math.round(file.size / 1024) + ' KB') + ')';
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (importTextInput) {
          importTextInput.value = e.target.result;
          importParseStatus?.classList.add('hidden');
        }
      };
      reader.readAsText(file);
    }

    importFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFileSelected(file);
    });

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          dropZone.classList.add('border-fg', 'bg-line/40');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          dropZone.classList.remove('border-fg', 'bg-line/40');
        });
      });
      dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        handleFileSelected(file);
      });
    }

    btnClearPaste?.addEventListener('click', () => {
      if (importTextInput) importTextInput.value = '';
      if (fileChosenName) fileChosenName.textContent = 'Accepts .csv or .json files';
      importParseStatus?.classList.add('hidden');
    });

    // CSV Parsing Algorithm
    function parseCSVText(text) {
      const lines = [];
      let row = [''];
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];
        if (c === '"') {
          if (inQuotes && next === '"') {
            row[row.length - 1] += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          row.push('');
        } else if ((c === '\\r' || c === '\\n') && !inQuotes) {
          if (c === '\\r' && next === '\\n') i++;
          lines.push(row);
          row = [''];
        } else {
          row[row.length - 1] += c;
        }
      }
      if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) {
        lines.push(row);
      }
      if (lines.length < 2) return [];

      const headers = lines[0].map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
      const results = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i];
        if (values.every(v => !v.trim())) continue;
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = values[idx] ? values[idx].trim() : '';
        });
        results.push(obj);
      }
      return results;
    }

    // Extraction & Form Population
    function extractAndPopulateForm() {
      const raw = (importTextInput?.value || '').trim();
      if (!raw) {
        if (importParseStatus) {
          importParseStatus.textContent = 'Please choose a file or paste CSV/JSON content first.';
          importParseStatus.classList.remove('hidden');
        }
        return;
      }

      let extractedCompany = null;

      // 1. Attempt JSON parsing
      if (raw.startsWith('{') || raw.startsWith('[')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            extractedCompany = parsed[0];
          } else if (parsed.companies && Array.isArray(parsed.companies)) {
            extractedCompany = parsed.companies[0];
          } else if (parsed.company && typeof parsed.company === 'object') {
            extractedCompany = parsed.company;
          } else {
            extractedCompany = parsed;
          }
        } catch (e) {
          // Fall through to CSV
        }
      }

      // 2. If not JSON, attempt CSV parsing
      if (!extractedCompany) {
        const rows = parseCSVText(raw);
        if (rows && rows.length > 0) {
          const r = rows[0];
          const name = r.name || r.company || r.companyname || r.title || '';
          if (name) {
            const slug = r.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const pay = r.pay || r.ctc || r.package || r.compensation || '';
            const payKind = (r.paykind || (pay.toLowerCase().includes('/mo') || pay.toLowerCase().includes('stipend') ? 'Stipend' : 'CTC'));
            const offers = (r.offers || r.offertypes || '').split(/[;,|]/).map(s => s.trim().toLowerCase()).filter(Boolean);
            if (offers.length === 0) {
              if (payKind === 'Stipend') offers.push('internship');
              else offers.push('fulltime');
            }

            // Extract roles
            let parsedRoles = [];
            if (r.roles) {
              const roleEntries = r.roles.split(/[;|]/).map(s => s.trim()).filter(Boolean);
              parsedRoles = roleEntries.map(entry => {
                const parts = entry.split(':').map(p => p.trim());
                return {
                  title: parts[0] || 'Software Engineer',
                  type: parts[1] || 'fulltime',
                  count: parseInt(parts[2], 10) || 1,
                  ctc: parts[3] || pay || '',
                  stipend: null,
                  rawCompensation: '',
                  visitDate: r.visittimeline || '',
                  notes: ''
                };
              });
            } else if (r.students || r.role) {
              parsedRoles = [{
                title: r.role || 'Software Engineer',
                type: 'fulltime',
                count: parseInt(r.students || 1, 10) || 1,
                ctc: pay || '',
                stipend: null,
                rawCompensation: '',
                visitDate: r.visittimeline || '',
                notes: ''
              }];
            }

            extractedCompany = {
              name,
              slug,
              pay,
              payKind,
              payRank: parseInt(r.payrank || r.rank, 10) || null,
              offers,
              dream: r.dream === 'true' || r.dream === '1',
              branches: r.branches || r.eligiblebranches || 'All branches open',
              cgpaCriteria: r.cgpacriteria || r.cgpa || '',
              boardsCriteria: r.boardscriteria || r.boards || '',
              visitTimeline: r.visittimeline || r.timeline || '',
              notes: r.notes || r.remarks || '',
              status: r.status || '',
              funnelRaw: r.funnelraw || r.funnel || '',
              roles: parsedRoles
            };
          }
        }
      }

      if (!extractedCompany || !extractedCompany.name) {
        if (importParseStatus) {
          importParseStatus.textContent = 'Could not extract valid company data. Please verify the CSV headers or JSON syntax.';
          importParseStatus.classList.remove('hidden');
        }
        return;
      }

      // Initialize form in create mode
      resetForm();

      // Populate Extracted Fields
      const c = extractedCompany;
      const compName = c.name || '';
      const compSlug = c.slug || compName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      document.getElementById('field-name').value = compName;
      document.getElementById('field-slug').value = compSlug;
      document.getElementById('field-pay').value = c.pay || '';
      document.getElementById('field-pay-kind').value = c.payKind || (c.pay && c.pay.toLowerCase().includes('/mo') ? 'Stipend' : 'CTC');
      if (c.payRank) document.getElementById('field-pay-rank').value = c.payRank;
      document.getElementById('field-status').value = c.status || '';
      document.getElementById('field-branches').value = c.branches || 'All branches open';
      document.getElementById('field-cgpa-criteria').value = c.cgpaCriteria || c.cgpa_criteria || '';
      document.getElementById('field-boards-criteria').value = c.boardsCriteria || c.boards_criteria || '';
      document.getElementById('field-timeline').value = c.visitTimeline || c.visit_timeline || '';
      document.getElementById('field-notes').value = c.notes || '';
      document.getElementById('field-logo').value = c.logo || ('/logos/' + compSlug + '.svg');
      updateLogoPreview(c.logo || ('/logos/' + compSlug + '.svg'));

      const offers = Array.isArray(c.offers) ? c.offers : (c.offers || '').split(/[;,|]/).map(s => s.trim().toLowerCase());
      document.getElementById('check-offer-intern').checked = offers.includes('internship');
      document.getElementById('check-offer-fulltime').checked = offers.includes('fulltime');
      document.getElementById('check-offer-ppo').checked = offers.includes('ppo');
      document.getElementById('check-dream').checked = !!c.dream;

      // Populate Roles
      if (c.roles && Array.isArray(c.roles) && c.roles.length > 0) {
        rolesData = JSON.parse(JSON.stringify(c.roles));
      } else if (c.out && c.out.students) {
        rolesData = [{
          title: "Graduate Engineer",
          type: "fulltime",
          count: c.out.students || 1,
          ctc: c.pay || '',
          stipend: null,
          rawCompensation: '',
          visitDate: c.visitTimeline || '',
          notes: ''
        }];
      }
      renderRolesRepeater();

      // Populate Funnel / Stages
      if (c.funnelRaw || c.funnel_raw) {
        document.getElementById('field-funnel-raw').value = c.funnelRaw || c.funnel_raw;
        parsePipelineString(c.funnelRaw || c.funnel_raw);
      } else if (c.roles && c.roles.length > 0 && c.roles[0].funnel && c.roles[0].funnel.length > 0) {
        stagesData = JSON.parse(JSON.stringify(c.roles[0].funnel));
        renderStagesRepeater();
        renderFunnelPreview();
      }

      editorTitle.textContent = compName;
      editorModeBadge.textContent = "Extracted / New";
      editorModeBadge.className = "chip text-[11px] font-mono text-intern border-intern/30 bg-intern/10";

      closeImportModal();
      showToast(\`Extracted '\${compName}' data directly into company editor!\`);

      // Switch to overview tab
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active', 'border-fg', 'text-fg');
        b.classList.add('border-transparent', 'text-muted');
      });
      const firstTab = document.querySelector('.tab-btn[data-tab="tab-overview"]');
      if (firstTab) {
        firstTab.classList.add('active', 'border-fg', 'text-fg');
        firstTab.classList.remove('border-transparent', 'text-muted');
      }
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      document.getElementById('tab-overview')?.classList.remove('hidden');

      const editorForm = document.getElementById('company-editor-form');
      editorForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    btnDoExtract?.addEventListener('click', extractAndPopulateForm);

    // Ctrl+S / Cmd+S Keyboard Shortcut
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCompanyHandler();
      }
    });
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
  console.log('admin/index.html created successfully with Supabase Cloud DB & Auth Gate!');
}

generateAdminPage();
