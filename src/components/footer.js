import { siteConfig } from '../config/site.js';

export function renderFooter() {
  return `
    <footer class="wrap mt-24 border-t border-line">
      <div class="grid grid-cols-2 items-start gap-2.5 py-6 lg:grid-cols-3 lg:py-8">
        <!-- 01 Feedback -->
        <a class="group relative isolate flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong bg-panel p-4 transition-all duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="${siteConfig.footer.feedbackLink}">
          <span class="flex items-start justify-between">
            <span class="label text-faint transition-colors group-hover:text-muted">01</span>
            <span class="grid size-10 place-items-center rounded-full border border-line-strong text-fg transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-fg group-hover:bg-line-strong">
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
            </span>
          </span>
          <span>
            <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] text-fg transition-colors group-hover:text-fg">Give feedback</span>
            <span class="mt-1.5 block text-[12px] leading-snug text-muted transition-colors group-hover:text-muted max-sm:hidden">Rate the site and tell us what to improve. Anonymous.</span>
          </span>
        </a>

        <!-- 02 Correction -->
        <a class="group relative isolate flex min-h-[128px] flex-col justify-between overflow-hidden rounded-2xl border border-line-strong bg-panel p-4 transition-all duration-300 hover:border-fg sm:min-h-[142px] sm:p-5" href="${siteConfig.footer.correctionLink}">
          <span class="flex items-start justify-between">
            <span class="label text-faint transition-colors group-hover:text-muted">02</span>
            <span class="grid size-10 place-items-center rounded-full border border-line-strong text-fg transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-fg group-hover:bg-line-strong">
              <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>
            </span>
          </span>
          <span>
            <span class="block font-display text-[clamp(19px,1.8vw,26px)] leading-[1.05] tracking-[-0.03em] text-fg transition-colors group-hover:text-fg">Report a correction</span>
            <span class="mt-1.5 block text-[12px] leading-snug text-muted transition-colors group-hover:text-muted max-sm:hidden">A wrong figure, date or detail? Tell us and we’ll check it.</span>
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
              <button id="share-toggle-btn" type="button" aria-expanded="false" class="flex min-h-[126px] w-full flex-col justify-between bg-gradient-to-t from-bg via-bg/40 to-transparent p-4 text-left sm:min-h-[140px] sm:p-5 cursor-pointer">
                <span class="flex items-start justify-between gap-4">
                  <span class="label text-faint">03 · Spread the word</span>
                  <span class="relative grid size-10 shrink-0 place-items-center">
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-intern);animation-delay:0s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-fulltime);animation-delay:0.8s"></span>
                    <span aria-hidden="true" class="share-ripple absolute inset-0 rounded-full border" style="border-color:var(--color-ppo);animation-delay:1.6s"></span>
                    <span class="relative grid size-10 place-items-center rounded-full border border-line-strong bg-line-strong text-fg transition-all duration-300 group-hover:scale-110 group-hover:border-fg">
                      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
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
                <button id="copy-link-btn" type="button" class="label rounded-full border border-line-strong bg-panel px-4 py-2 text-fg font-medium transition-all hover:border-fg hover:bg-line-strong inline-flex items-center gap-2 cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="5" y="5" width="8" height="8" rx="1.5"/>
                    <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11"/>
                  </svg>
                  <span id="copy-text">Copy link</span>
                </button>
                <a id="share-whatsapp" target="_blank" rel="noopener noreferrer" class="label rounded-full border border-line-strong bg-panel px-4 py-2 text-fg font-medium transition-all hover:border-[#25D366] hover:text-[#25D366] hover:bg-line-strong/50 inline-flex items-center gap-2 cursor-pointer" href="https://api.whatsapp.com/send?text=${encodeURIComponent(siteConfig.siteTitle + ' - ' + siteConfig.collegeName + ' Placement Stats')}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
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
  const waLink = document.getElementById('share-whatsapp');

  if (waLink && typeof window !== 'undefined') {
    waLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(siteConfig.siteTitle + ' · ' + siteConfig.collegeShort + ' Placement Stats: ' + window.location.href)}`;
  }

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

