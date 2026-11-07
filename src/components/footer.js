import { siteConfig } from '../config/site.js';

export function renderFooter() {
  return `
    <footer class="wrap mt-24 border-t border-line">
      <div class="grid grid-cols-2 items-start gap-2.5 py-6 lg:grid-cols-3 lg:py-8">
        <!-- 01 Feedback -->
        <a class="group relative isolate flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong p-4 transition-colors duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="${siteConfig.footer.feedbackLink}">
          <span aria-hidden="true" class="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-fg transition-transform duration-500 ease-[var(--ease)] group-hover:scale-y-100 group-focus-visible:scale-y-100"></span>
          <span class="flex items-start justify-between">
            <span class="label text-faint transition-colors group-hover:text-bg/50">01</span>
            <span class="grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-bg group-hover:bg-bg group-hover:text-fg">
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
            </span>
          </span>
          <span>
            <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-bg">Give feedback</span>
            <span class="mt-1.5 block text-[12px] leading-snug text-muted transition-colors group-hover:text-bg/70 max-sm:hidden">Rate the site and tell us what to improve. Anonymous.</span>
          </span>
        </a>

        <!-- 02 Correction -->
        <a class="group relative isolate flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong p-4 transition-colors duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="${siteConfig.footer.correctionLink}">
          <span aria-hidden="true" class="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-fg transition-transform duration-500 ease-[var(--ease)] group-hover:scale-y-100 group-focus-visible:scale-y-100"></span>
          <span class="flex items-start justify-between">
            <span class="label text-faint transition-colors group-hover:text-bg/50">02</span>
            <span class="grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-bg group-hover:bg-bg group-hover:text-fg">
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
            </span>
          </span>
          <span>
            <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-bg">Report a correction</span>
            <span class="mt-1.5 block text-[12px] leading-snug text-muted transition-colors group-hover:text-bg/70 max-sm:hidden">A wrong figure, date or detail? Tell us and we’ll check it.</span>
          </span>
        </a>

        <!-- 03 Spread the word (Interactive Share) -->
        <div class="share-ring rounded-2xl p-px col-span-2 lg:col-span-1">
          <div class="group relative isolate overflow-hidden rounded-[15px] bg-bg">
            <div class="relative isolate">
              <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 flex items-start overflow-hidden pt-[42px] sm:pt-[38px]">
                <div class="share-marquee flex w-max whitespace-nowrap font-display text-[38px] sm:text-[33px] leading-none tracking-[-0.04em] text-line-strong">
                  <span>Share · Spread the word · ${siteConfig.siteTitle} · Share · Spread the word · ${siteConfig.siteTitle} · </span>
                  <span>Share · Spread the word · ${siteConfig.siteTitle} · Share · Spread the word · ${siteConfig.siteTitle} · </span>
                </div>
              </div>
              <button id="share-toggle-btn" type="button" aria-expanded="false" class="flex min-h-[126px] w-full flex-col justify-between bg-gradient-to-t from-bg via-bg/40 to-transparent p-4 text-left sm:min-h-[140px] sm:p-5">
                <span class="flex items-start justify-between gap-4">
                  <span class="label text-faint">03 · Spread the word</span>
                  <span class="relative grid size-10 shrink-0 place-items-center">
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-intern);animation-delay:0s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-fulltime);animation-delay:0.8s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-ppo);animation-delay:1.6s"></span>
                    <span class="relative grid size-10 place-items-center rounded-full bg-fg text-bg transition-transform duration-500 ease-[var(--ease)] group-hover:scale-110">
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M14.5 1.5 7 9M14.5 1.5 10 14.5 7 9 1.5 6l13-4.5Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
                      </svg>
                    </span>
                  </span>
                </span>
                <span>
                  <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] text-fg">Share this website</span>
                  <span class="mt-1.5 block text-[12px] leading-snug text-muted max-sm:hidden">Send it to your batchmates and juniors.</span>
                </span>
              </button>
            </div>
            
            <!-- Expandable Share Options Tray -->
            <div id="share-options-tray" class="hidden border-t border-line p-4 sm:px-5">
              <div class="flex flex-wrap items-center gap-2.5">
                <button id="copy-link-btn" type="button" class="label rounded-full bg-fg px-4 py-2 text-bg transition-opacity hover:opacity-90 inline-flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="5" y="5" width="8" height="8" rx="1.5"/>
                    <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11"/>
                  </svg>
                  <span id="copy-text">Copy link</span>
                </button>
                <a id="share-whatsapp" target="_blank" rel="noopener noreferrer" class="label rounded-full border border-line-strong px-4 py-2 text-muted transition-colors hover:border-fg hover:text-fg" href="https://api.whatsapp.com/send?text=${encodeURIComponent(siteConfig.siteTitle + ' - ' + siteConfig.collegeName + ' Placement Stats: ' + window.location.origin)}">WhatsApp</a>
                <a id="share-twitter" target="_blank" rel="noopener noreferrer" class="label rounded-full border border-line-strong px-4 py-2 text-muted transition-colors hover:border-fg hover:text-fg" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(siteConfig.siteTitle + ' - Campus Placement Stats for ' + siteConfig.collegeName)}">Twitter / X</a>
                <a id="share-linkedin" target="_blank" rel="noopener noreferrer" class="label rounded-full border border-line-strong px-4 py-2 text-muted transition-colors hover:border-fg hover:text-fg" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex min-h-12 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-4">
        <div class="flex items-center gap-6">
          <a class="label text-[12px] text-faint transition-colors hover:text-fg" href="${siteConfig.footer.contactLink}">Contact</a>
          <a class="label text-[12px] text-faint transition-colors hover:text-intern font-mono" href="/admin/">Admin</a>
          <span class="label text-[12px] text-faint">${siteConfig.collegeName} · ${siteConfig.batchLabel}</span>
        </div>
        <p class="label text-[11px] text-faint">Data maintained for student community awareness</p>
      </div>
    </footer>
  `;
}

export function initFooter() {
  const toggleBtn = document.getElementById('share-toggle-btn');
  const tray = document.getElementById('share-options-tray');
  const copyBtn = document.getElementById('copy-link-btn');
  const copyText = document.getElementById('copy-text');

  if (toggleBtn && tray) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = tray.classList.contains('hidden');
      if (isHidden) {
        tray.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        tray.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyText.textContent = "Copied link!";
        setTimeout(() => {
          copyText.textContent = "Copy link";
        }, 2500);
      }).catch(() => {
        copyText.textContent = "Link copied";
      });
    });
  }
}
