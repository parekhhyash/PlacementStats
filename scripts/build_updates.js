const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateUpdatesPage() {
  const content = `
    <section class="wrap flex flex-col gap-6 pb-6 pt-[clamp(28px,3.5vw,48px)] lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div>
        <p id="updates-page-badge" class="label text-muted">Updates · Newest first</p>
        <h1 class="display-l mt-4">What just changed.</h1>
      </div>

      <!-- Notification Switch Box -->
      <div class="w-full max-w-[400px] rounded-2xl border border-line-strong p-4 lg:shrink-0 bg-panel">
        <div class="flex items-center gap-3.5">
          <button id="notify-updates-toggle" type="button" role="switch" aria-checked="false" class="signal bg-line-strong shrink-0 rounded-[11px] p-px transition-opacity cursor-pointer">
            <span class="signal-track">
              <span class="signal-thumb">
                <span class="signal-face signal-off-face">
                  <svg viewBox="7 6.5 19 19" aria-hidden="true" class="size-[15px]"><path d="M9 7H13.5V25H9Z" fill="currentColor"></path><path d="M9 7H24V15L19 20H9Z M13.5 11.5V15.5H17.14L19.5 13.14V11.5Z" fill="currentColor" fill-rule="evenodd"></path></svg>
                </span>
                <span class="signal-face signal-on-face">
                  <svg viewBox="7 6.5 19 19" aria-hidden="true" class="size-[15px]"><path d="M9 7H13.5V25H9Z" fill="currentColor"></path><path d="M9 7H24V15L19 20H9Z M13.5 11.5V15.5H17.14L19.5 13.14V11.5Z" fill="currentColor" fill-rule="evenodd"></path></svg>
                </span>
              </span>
            </span>
          </button>
          <span class="min-w-0">
            <span class="block leading-snug text-[14px] font-medium text-fg">Tell me when results are up</span>
            <span id="notify-updates-status" class="mt-0.5 block text-[12px] leading-snug text-faint">Instant notifications for new selection notices.</span>
          </span>
        </div>
      </div>
    </section>

    <div class="wrap">
      <!-- Filter Chips -->
      <div class="mt-6 flex flex-wrap gap-2 border-b border-line pb-6">
        <button class="update-filter-btn rounded-full border border-fg bg-fg px-4 py-1.5 text-[12px] font-medium text-bg cursor-pointer" data-category="all">All</button>
        <button class="update-filter-btn rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg cursor-pointer" data-category="Results">Results</button>
        <button class="update-filter-btn rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg cursor-pointer" data-category="Shortlist">Shortlists</button>
        <button class="update-filter-btn rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg cursor-pointer" data-category="Drive">Drives</button>
        <button class="update-filter-btn rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg cursor-pointer" data-category="Interview">Interviews</button>
      </div>

      <!-- Updates Feed -->
      <div id="updates-feed" class="mt-8 grid gap-4">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  const extraScript = `
    import { getActiveBatchData, getBatchKey } from '/src/data/batches.js';

    const batch = getActiveBatchData();
    const is2028 = batch.year === '2028';
    const updatesData = batch.updates || [];

    const badgeEl = document.getElementById('updates-page-badge');
    if (badgeEl) badgeEl.textContent = \`Updates · SPIT Class of \${batch.year}\`;

    const feedEl = document.getElementById('updates-feed');
    const filterBtns = document.querySelectorAll('.update-filter-btn');
    let activeCategory = 'all';

    function renderFeed() {
      const filtered = activeCategory === 'all' 
        ? updatesData 
        : updatesData.filter(u => u.category.toLowerCase() === activeCategory.toLowerCase());

      feedEl.innerHTML = filtered.map(u => \`
        <article class="rounded-2xl border border-line bg-panel p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:border-line-strong transition-colors">
          <div class="flex items-start gap-4">
            <div class="size-11 shrink-0 rounded-xl border border-line bg-bg p-2 grid place-items-center">
              \${u.logo ? '<img src="' + u.logo + '" class="size-full object-contain" />' : '<span class="font-bold text-muted text-[13px]">' + u.company.charAt(0) + '</span>'}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="chip"><i class="dot" style="background:var(--color-intern)"></i>\${u.category}</span>
                <span class="label text-[12px] text-faint">\${u.timestamp}</span>
              </div>
              <h3 class="font-display text-[19px] font-semibold text-fg mt-2">\${u.title}</h3>
              <p class="mt-2 text-[14px] leading-relaxed text-muted max-w-[65ch]">\${u.content}</p>
            </div>
          </div>
          <a href="/companies/company.html?slug=\${u.companySlug}\${is2028 ? '&batch=2028' : ''}" class="label text-[12px] text-fg hover:underline shrink-0 self-end sm:self-center">
            View Company →
          </a>
        </article>
      \`).join('');
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.className = "update-filter-btn rounded-full border border-line-strong px-4 py-1.5 text-[12px] text-muted hover:border-fg hover:text-fg cursor-pointer";
        });
        btn.className = "update-filter-btn rounded-full border border-fg bg-fg px-4 py-1.5 text-[12px] font-medium text-bg cursor-pointer";
        activeCategory = btn.getAttribute('data-category');
        renderFeed();
      });
    });

    const notifyToggle = document.getElementById('notify-updates-toggle');
    const notifyStatus = document.getElementById('notify-updates-status');
    if (notifyToggle && notifyStatus) {
      let active = false;
      notifyToggle.addEventListener('click', () => {
        active = !active;
        notifyToggle.setAttribute('aria-checked', String(active));
        if (active) {
          notifyToggle.classList.add('bg-intern');
          notifyToggle.classList.remove('bg-line-strong');
          notifyStatus.textContent = "Notifications active for new updates.";
        } else {
          notifyToggle.classList.remove('bg-intern');
          notifyToggle.classList.add('bg-line-strong');
          notifyStatus.textContent = "Instant notifications for new selection notices.";
        }
      });
    }

    renderFeed();
  `;

  const html = pageTemplate({
    title: `Updates · Placed · ${siteConfig.collegeShort}`,
    activePath: '/updates/',
    content,
    extraScript
  });

  fs.writeFileSync('updates/index.html', html);
  console.log('updates/index.html created successfully with Multi-Batch support!');
}

generateUpdatesPage();
