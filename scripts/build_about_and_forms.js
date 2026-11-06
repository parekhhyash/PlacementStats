const fs = require('fs');
const { pageTemplate } = require('./template');
const { siteConfig } = require('../src/config/site');

function generateAboutPage() {
  const content = `
    <section class="wrap pb-12 pt-[clamp(48px,8vw,112px)]">
      <p class="label text-muted">About · Method & analytics · ${siteConfig.collegeShort} ${siteConfig.batchYear}</p>
      <h1 class="display-l mt-6 max-w-[16ch]">How this is made.</h1>
    </section>

    <div class="wrap grid gap-16">
      <section class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 class="display-m"><span class="label mr-4 align-middle text-faint">01</span>Why this exists</h2>
        <div class="grid max-w-[64ch] content-start gap-4 text-[16px] leading-relaxed text-muted">
          <p>We built this portal to make placement statistics transparent, structured and accessible for students of ${siteConfig.collegeName} (SPIT).</p>
          <p>Placement notices are often scattered across circulars and groups. This dashboard brings all ${siteConfig.stats.totalCompanies} recruiting companies together into a single, cohesive interface: roles offered, compensation figures, stipends, and confirmed selections across our branches.</p>
          <p>It is made for everyone in SPIT's Class of 2027 and juniors preparing for upcoming campus placement seasons.</p>
        </div>
      </section>

      <section class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 class="display-m"><span class="label mr-4 align-middle text-faint">02</span>What this is</h2>
        <div class="grid max-w-[64ch] content-start gap-4 text-[16px] leading-relaxed text-muted">
          <p>A comprehensive, verified record of campus recruitment for ${siteConfig.collegeName} (SPIT) Mumbai, covering Computer Engineering (CSE), Information Technology (IT), Electronics & Telecommunication (EXTC), and Artificial Intelligence & Data Science (AI & DS).</p>
          <p>All data has been compiled directly from placement cell reports, company offer letters, and student selection records.</p>
        </div>
      </section>

      <section class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 class="display-m"><span class="label mr-4 align-middle text-faint">03</span>Where the numbers come from</h2>
        <div class="grid max-w-[64ch] content-start gap-4 text-[16px] leading-relaxed text-muted">
          <p>Every statistic, package, and shortlist is drawn directly from campus recruitment drives, company offer letters, and student-reported placement reports.</p>
          <p>Waitlisted candidates and non-employment competitions (such as hackathon finalists) are explicitly noted and categorized to ensure statistical integrity.</p>
        </div>
      </section>

      <section class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 class="display-m"><span class="label mr-4 align-middle text-faint">04</span>What the numbers mean</h2>
        <div class="grid max-w-[64ch] content-start gap-4 text-[16px] leading-relaxed text-muted">
          <p><strong>CTC (Cost to Company):</strong> Reflects total annualized advertised compensation, including fixed base pay, performance bonuses, joining incentives, and retention bonuses where reported.</p>
          <p><strong>Stipend:</strong> Monthly compensation during internship period (ranging up to ₹1,60,000/month at JPMC).</p>
          <p><strong>Median vs Average:</strong> Median CTC (₹13.0 LPA) reflects the middle benchmark for placed students, while the average CTC (₹13.86 LPA) reflects total batch compensation scale.</p>
        </div>
      </section>

      <section class="grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
        <h2 class="display-m"><span class="label mr-4 align-middle text-faint">05</span>Privacy & Policy</h2>
        <div class="grid max-w-[64ch] content-start gap-4 text-[16px] leading-relaxed text-muted">
          <p>We respect individual privacy. No personal contact details, roll numbers, or sensitive student records are published on this dashboard. All aggregated figures serve informational and community analytics purposes.</p>
          <p>If you identify any discrepancy or have an updated figure, please use the <a class="link-underline text-fg" href="/corrections/">correction report form</a>.</p>
        </div>
      </section>
    </div>
  `;

  const html = pageTemplate({
    title: `About · Placed ’27 · ${siteConfig.collegeShort}`,
    activePath: '/about/',
    content
  });

  fs.writeFileSync('about/index.html', html);
  console.log('about/index.html created successfully!');
}

