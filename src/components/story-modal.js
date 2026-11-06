import { getActiveBatchData } from '../data/batches.js';

export function renderStoryModal() {
  const batchData = getActiveBatchData();
  const recap = batchData.recap || { slides: [] };

  return `
    <div id="story-modal" class="fixed inset-0 z-50 hidden bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
      <div class="relative w-full max-w-[420px] h-[680px] max-h-[92vh] rounded-[28px] border border-line-strong bg-panel flex flex-col justify-between overflow-hidden shadow-2xl">
        
        <!-- Story Progress Bars at Top -->
        <div id="story-progress-container" class="absolute top-4 inset-x-4 flex gap-1.5 z-20">
          ${recap.slides.map((_, i) => `
            <div class="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div id="progress-bar-${i}" class="h-full bg-white transition-all duration-100" style="width: 0%"></div>
            </div>
          `).join('')}
        </div>

        <!-- Story Header: Company info and Close button -->
        <div class="relative z-20 flex items-center justify-between p-6 pt-8">
          <div id="story-header-info" class="flex items-center gap-3">
            <img id="story-logo" src="/logos/barclays.png" alt="" class="size-8 rounded-full bg-white/10 p-1 object-contain hidden" />
            <div>
              <h4 id="story-company-name" class="font-display text-[17px] font-semibold text-fg"></h4>
              <p id="story-subtitle" class="text-[12px] text-muted"></p>
            </div>
          </div>
          <button id="close-story-btn" class="size-8 rounded-full border border-line-strong grid place-items-center text-muted hover:text-fg hover:border-fg transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 2l10 10M12 2L2 12"/>
            </svg>
          </button>
        </div>

        <!-- Story Center Visual / Card -->
        <div class="relative z-20 flex-1 flex flex-col justify-center px-8 text-center select-none">
          <span id="story-badge" class="label mx-auto mb-4 inline-block rounded-full border border-line-strong px-3 py-1 text-[11px] text-muted"></span>
          <div id="story-stat" class="font-display text-[clamp(40px,7vw,64px)] font-bold tracking-tight text-fg leading-none mb-3"></div>
          <p id="story-text" class="text-[16px] leading-relaxed text-muted max-w-[34ch] mx-auto"></p>
        </div>

        <!-- Story Footer Button / Link -->
        <div class="relative z-20 p-6 pt-0">
          <a id="story-action-link" href="/companies/" class="label flex w-full items-center justify-center rounded-full bg-fg py-3 text-[14px] font-medium text-bg transition-opacity hover:opacity-90">
            View Company Details
          </a>
        </div>

        <!-- Tap target navigation overlays (left half prev, right half next) -->
        <div id="story-tap-prev" class="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer"></div>
        <div id="story-tap-next" class="absolute inset-y-16 right-0 w-2/3 z-10 cursor-pointer"></div>
      </div>
    </div>
  `;
}

export function initStoryModal() {
  const modal = document.getElementById('story-modal');
  const closeBtn = document.getElementById('close-story-btn');
  const tapPrev = document.getElementById('story-tap-prev');
  const tapNext = document.getElementById('story-tap-next');
  
  if (!modal) return;

  const batchData = getActiveBatchData();
  const slides = (batchData.recap && batchData.recap.slides) ? batchData.recap.slides : [];
  let currentIdx = 0;
  let timer = null;
  let progress = 0;
  const slideDuration = 5000; // 5 seconds per slide
  const intervalStep = 50;

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) {
      closeStory();
      return;
    }
    currentIdx = index;
    progress = 0;

    const s = slides[currentIdx];
    const logoEl = document.getElementById('story-logo');
    const nameEl = document.getElementById('story-company-name');
    const subEl = document.getElementById('story-subtitle');
    const badgeEl = document.getElementById('story-badge');
    const statEl = document.getElementById('story-stat');
    const textEl = document.getElementById('story-text');
    const actionEl = document.getElementById('story-action-link');

    if (nameEl) nameEl.textContent = s.company || s.title;
    if (subEl) subEl.textContent = s.subtitle || '';
    if (badgeEl) badgeEl.textContent = s.badge || 'Recap';
    if (statEl) statEl.textContent = s.stat || '';
    if (textEl) textEl.textContent = s.text || '';
    
    if (logoEl) {
      if (s.logo) {
        logoEl.src = s.logo;
        logoEl.classList.remove('hidden');
      } else {
        logoEl.classList.add('hidden');
      }
    }

    if (actionEl && s.slug) {
      actionEl.href = `/companies/company.html?slug=${s.slug}`;
      actionEl.textContent = `View ${s.company} Details →`;
    }

    // Reset all progress bars
    for (let i = 0; i < slides.length; i++) {
      const p = document.getElementById(`progress-bar-${i}`);
      if (p) {
        if (i < currentIdx) p.style.width = '100%';
        else if (i > currentIdx) p.style.width = '0%';
        else p.style.width = '0%';
      }
    }

    clearInterval(timer);
    timer = setInterval(() => {
      progress += (intervalStep / slideDuration) * 100;
      const currentBar = document.getElementById(`progress-bar-${currentIdx}`);
      if (currentBar) currentBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(timer);
        showSlide(currentIdx + 1);
      }
    }, intervalStep);
  }

  function openStory() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    showSlide(0);
  }

  function closeStory() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    clearInterval(timer);
  }

  // Trigger buttons across the site
  document.querySelectorAll('.play-recap-trigger').forEach(btn => {
    btn.addEventListener('click', openStory);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeStory);
  if (tapPrev) tapPrev.addEventListener('click', () => showSlide(currentIdx - 1));
  if (tapNext) tapNext.addEventListener('click', () => showSlide(currentIdx + 1));

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeStory();
    }
  });
}
