# Placed ’27 · SPIT Campus Recruitment & Placement Analytics Portal

A pixel-perfect, high-fidelity clone of [placed-27.pages.dev](https://placed-27.pages.dev/), loaded with real campus recruitment data for **Sardar Patel Institute of Technology (SPIT), Mumbai — Class of 2027** (`SPIT_2027_company_offers_ctc_stipend.csv`).

---

## 📊 SPIT 2027 Placement Highlights

- **31 Recruiting Companies** across Fintech, Investment Banking, AI, and Software Engineering.
- **264 Verified Offers** across Computer Engineering (CE), Computer Science Engineering (CSE), and Electronics & Telecommunications (EXTC).
- **₹33.5 LPA Highest CTC** (PhonePe SDE).
- **₹1,60,000 / month Top Internship Stipend** (JPMorgan Chase & Co. - CTC Risk).
- **₹13.0 LPA Median CTC** | **₹13.86 LPA Average CTC**.
- **₹50,000 / mo Median Stipend** | **₹60,000 / mo Average Stipend**.
- **Top Recruiters**:
  - **JPMorgan Chase & Co. (JPMC)**: 41 selections across 6 divisions (*Investment Banking, Corporate Risk, CADP, CIB FinTech, CTC Risk*).
  - **Barclays**: 28 total offers (*12 Technology Graduate Developers @ ₹15.05 LPA + 16 Summer Interns @ ₹75,000/mo*).
  - **ISS / STOXX**: 15 SDE offers (*₹14.7 LPA + ₹60,000/mo stipend*).
  - **UBS**: 13 selections (*9 Graduate Trainees @ ₹13-16 LPA + 4 Agentic AI Specialists*).
  - **TransUnion**: 10 selections (*8.5–9.5 LPA*).
  - **GEP**: 9 Senior Analyst Trainees (*9 LPA*).
  - **Wissen**: 9 SDE selections (*9.5 LPA*).
  - **Quantiphi**: 9 selections (*BA, FE, MLE @ 8.5 LPA*).
  - **Mahindra Finance**: 9 selections (*14 LPA base + retention*).
  - **BlackRock**: 8 selections (*7 SDE + 1 Aladdin Data @ 15 LPA*).
  - **IDFC FIRST Bank**: 8 selections (*Application Engineers @ 18.10 LPA*).
  - **PhonePe**: 6 SDE selections (*₹33–33.5 LPA*).

---

## ✨ Features & Sections Cloned

1. **Exact Typography & Dark Aesthetic**
   - **Funnel Display**: Bold, high-impact headings and numerical counters.
   - **Geist Sans & Geist Mono**: Clean body text and tabular statistics.
   - Pitch-black backgrounds (`#000`), subtle border lines (`#1e1e1e`), and signature offer accent dots:
     - 🟢 **Internship**: Mint / Teal (`#3fa88f`)
     - 🔵 **Full-Time**: Electric Blue (`#3f7be6`)
     - 🟠 **PPO**: Amber / Orange (`#d9732e`)
     - 🟣 **Branch Highlights**: CE, CSE, EXTC custom colors.

2. **Every Section & Page Matching the Original**
   - **Home (`/`)**:
     - Placement headline counter banner (`90 companies so far. 334 students placed, and counting.`)
     - Interactive Split-Flap departure board ticker (`Just in` live feed with flip animation)
     - `Section 01 — Latest`: Recent companies table with interactive hover white wipe
     - `The last 5 companies`: Recap teaser card with interactive **"Play the recap"** button
     - `Section 02 — Timeline`: Monthly recruitment drive chart
     - `Section 03 — Pay`: Advertised CTC distribution dot plot with median and average lines
     - `Section 04 — Offers`: Branch placement percentages and full-time hiring share
     - `Section 05 — Selectivity`: Multi-stage recruitment funnels (shortlist ➔ test ➔ interview ➔ selected)
   - **Companies (`/companies/`)**:
     - Real-time instant search input
     - Filter controls for **Role** (Full-time / Internship / PPO), **Branch**, and **Sort Order** (Latest / Pay / Placed / A–Z)
     - Complete tabular directory with logos, offer chips, pay, and branch eligibility
   - **Company Detail (`/companies/company.html?slug=...`)**:
     - Dedicated company profile with 5-column metric definitions
     - Drive breakdown by role and season
     - Visual recruitment funnel stages and branch breakdown
   - **Recap (`/recap/`)**:
     - Interactive **Full-Screen Story / Reel Player** with slide progress bars, company logos, and autoplay
     - Monthly archive recap stories
   - **Pay (`/pay/`)**:
     - Average and median compensation definitions for FT and PPO
     - Interactive CTC dot plot visualization
     - Salary tiers (Super Dream >₹20LPA, Dream ₹12-₹20LPA, Core ₹8-₹12LPA, Standard <₹8LPA)
     - Searchable and sortable compensation table
   - **Offers (`/selections/`)**:
     - Batch-wide placement ratios and unique placement meters
     - Branch distribution progress bars
     - Company offer rankings with PPO vs New hire breakdown
   - **Branches (`/branches/`)**:
     - Interactive branch tabs (CE, CSE, EXTC, All)
     - Selected branch performance card (Placement %, CTC stats, top recruiters)
     - Side-by-side comparison matrix across all branches
   - **Timeline (`/timeline/`)**:
     - Month-by-month drive distribution SVG chart
     - Chronological drive log with role tags and dates
   - **Updates (`/updates/`)**:
     - Live chronological announcements with category pills (Results, Shortlists, Drives, Interviews)
     - "Tell me when results are up" browser notification toggle
   - **Interactive Footer**:
     - 01 Feedback, 02 Correction Report, 03 Spread the word card with live marquee, animated ripple, and expandable "Copy link" drawer

---

## 🚀 Quick Start

### 1. Rebuild Pages
To generate or recompile all static HTML pages:
```bash
npm run build
```
*(Runs in under 1 second without external npm dependencies)*

### 2. Start the Local Server
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the portal.

---

## 🛠️ How to Customize for Your College

All data and college settings are decoupled into clean, typed configuration files:

### 1. Update College Name & Batch Info
Open `src/config/site.js`:
```javascript
export const siteConfig = {
  collegeName: "Your College of Engineering",  // Change to your college
  collegeShort: "YCE",
  batchYear: "2027",
  siteTitle: "Placed ’27",
  stats: {
    totalCompanies: 90,
    studentsPlaced: 334,
    totalBatchSize: 1052,
    placementPercentage: "32%",
    highestCTC: "₹45 LPA",
    medianCTC: "₹11 LPA",
    averageCTC: "₹14.43 LPA",
    ...
  }
};
```

### 2. Update Companies & Placement Data
- `src/data/companies.js`: Company directory, CTCs, logos, and recruitment funnels.
- `src/data/branches.js`: College branches, student counts, and branch placement rates.
- `src/data/pay.js`: Compensation brackets, median CTCs, and scatter plot points.
- `src/data/timeline.js`: Monthly drive distributions.
- `src/data/updates.js`: Announcements and shortlists.
- `src/data/recap.js`: Story / reel slides for the recap player.

### 3. Rebuild
After editing any file in `src/`, run:
```bash
npm run build
```
All pages update instantly!

---

## ☁️ Deployment

This project compiles to pure, static HTML/CSS/JS with zero runtime lock-in. You can deploy it instantly:

- **Cloudflare Pages**: Push to Git and set output directory to root `.`.
- **Vercel / Netlify**: Connect repository and set publish directory to `.`.
- **GitHub Pages**: Deploy repository root as GitHub Pages.
- **Docker / Nginx**: Copy repository root to `/usr/share/nginx/html`.