function generateFeedbackPage() {
  const content = `
    <section class="wrap pb-16 pt-[clamp(48px,8vw,112px)] max-w-[680px]">
      <p class="label text-muted">Community Feedback</p>
      <h1 class="display-l mt-4">Give feedback.</h1>
      <p class="mt-4 text-[16px] text-muted">Rate the site, tell us what metrics you want to see, or suggest new features for SPIT placement portal. Submissions are sent to the admin dashboard.</p>

      <form id="feedback-form" class="mt-10 grid gap-6">
        <div>
          <label class="label text-faint block mb-2">How helpful do you find this dashboard?</label>
          <div class="flex gap-3">
            ${[1, 2, 3, 4, 5].map(rating => `
              <label class="flex-1 text-center py-3 rounded-xl border border-line-strong bg-panel cursor-pointer hover:border-fg transition-colors">
                <input type="radio" name="rating" value="${rating}" class="sr-only rating-input" />
                <span class="font-display text-[18px] text-fg font-medium">${rating}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div>
          <label class="label text-faint block mb-2">What could be improved or added?</label>
          <textarea id="feedback-comment" rows="4" required placeholder="Tell us your suggestions or requested features..." class="w-full rounded-2xl border border-line-strong bg-panel p-4 text-[14px] text-fg outline-none focus:border-fg transition-colors placeholder:text-faint"></textarea>
        </div>

        <div>
          <label class="label text-faint block mb-2">Your branch (optional)</label>
          <select id="feedback-branch" class="w-full rounded-2xl border border-line-strong bg-panel p-3.5 text-[14px] text-fg outline-none focus:border-fg transition-colors">
            <option value="">Select branch</option>
            <option value="CSE">Computer Engineering (CSE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="EXTC">Electronics & Telecom (EXTC)</option>
            <option value="AIDS">AI & Data Science (AI & DS)</option>
          </select>
        </div>

        <button type="submit" id="btn-submit-feedback" class="flex items-center justify-center gap-2 label rounded-full bg-fg py-3.5 text-bg font-medium transition-opacity hover:opacity-90 cursor-pointer">
          <span id="feedback-btn-text">Submit Feedback</span>
          <span id="feedback-spinner" class="hidden size-4 animate-spin rounded-full border-2 border-bg border-t-transparent"></span>
        </button>
        <p id="feedback-success" class="hidden text-center text-intern text-[14px]">Thank you! Your feedback has been sent to the admin dashboard.</p>
        <p id="feedback-error" class="hidden text-center text-red-400 text-[14px]"></p>
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

    // Visual selection for rating buttons
    document.querySelectorAll('.rating-input').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.rating-input').forEach(r => {
          const parent = r.closest('label');
          if (r.checked) {
            parent?.classList.add('border-fg', 'bg-fg/10');
          } else {
            parent?.classList.remove('border-fg', 'bg-fg/10');
          }
        });
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!btn) return;
      btn.disabled = true;
      spinner?.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Submitting...';
      success?.classList.add('hidden');
      errorEl?.classList.add('hidden');

      const checkedRating = document.querySelector('input[name="rating"]:checked')?.value || 'Not rated';
      const comment = document.getElementById('feedback-comment')?.value || '';
      const branch = document.getElementById('feedback-branch')?.value || '';

      const payload = {
        type: 'feedback',
        batch_year: '2027',
        branch: branch,
        role_title: 'Rating: ' + checkedRating + ' / 5',
        details: comment,
        submitter_name: 'Community Visitor',
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
        document.querySelectorAll('.rating-input').forEach(r => r.closest('label')?.classList.remove('border-fg', 'bg-fg/10'));
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Error: ' + err.message;
          errorEl.classList.remove('hidden');
        }
      } finally {
        btn.disabled = false;
        spinner?.classList.add('hidden');
        if (btnText) btnText.textContent = 'Submit Feedback';
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
    <section class="wrap pb-16 pt-[clamp(48px,8vw,112px)] max-w-[680px]">
      <p class="label text-muted">Data Integrity</p>
      <h1 class="display-l mt-4">Report a correction.</h1>
      <p class="mt-4 text-[16px] text-muted">Notice an incorrect figure, date, role detail or selection result? Let us know and we’ll review and update the records on the admin dashboard.</p>

      <form id="correction-form" class="mt-10 grid gap-6">
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

    // Pre-fill company name if passed in query param (?company=...)
    const urlParams = new URLSearchParams(window.location.search);
    const prefillCompany = urlParams.get('company');
    if (prefillCompany) {
      const compInput = document.getElementById('corr-company');
      if (compInput) compInput.value = prefillCompany;
    }

    const form = document.getElementById('correction-form');
    const success = document.getElementById('correction-success');
    const errorEl = document.getElementById('correction-error');
    const btn = document.getElementById('btn-submit-corr');
    const spinner = document.getElementById('corr-spinner');
    const btnText = document.getElementById('corr-btn-text');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
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
        form.reset();
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
    title: `Report Correction · Placed ’27 · ${siteConfig.collegeShort}`,
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
      <p class="mt-4 text-[16px] text-muted">For recruitment cell inquiries, recruiter partnerships, or data verification regarding SPIT 2027 placements:</p>

      <div class="mt-10 grid gap-6 rounded-3xl border border-line-strong bg-panel p-6 sm:p-8">
        <div>
          <span class="label text-faint">Training & Placement Cell</span>
          <p class="font-display text-[20px] font-semibold text-fg mt-1">placements@spit.ac.in</p>
        </div>
        <div class="border-t border-line pt-6">
          <span class="label text-faint">Portal Tech & Analytics Team</span>
          <p class="font-display text-[20px] font-semibold text-fg mt-1">contact@spit-placed.in</p>
        </div>
        <div class="border-t border-line pt-6">
          <span class="label text-faint">Campus Address</span>
          <p class="text-[15px] text-muted mt-1">Sardar Patel Institute of Technology, Bhavan's Campus, Munshi Nagar, Andheri (West), Mumbai 400058</p>
        </div>
      </div>
    </section>
  `;

  const html = pageTemplate({
    title: `Contact · Placed ’27 · ${siteConfig.collegeShort}`,
    activePath: '/contact/',
    content
  });

  fs.writeFileSync('contact/index.html', html);
  console.log('contact/index.html created successfully!');
}

generateAboutPage();
generateFeedbackPage();
generateCorrectionsPage();
generateContactPage();
