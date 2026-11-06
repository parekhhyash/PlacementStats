import { getActiveBatchData } from '../data/batches.js';

export function renderTicker() {
  const batchData = getActiveBatchData();
  const updates = batchData.updates || [];
  const latest = updates[0] || { title: "Campus Placements Ongoing", company: "SPIT" };
  const displayText = (latest.company + " · " + latest.title).toUpperCase().padEnd(36, " ").slice(0, 36);

  const flapCells = displayText.split('').map((char) => `
    <span class="flap">
      <i class="flap-half flap-top"><b>${char === ' ' ? '&nbsp;' : char}</b></i>
      <i class="flap-half flap-bottom"><b>${char === ' ' ? '&nbsp;' : char}</b></i>
    </span>
  `).join('');

  return `
    <section class="wrap mt-[clamp(40px,5vw,72px)]">
      <div class="mb-5 flex items-center justify-between gap-4 border-t border-line pt-6">
        <p class="label text-faint">Just in</p>
        <a class="label link-underline text-fg" href="/updates/">All updates →</a>
      </div>

      <a class="group block" aria-label="Latest update: ${latest.title}" href="/updates/">
        <div id="ticker-flap-board" aria-hidden="true" class="flap-board overflow-x-auto [scrollbar-width:none]" style="--flap-w:24px;--flap-h:40px;--flap-f:20px;grid-template-columns:repeat(36, var(--flap-w))">
          ${flapCells}
        </div>
        <i aria-hidden="true" class="flap-led" style="background:var(--color-intern);box-shadow:0 0 10px var(--color-intern)"></i>
      </a>

      <!-- Notification Switch Control -->
      <div class="mt-8 flex items-center gap-3.5">
        <button id="notify-toggle" type="button" role="switch" aria-checked="false" aria-label="Notify me when new results are up" class="signal bg-line-strong shrink-0 rounded-[11px] p-px transition-opacity cursor-pointer">
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
          <span class="block leading-snug text-[13px] text-fg">Tell me when results are up</span>
          <span id="notify-status" class="block text-[11px] text-faint">Instant alerts when a company releases final results</span>
        </span>
      </div>
    </section>
  `;
}

export function initTicker() {
  const batchData = getActiveBatchData();
  const updates = batchData.updates || [];

  const toggle = document.getElementById('notify-toggle');
  const status = document.getElementById('notify-status');
  const board = document.getElementById('ticker-flap-board');

  if (toggle && status) {
    let enabled = false;
    toggle.addEventListener('click', () => {
      enabled = !enabled;
      toggle.setAttribute('aria-checked', String(enabled));
      if (enabled) {
        toggle.classList.add('bg-intern');
        toggle.classList.remove('bg-line-strong');
        status.textContent = "Notifications enabled for this browser!";
      } else {
        toggle.classList.remove('bg-intern');
        toggle.classList.add('bg-line-strong');
        status.textContent = "Instant alerts when a company releases final results";
      }
    });
  }

  // Character rotation cycle
  if (board && updates.length > 1) {
    let updateIndex = 0;
    setInterval(() => {
      updateIndex = (updateIndex + 1) % updates.length;
      const u = updates[updateIndex];
      const str = (u.company + " · " + u.title).toUpperCase().padEnd(36, " ").slice(0, 36);
      const flaps = board.querySelectorAll('.flap');
      str.split('').forEach((char, i) => {
        if (flaps[i]) {
          const bs = flaps[i].querySelectorAll('b');
          bs.forEach(b => { b.innerHTML = char === ' ' ? '&nbsp;' : char; });
        }
      });
    }, 6000);
  }
}
