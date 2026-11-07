const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateAboutPage() {
  const redirectHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Redirecting...</title><meta http-equiv="refresh" content="0; url=/"><script>window.location.replace('/');</script></head><body></body></html>`;
  fs.writeFileSync('about/index.html', redirectHtml);
  console.log('about/index.html replaced with redirect to /');
}

function generateFeedbackPage() {
  const content = `
    <section class="wrap pb-16 pt-[clamp(48px,8vw,112px)] max-w-[700px]">
      <div class="flex items-center gap-2">
        <a href="/" class="label text-muted hover:text-fg transition-colors">Home</a>
        <span class="text-faint">/</span>
        <span class="label text-fg">Feedback</span>
      </div>
      <p class="label text-intern mt-3 uppercase tracking-wider font-mono text-[11px]">Community Voice</p>
      <h1 class="display-l mt-3">Give feedback.</h1>
      <p class="mt-4 text-[16px] text-muted leading-relaxed">
        Help us make the SPIT placement dashboard better. Rate your experience, suggest new analytics or recruiter metrics, or share your thoughts. Every feedback is sent directly to the placement admin dashboard.
      </p>

      <!-- Feedback Submission Form -->
      <form id="feedback-form" class="mt-10 grid gap-6">
        <!-- 1. Star Rating Selector -->
        <div>
          <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">How would you rate your experience? *</label>
          <div class="grid grid-cols-5 gap-2 sm:gap-3" id="rating-buttons-group">
            <label class="rating-card flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl border border-line-strong bg-panel cursor-pointer hover:border-amber-400/60 transition-all text-center" data-rating="1">
              <input type="radio" name="rating" value="1" class="sr-only rating-input" />
              <span class="text-[18px] sm:text-[22px] leading-none mb-1 text-amber-400">★</span>
              <span class="font-display text-[15px] sm:text-[16px] font-medium text-fg">1</span>
              <span class="text-[10px] text-muted hidden sm:block mt-0.5">Poor</span>
            </label>
            <label class="rating-card flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl border border-line-strong bg-panel cursor-pointer hover:border-amber-400/60 transition-all text-center" data-rating="2">
              <input type="radio" name="rating" value="2" class="sr-only rating-input" />
              <span class="text-[18px] sm:text-[22px] leading-none mb-1 text-amber-400">★</span>
              <span class="font-display text-[15px] sm:text-[16px] font-medium text-fg">2</span>
              <span class="text-[10px] text-muted hidden sm:block mt-0.5">Fair</span>
            </label>
            <label class="rating-card flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl border border-line-strong bg-panel cursor-pointer hover:border-amber-400/60 transition-all text-center" data-rating="3">
              <input type="radio" name="rating" value="3" class="sr-only rating-input" />
              <span class="text-[18px] sm:text-[22px] leading-none mb-1 text-amber-400">★</span>
              <span class="font-display text-[15px] sm:text-[16px] font-medium text-fg">3</span>
              <span class="text-[10px] text-muted hidden sm:block mt-0.5">Good</span>
            </label>
            <label class="rating-card flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl border border-line-strong bg-panel cursor-pointer hover:border-amber-400/60 transition-all text-center" data-rating="4">
              <input type="radio" name="rating" value="4" class="sr-only rating-input" />
              <span class="text-[18px] sm:text-[22px] leading-none mb-1 text-amber-400">★</span>
              <span class="font-display text-[15px] sm:text-[16px] font-medium text-fg">4</span>
              <span class="text-[10px] text-muted hidden sm:block mt-0.5">Very Good</span>
            </label>
            <label class="rating-card selected flex flex-col items-center justify-center p-3 sm:py-3.5 rounded-2xl border border-amber-400 bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30 cursor-pointer transition-all text-center" data-rating="5">
              <input type="radio" name="rating" value="5" checked class="sr-only rating-input" />
              <span class="text-[18px] sm:text-[22px] leading-none mb-1 text-amber-400">★</span>
              <span class="font-display text-[15px] sm:text-[16px] font-medium text-amber-300">5</span>
              <span class="text-[10px] text-amber-300/80 hidden sm:block mt-0.5">Excellent</span>
            </label>
          </div>
          <p id="rating-label" class="label text-[12px] text-amber-400 mt-2">Selected: 5 - Excellent ★★★★★</p>
        </div>

        <!-- 2. Category Selector -->
        <div>
          <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Topic / Feedback Category *</label>
          <select id="feedback-category" required class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
            <option value="Feature Suggestion" class="bg-[#121316] text-[#ededed]">Feature Suggestion / New Analytics</option>
            <option value="Placement Data & Recruiters" class="bg-[#121316] text-[#ededed]">Placement Data & Recruiter Info</option>
            <option value="UI & User Experience" class="bg-[#121316] text-[#ededed]">UI, Design & Usability</option>
            <option value="Bug Report" class="bg-[#121316] text-[#ededed]">Bug Report / Something is Broken</option>
            <option value="Appreciation & General" class="bg-[#121316] text-[#ededed]">General Feedback & Appreciation</option>
          </select>
        </div>

        <!-- 3. Feedback Details Textarea -->
        <div>
          <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Your Feedback or Suggestions *</label>
          <textarea id="feedback-comment" rows="5" required placeholder="What do you think of the portal? What metrics, graphs, or company details would help you most? Feel free to be as detailed as you like..." class="w-full rounded-2xl border border-line-strong bg-panel p-4 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint leading-relaxed"></textarea>
        </div>

        <!-- 4. Submitter Info (Optional) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Your Name (optional)</label>
            <input id="feedback-name" type="text" placeholder="Leave blank to remain anonymous" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Email or Contact (optional)</label>
            <input id="feedback-email" type="text" placeholder="e.g. name@spit.ac.in (for follow-up)" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
        </div>

        <!-- 5. Academic Details (Optional) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Your Branch (optional)</label>
            <select id="feedback-branch" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
              <option value="" class="bg-[#121316] text-[#ededed]">Select Branch</option>
              <option value="CSE" class="bg-[#121316] text-[#ededed]">Computer Engineering (CSE)</option>
              <option value="IT" class="bg-[#121316] text-[#ededed]">Information Technology (IT)</option>
              <option value="EXTC" class="bg-[#121316] text-[#ededed]">Electronics & Telecom (EXTC)</option>
              <option value="AIDS" class="bg-[#121316] text-[#ededed]">AI & Data Science (AI & DS)</option>
              <option value="Other" class="bg-[#121316] text-[#ededed]">Other / Recruiter / Faculty</option>
            </select>
          </div>
          <div>
            <label class="label text-faint block mb-2 uppercase tracking-wider text-[11px]">Your Batch (optional)</label>
            <select id="feedback-batch" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
              <option value="2027" class="bg-[#121316] text-[#ededed]">Class of 2027</option>
              <option value="2028" class="bg-[#121316] text-[#ededed]">Class of 2028</option>
              <option value="Junior" class="bg-[#121316] text-[#ededed]">Junior (Class of 2029+)</option>
              <option value="Alumni" class="bg-[#121316] text-[#ededed]">Alumni</option>
              <option value="Visitor" class="bg-[#121316] text-[#ededed]">Recruiter / Visitor</option>
            </select>
          </div>
        </div>

        <button type="submit" id="btn-submit-feedback" class="mt-2 flex items-center justify-center gap-2 label rounded-full bg-fg py-4 text-bg font-medium transition-opacity hover:opacity-90 cursor-pointer shadow-lg">
          <span id="feedback-btn-text">Submit Feedback →</span>
          <span id="feedback-spinner" class="hidden size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
        </button>

        <div id="feedback-success" class="hidden rounded-2xl border border-intern/40 bg-intern/10 p-6 text-center">
          <span class="text-[28px] block mb-2">🎉</span>
          <h3 class="font-display text-[18px] font-semibold text-fg">Thank You for Your Feedback!</h3>
          <p class="text-[14px] text-muted max-w-[45ch] mx-auto mt-2 leading-relaxed">
            Your feedback and suggestions have been delivered directly to the placement administrator dashboard.
          </p>
          <button type="button" id="btn-feedback-again" class="mt-4 label text-[12px] text-intern hover:underline cursor-pointer">
            Submit another feedback
          </button>
        </div>

        <p id="feedback-error" class="hidden text-center text-red-400 text-[14px] p-3 rounded-xl border border-red-500/30 bg-red-500/10"></p>
      </form>
    </section>
  `;

  const extraScript = `
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    const form = document.getElementById('feedback-form');
    const success = document.getElementById('feedback-success');
    const errorEl = document.getElementById('feedback-error');
    const btn = document.getElementById('btn-submit-feedback');
    const spinner = document.getElementById('feedback-spinner');
    const btnText = document.getElementById('feedback-btn-text');
    const ratingLabel = document.getElementById('rating-label');
    const btnAgain = document.getElementById('btn-feedback-again');

    const ratingDescriptions = {
      '1': 'Selected: 1 - Poor ★☆☆☆☆',
      '2': 'Selected: 2 - Fair ★★☆☆☆',
      '3': 'Selected: 3 - Good ★★★☆☆',
      '4': 'Selected: 4 - Very Good ★★★★☆',
      '5': 'Selected: 5 - Excellent ★★★★★'
    };

    // Visual selection for rating buttons
    document.querySelectorAll('.rating-input').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.rating-card').forEach(card => {
          const r = card.querySelector('.rating-input');
          if (r && r.checked) {
            card.classList.add('selected', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300', 'ring-1', 'ring-amber-400/30');
            card.classList.remove('border-line-strong', 'bg-panel', 'text-fg');
            const numSpan = card.querySelector('span.font-display');
            if (numSpan) numSpan.classList.add('text-amber-300');
            if (ratingLabel) ratingLabel.textContent = ratingDescriptions[r.value] || ('Selected: ' + r.value + ' Stars');
          } else {
            card.classList.remove('selected', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300', 'ring-1', 'ring-amber-400/30');
            card.classList.add('border-line-strong', 'bg-panel', 'text-fg');
            const numSpan = card.querySelector('span.font-display');
            if (numSpan) numSpan.classList.remove('text-amber-300');
          }
        });
      });
    });

    btnAgain?.addEventListener('click', () => {
      success?.classList.add('hidden');
      form.reset();
      const fiveStarRadio = document.querySelector('input[name="rating"][value="5"]');
      if (fiveStarRadio) {
        fiveStarRadio.checked = true;
        fiveStarRadio.dispatchEvent(new Event('change'));
      }
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!btn) return;
      btn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting...';
      success?.classList.add('hidden');
      errorEl?.classList.add('hidden');

      const checkedRating = document.querySelector('input[name="rating"]:checked')?.value || '5';
      const ratingNum = parseInt(checkedRating, 10) || 5;
      const ratingStars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
      const category = document.getElementById('feedback-category')?.value || 'General Feedback';
      const comment = document.getElementById('feedback-comment')?.value.trim() || '';
      const name = document.getElementById('feedback-name')?.value.trim() || 'Anonymous';
      const contact = document.getElementById('feedback-email')?.value.trim() || '';
      const branch = document.getElementById('feedback-branch')?.value || '';
      const batch = document.getElementById('feedback-batch')?.value || '2027';

      const payload = {
        type: 'feedback',
        batch_year: batch,
        branch: branch,
        company_name: category,
        role_title: ratingNum + ' / 5 Stars (' + ratingStars + ')',
        offers_count: ratingNum,
        details: comment,
        submitter_name: name,
        submitter_contact: contact,
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

        if (!res.ok) throw new Error(await res.text() || 'Failed to submit feedback');

        success?.classList.remove('hidden');
        form.reset();
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Error: ' + err.message;
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Submit Feedback →';
      }
    });
  `;

  const html = pageTemplate({
    title: `Give Feedback · Placed ’27 · ${siteConfig.collegeShort}`,
    activePath: '/feedback/',
    content,
    extraScript
  });

  fs.writeFileSync('feedback/index.html', html);
  console.log('feedback/index.html created successfully!');
}

function generateCorrectionsPage() {
  const content = `
    <section class="wrap pb-16 pt-[clamp(48px,8vw,112px)] max-w-[720px]">
      <p class="label text-muted">Data Integrity & Submissions</p>
      <h1 class="display-l mt-4">Submit data or report a correction.</h1>
      <p class="mt-4 text-[16px] text-muted">
        Help keep SPIT placement statistics accurate, verified, and comprehensive for the entire student community. All submissions are reviewed on the admin dashboard.
      </p>

      <!-- Toggle Tabs -->
      <div class="mt-8 flex items-center rounded-2xl border border-line-strong bg-panel p-1.5" role="tablist">
        <button id="tab-btn-submit" type="button" class="flex-1 rounded-xl bg-fg py-2.5 text-center text-[13px] font-medium text-bg shadow-sm transition-all duration-200 cursor-pointer">
          Submit Placement Data
        </button>
        <button id="tab-btn-correct" type="button" class="flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-muted hover:text-fg transition-all duration-200 cursor-pointer">
          Report a Correction
        </button>
      </div>

      <!-- Tab 1: Submit Placement Data Form -->
      <form id="submission-form" class="mt-8 grid gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Company Name *</label>
            <input id="sub-company" type="text" required placeholder="e.g. Microsoft, Google, Oracle, BNP Paribas..." class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">Placement Batch *</label>
            <select id="sub-batch" required class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors">
              <option value="2027">Class of 2027</option>
              <option value="2028">Class of 2028</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Role Title</label>
            <input id="sub-role" type="text" placeholder="e.g. SDE, Associate Analyst, APM..." class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">Offer Type</label>
            <select id="sub-type" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors">
              <option value="Full-time">Full-time Only</option>
              <option value="Internship">Internship Only</option>
              <option value="Dual / Internship + PPO">Dual / Internship + PPO</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Compensation (CTC / Stipend)</label>
            <input id="sub-pay" type="text" placeholder="e.g. ₹18 LPA or ₹50,000/month" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">Number of Offers Made</label>
            <input id="sub-offers" type="number" min="1" placeholder="e.g. 5" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Branch Eligibility</label>
            <input id="sub-branches" type="text" placeholder="e.g. All branches, or CSE, IT" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">CGPA Cutoff</label>
            <input id="sub-cgpa" type="text" placeholder="e.g. 7.5+ CGPA or No cutoff" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
        </div>

        <div>
          <label class="label text-faint block mb-2">Drive Timeline & Selection Notes</label>
          <textarea id="sub-details" rows="3" placeholder="Provide any additional info: visit dates, rounds (OA -> Tech -> HR), compensation breakdown, or drive notes..." class="w-full rounded-2xl border border-line-strong bg-panel p-4 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Your Name (Optional)</label>
            <input id="sub-name" type="text" placeholder="Leave blank to remain anonymous" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">Contact / Email (Optional)</label>
            <input id="sub-contact" type="text" placeholder="e.g. student@spit.ac.in" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
        </div>

        <button type="submit" id="btn-submit-data" class="flex items-center justify-center gap-2 label rounded-full bg-fg py-3.5 text-bg font-medium transition-opacity hover:opacity-90 cursor-pointer">
          <span id="sub-btn-text">Submit Placement Data</span>
          <span id="sub-spinner" class="hidden size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
        </button>
        <p id="submission-success" class="hidden text-center text-intern text-[14px]">Thank you! Your placement data submission has been received and sent to the admin dashboard for verification.</p>
        <p id="submission-error" class="hidden text-center text-red-400 text-[14px]"></p>
      </form>

      <!-- Tab 2: Report Correction Form -->
      <form id="correction-form" class="mt-8 grid gap-5 hidden">
        <div>
          <label class="label text-faint block mb-2">Company Name *</label>
          <input id="corr-company" type="text" required placeholder="e.g. JPMC, Barclays, PhonePe, ISS / STOXX..." class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
        </div>

        <div>
          <label class="label text-faint block mb-2">What detail is incorrect? *</label>
          <select id="corr-category" required class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors">
            <option value="">Select category</option>
            <option value="Advertised CTC / Stipend figure">Advertised CTC / Stipend figure</option>
            <option value="Number of selections">Number of students selected / waitlisted</option>
            <option value="Role title or division details">Role title or division details</option>
            <option value="Offer type (Full-time / Intern / Dual)">Offer type (Full-time / Internship / Dual)</option>
            <option value="Eligibility criteria / Funnel">Eligibility criteria / Interview funnel</option>
            <option value="Other detail">Other detail</option>
          </select>
        </div>

        <div>
          <label class="label text-faint block mb-2">Details & Correct Information *</label>
          <textarea id="corr-details" rows="4" required placeholder="Please describe the correction and include reference details or links..." class="w-full rounded-2xl border border-line-strong bg-panel p-4 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Your Name (Optional)</label>
            <input id="corr-name" type="text" placeholder="Leave blank to remain anonymous" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
          <div>
            <label class="label text-faint block mb-2">Contact / Email (Optional)</label>
            <input id="corr-contact" type="text" placeholder="e.g. student@spit.ac.in" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
          </div>
        </div>

        <button type="submit" id="btn-submit-corr" class="flex items-center justify-center gap-2 label rounded-full bg-fg py-3.5 text-bg font-medium transition-opacity hover:opacity-90 cursor-pointer">
          <span id="corr-btn-text">Submit Correction Report</span>
          <span id="corr-spinner" class="hidden size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
        </button>
        <p id="correction-success" class="hidden text-center text-intern text-[14px]">Thank you! Your correction report has been received and sent to the admin dashboard.</p>
        <p id="correction-error" class="hidden text-center text-red-400 text-[14px]"></p>
      </form>
    </section>
  `;

  const extraScript = `
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    // Tab Switching Logic
    const tabSubmit = document.getElementById('tab-btn-submit');
    const tabCorrect = document.getElementById('tab-btn-correct');
    const formSubmit = document.getElementById('submission-form');
    const formCorrect = document.getElementById('correction-form');

    function switchTab(tab) {
      if (tab === 'correct') {
        tabCorrect.className = "flex-1 rounded-xl bg-fg py-2.5 text-center text-[13px] font-medium text-bg shadow-sm transition-all duration-200 cursor-pointer";
        tabSubmit.className = "flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-muted hover:text-fg transition-all duration-200 cursor-pointer";
        formCorrect.classList.remove('hidden');
        formSubmit.classList.add('hidden');
      } else {
        tabSubmit.className = "flex-1 rounded-xl bg-fg py-2.5 text-center text-[13px] font-medium text-bg shadow-sm transition-all duration-200 cursor-pointer";
        tabCorrect.className = "flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-muted hover:text-fg transition-all duration-200 cursor-pointer";
        formSubmit.classList.remove('hidden');
        formCorrect.classList.add('hidden');
      }
    }

    tabSubmit?.addEventListener('click', () => switchTab('submit'));
    tabCorrect?.addEventListener('click', () => switchTab('correct'));

    // Pre-fill parameters if present in URL (?company=... or ?tab=correct)
    const urlParams = new URLSearchParams(window.location.search);
    const prefillCompany = urlParams.get('company');
    const prefillTab = urlParams.get('tab');

    if (prefillTab === 'correct') {
      switchTab('correct');
    }

    if (prefillCompany) {
      const compSub = document.getElementById('sub-company');
      const compCorr = document.getElementById('corr-company');
      if (compSub) compSub.value = prefillCompany;
      if (compCorr) compCorr.value = prefillCompany;
    }

    // Submission Form Handler
    formSubmit?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-data');
      const spinner = document.getElementById('sub-spinner');
      const btnText = document.getElementById('sub-btn-text');
      const success = document.getElementById('submission-success');
      const errorEl = document.getElementById('submission-error');

      if (!btn) return;
      btn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting data...';
      success?.classList.add('hidden');
      errorEl?.classList.add('hidden');

      const batchYear = document.getElementById('sub-batch')?.value || '2027';
      const compName = document.getElementById('sub-company')?.value || '';
      const roleTitle = document.getElementById('sub-role')?.value || '';
      const offerType = document.getElementById('sub-type')?.value || '';
      const payVal = document.getElementById('sub-pay')?.value || '';
      const offersVal = parseInt(document.getElementById('sub-offers')?.value, 10) || 0;
      const branchesVal = document.getElementById('sub-branches')?.value || 'All branches';
      const cgpaVal = document.getElementById('sub-cgpa')?.value || '';
      const detailsVal = document.getElementById('sub-details')?.value || '';
      const submitterName = document.getElementById('sub-name')?.value || 'Anonymous';
      const submitterContact = document.getElementById('sub-contact')?.value || '';

      const fullDetails = [
        offerType ? ('Offer Type: ' + offerType) : '',
        branchesVal ? ('Branches: ' + branchesVal) : '',
        cgpaVal ? ('CGPA: ' + cgpaVal) : '',
        detailsVal
      ].filter(Boolean).join(' | ');

      const payload = {
        type: 'branch_data',
        batch: batchYear,
        batch_year: batchYear,
        company_name: compName,
        role_title: roleTitle,
        compensation: payVal,
        offers_count: offersVal,
        branch: branchesVal,
        details: fullDetails,
        submitter_name: submitterName,
        submitter_contact: submitterContact,
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

        success?.classList.remove('hidden');
        formSubmit.reset();
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Error: ' + err.message;
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Submit Placement Data';
      }
    });

    // Correction Form Handler
    formCorrect?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-corr');
      const spinner = document.getElementById('corr-spinner');
      const btnText = document.getElementById('corr-btn-text');
      const success = document.getElementById('correction-success');
      const errorEl = document.getElementById('correction-error');

      if (!btn) return;
      btn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting report...';
      success?.classList.add('hidden');
      errorEl?.classList.add('hidden');

      const payload = {
        type: 'correction',
        batch_year: '2027',
        company_name: document.getElementById('corr-company')?.value || '',
        role_title: document.getElementById('corr-category')?.value || 'Correction Report',
        details: document.getElementById('corr-details')?.value || '',
        submitter_name: document.getElementById('corr-name')?.value || 'Anonymous',
        submitter_contact: document.getElementById('corr-contact')?.value || '',
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

        if (!res.ok) throw new Error(await res.text() || 'Failed to submit report');

        success?.classList.remove('hidden');
        formCorrect.reset();
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Error: ' + err.message;
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Submit Correction Report';
      }
    });
  `;

  const html = pageTemplate({
    title: `Submit & Correct Data · Placed · ${siteConfig.collegeShort}`,
    activePath: '/corrections/',
    content,
    extraScript
  });

  fs.writeFileSync('corrections/index.html', html);
  console.log('corrections/index.html created successfully!');
}

function generateContactPage() {
  const content = `
    <section class="wrap pb-16 pt-[clamp(48px,8vw,112px)] max-w-[680px]">
      <p class="label text-muted">Get In Touch</p>
      <h1 class="display-l mt-4">Contact us.</h1>
      <p class="mt-4 text-[16px] text-muted">Have a query, recruitment cell inquiry, data clarification, or partnership proposal? Send your message directly to the portal administrators below.</p>

      <form id="contact-form" class="mt-10 grid gap-6">
        <div>
          <label class="label text-faint block mb-2">Your Name *</label>
          <input id="contact-name" type="text" required placeholder="e.g. Heet Shah or Recruiter Name" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
        </div>

        <div>
          <label class="label text-faint block mb-2">Email Address / Contact Phone *</label>
          <input id="contact-email" type="text" required placeholder="e.g. name@spit.ac.in or +91 98765 43210" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label text-faint block mb-2">Subject / Category *</label>
            <select id="contact-subject" required class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
              <option value="Placement Data Inquiry" class="bg-[#121316] text-[#ededed]">Placement Data Inquiry</option>
              <option value="Recruitment Cell / Drive Info" class="bg-[#121316] text-[#ededed]">Recruitment Cell / Drive Info</option>
              <option value="Recruiter Outreach / Partnership" class="bg-[#121316] text-[#ededed]">Recruiter Outreach / Partnership</option>
              <option value="Data Correction / Addition" class="bg-[#121316] text-[#ededed]">Data Correction / Addition</option>
              <option value="Website Suggestion / Issue" class="bg-[#121316] text-[#ededed]">Website Suggestion / Issue</option>
              <option value="General Query" class="bg-[#121316] text-[#ededed]">General Query</option>
            </select>
          </div>

          <div>
            <label class="label text-faint block mb-2">Your Affiliation (optional)</label>
            <select id="contact-affiliation" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors" style="color-scheme: dark; background-color: #121316; color: #ededed;">
              <option value="SPIT Student (2027 Batch)" class="bg-[#121316] text-[#ededed]">SPIT Student (2027 Batch)</option>
              <option value="SPIT Student (2028 Batch)" class="bg-[#121316] text-[#ededed]">SPIT Student (2028 Batch)</option>
              <option value="SPIT Student (Other Year)" class="bg-[#121316] text-[#ededed]">SPIT Student (Other Year)</option>
              <option value="Recruiter / Company Representative" class="bg-[#121316] text-[#ededed]">Recruiter / Company Rep</option>
              <option value="SPIT Faculty / Staff" class="bg-[#121316] text-[#ededed]">SPIT Faculty / Staff</option>
              <option value="Alumni / Visitor" class="bg-[#121316] text-[#ededed]">Alumni / Visitor</option>
            </select>
          </div>
        </div>

        <div>
          <label class="label text-faint block mb-2">Your Query / Message *</label>
          <textarea id="contact-message" rows="5" required placeholder="Describe your question, query, or proposal in detail..." class="w-full rounded-2xl border border-line-strong bg-panel p-4 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint"></textarea>
        </div>

        <button type="submit" id="btn-submit-contact" class="flex items-center justify-center gap-2 label rounded-full bg-fg py-3.5 text-bg font-medium transition-opacity hover:opacity-90 cursor-pointer">
          <span id="contact-btn-text">Send Query to Admin</span>
          <span id="contact-spinner" class="hidden size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
        </button>
        <p id="contact-success" class="hidden text-center text-intern text-[14px] font-medium py-3 rounded-2xl bg-intern/10 border border-intern/20">
          ✔ Thank you! Your query has been sent to the admin dashboard. We will review it shortly.
        </p>
        <p id="contact-error" class="hidden text-center text-red-400 text-[14px] py-3 rounded-2xl bg-red-500/10 border border-red-500/20"></p>
      </form>

      <div class="mt-14 grid gap-6 rounded-3xl border border-line bg-panel/50 p-6 sm:p-8">
        <h3 class="font-display text-[18px] font-semibold text-fg">Direct Campus References</h3>
        <div class="pt-2">
          <div>
            <span class="label text-faint">Training & Placement Cell</span>
            <p class="font-display text-[17px] font-medium text-fg mt-1">placements@spit.ac.in</p>
          </div>
        </div>
        <div class="border-t border-line pt-4">
          <span class="label text-faint">Campus Address</span>
          <p class="text-[14px] text-muted mt-1 leading-relaxed">
            Sardar Patel Institute of Technology, Bhavan's Campus, Munshi Nagar, Andheri (West), Mumbai 400058
          </p>
        </div>
      </div>
    </section>
  `;

  const extraScript = `
    const SUPABASE_URL = 'https://ntdmjyexirakcaovjeia.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZG1qeWV4aXJha2Nhb3ZqZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTUzNTUsImV4cCI6MjA4NjIzMTM1NX0.LFbBXU-ANjoUUi_HfMIWYAjKidRgEct_VO-588T-Y7M';

    const form = document.getElementById('contact-form');
    const success = document.getElementById('contact-success');
    const errorEl = document.getElementById('contact-error');
    const btn = document.getElementById('btn-submit-contact');
    const spinner = document.getElementById('contact-spinner');
    const btnText = document.getElementById('contact-btn-text');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!btn) return;
      btn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Sending query...';
      success?.classList.add('hidden');
      errorEl?.classList.add('hidden');

      const name = document.getElementById('contact-name')?.value.trim() || 'Visitor';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const subject = document.getElementById('contact-subject')?.value || 'General Query';
      const affiliation = document.getElementById('contact-affiliation')?.value || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';

      const payload = {
        type: 'contact_query',
        batch_year: '2027',
        branch: affiliation,
        company_name: subject,
        role_title: 'Query: ' + subject,
        details: message,
        submitter_name: name,
        submitter_contact: email,
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

        if (!res.ok) throw new Error(await res.text() || 'Failed to submit query');

        success?.classList.remove('hidden');
        form.reset();
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Submission error: ' + (err.message || 'Please try again later.');
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Send Query to Admin';
      }
    });
  `;

  const html = pageTemplate({
    title: `Contact · Placed · ${siteConfig.collegeShort}`,
    activePath: '/contact/',
    content,
    extraScript
  });

  fs.writeFileSync('contact/index.html', html);
  console.log('contact/index.html created successfully!');
}

generateAboutPage();
generateFeedbackPage();
generateCorrectionsPage();
generateContactPage();
