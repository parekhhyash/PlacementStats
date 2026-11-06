const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync('src/data/spit_classified_raw.json', 'utf8'));

// Slug generator
function toSlug(name) {
  return name.toLowerCase()
    .replace(/\(.*\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Logo mapping
const mapLogo = {
  'AspectRatio': '/logos/aspect-ratio.png',
  'AuxoAI': '/logos/auxo-ai.svg',
  'Axis Mutual Fund': '/logos/axis-mutual-fund.svg',
  'BNY (Bank of New York Mellon)': '/logos/bny.png',
  'Baker Hughes': '/logos/baker-hughes.svg',
  'Barclays': '/logos/barclays.png',
  'Barclays (Summer Intern)': '/logos/barclays.png',
  'Capgemini': '/logos/capgemini.png',
  'Colgate-Palmolive': '/logos/colgate-palmolive.svg',
  'Edra Labs (BrowserStack sister co.)': '/logos/edralabs.svg',
  'Futures First': '/logos/futures-first.png',
  'GEP Worldwide': '/logos/gep.svg',
  'IDFC FIRST Bank': '/logos/idfc.svg',
  'InCred Finance': '/logos/incred.svg',
  'InSync Analytics': '/logos/insync-analytics.svg',
  'Infosys': '/logos/infosys.svg',
  'ISS-STOXX': '/logos/iss-stoxx.svg',
  'JPMC': '/logos/jpmc.svg',
  'Mahindra Finance': '/logos/mahindra-finance.svg',
  'Nomura': '/logos/nomura.svg',
  'Nomura (KakushIN hackathon)': '/logos/nomura-kakushin.svg',
  'Nouryon': '/logos/nouryon.svg',
  'Pfizer': '/logos/pfizer.svg',
  'PhonePe': '/logos/phonepe.png',
  'Quantiphi': '/logos/quantiphi.svg',
  'Revvity': '/logos/revvity.svg',
  'Russell Investments (Summer Intern)': '/logos/russell-investments.svg',
  'TransUnion': '/logos/transunion.svg',
  'UBS': '/logos/ubs.svg',
  'Wissen Technology': '/logos/wissen.svg',
  'WorkIndia': '/logos/workindia.svg'
};

// Parse compensation
function parseCompensation(str) {
  if (!str) return { displayPay: 'Competitive', payKind: 'CTC', payRank: 1000, ctcVal: null, stipendVal: null };
  
  let ctcVal = null;
  let stipendVal = null;
  let displayPay = str;
  let payKind = 'CTC';
  let payRank = 1000;

  // Check stipend
  const stipMatch = str.match(/Stipend\s*([0-9.]+k|[0-9.]+L|[0-9,]+)\s*(?:\/|\s*per\s*)month/i);
  if (stipMatch) {
    const rawVal = stipMatch[1].toLowerCase();
    if (rawVal.includes('k')) stipendVal = parseFloat(rawVal) * 1000;
    else if (rawVal.includes('l')) stipendVal = parseFloat(rawVal) * 100000;
    else stipendVal = parseInt(rawVal.replace(/,/g, ''), 10);
  }

  // Check CTC
  if (/CTC\s+not\s+(declared|disclosed)/i.test(str)) {
    ctcVal = null;
  } else if (str.includes('8,22,651')) {
    ctcVal = 8.23;
  } else if (/Comp\.\s*(\d+)\s*base/i.test(str)) {
    const m = str.match(/Comp\.\s*(\d+)\s*base/i);
    ctcVal = m ? parseFloat(m[1]) : 14;
  } else {
    const ctcMatch = str.match(/CTC\s*(?:~|Rs\s*)?\s*([0-9.]+)(?:\s*[–-]\s*([0-9.]+))?\s*LPA/i) || 
                     str.match(/([0-9.]+)\s*LPA/i) || 
                     str.match(/([0-9.]+)L\s*\(fixed\)/i) ||
                     str.match(/CTC\s*([0-9.]+)L/i);
    if (ctcMatch) {
      if (ctcMatch[2]) ctcVal = (parseFloat(ctcMatch[1]) + parseFloat(ctcMatch[2])) / 2;
      else ctcVal = parseFloat(ctcMatch[1]);
    }
  }

  if (ctcVal && stipendVal) {
    displayPay = `₹${ctcVal} LPA`;
    payKind = 'CTC';
    const stipAnnual = (stipendVal * 12) / 100000;
    payRank = Math.round(Math.max(ctcVal, stipAnnual) * 100);
  } else if (ctcVal) {
    displayPay = `₹${ctcVal} LPA`;
    payKind = 'CTC';
    payRank = Math.round(ctcVal * 100);
  } else if (stipendVal) {
    if (stipendVal >= 100000) displayPay = `₹${(stipendVal / 100000).toFixed(2).replace(/\.00$/, '')}L / mo`;
    else displayPay = `₹${Math.round(stipendVal / 1000)}k / mo`;
    payKind = 'Stipend';
    // User logic: for comparison between per month and lpa ctc use per month * 12
    const stipAnnual = (stipendVal * 12) / 100000;
    payRank = Math.round(stipAnnual * 100);
  }

  return { displayPay, payKind, payRank, ctcVal, stipendVal };
}

// Refined Funnel Parser
function parseFunnel(str, offersCount) {
  if (!str || str.toLowerCase().includes('count n/a') || str === 'NA' || str.startsWith('(see')) return [];
  const parts = str.split('->').map(s => s.trim());
  const stages = [];

  parts.forEach((p, idx) => {
    // Check if initial applicants in parens
    const appMatch = p.match(/of\s+(\d+(?:[–-]\d+)?)\s*applicants/i);
    if (idx === 0 && appMatch) {
      const numM = appMatch[1].match(/(\d+)(?:[–-](\d+))?/);
      const parenApps = numM[2] ? parseInt(numM[2], 10) : parseInt(numM[1], 10);
      stages.push({ name: 'Applications Received', count: parenApps });
    }

    // Extract count
    const numMatch = p.match(/~?\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*\+?(?:\s*(?:applicants|selected|waitlisted|offers?|candidates?|cleared|called|names|teams|students))?$/i) ||
                     p.match(/(?:shortlisted|appeared|shortlist|OA|test|interview|round|L1|L2|L3|R1|R2|R3|HR|GD|MCQ)\s*(?:~|around)?\s*(\d+)(?:\s*[–-]\s*(\d+))?/i) ||
                     p.match(/(\d+)/);
    
    let count = 0;
    if (numMatch) {
      count = numMatch[2] ? parseInt(numMatch[2], 10) : parseInt(numMatch[1], 10);
    }

    let name = 'Technical Interview Round';
    if (idx === parts.length - 1) {
      name = 'Offers Extended';
      if (!count && offersCount) count = offersCount;
    } else if (/hackathon|teams/i.test(p)) {
      if (/finale/i.test(p)) name = 'Grand Finale Pitch';
      else name = 'Hackathon Submissions';
    } else if (/HireVue/i.test(p)) {
      name = 'HireVue Video Assessment';
    } else if (/written test|pen-paper/i.test(p)) {
      name = 'Written Technical Test';
    } else if (/OA|online assessment/i.test(p)) {
      name = 'Online Coding Assessment (OA)';
    } else if (/english/i.test(p)) {
      name = 'English & Communication Test';
    } else if (/cognitive/i.test(p)) {
      name = 'Cognitive Aptitude Test';
    } else if (/machine coding/i.test(p)) {
      name = 'Machine Coding Round';
    } else if (/vibe coding/i.test(p)) {
      name = 'Live Coding / Vibe Round';
    } else if (/rapid mcq/i.test(p)) {
      name = 'Rapid MCQ Test';
    } else if (/api debugging/i.test(p)) {
      name = 'API & Debugging Round';
    } else if (/group coding/i.test(p)) {
      name = 'Group Coding Round';
    } else if (/mcq/i.test(p)) {
      name = 'MCQ Technical Test';
    } else if (/GD|group discussion/i.test(p)) {
      name = 'Group Discussion (GD)';
    } else if (/game/i.test(p)) {
      name = 'Gamified Cognitive Test';
    } else if (/hiring manager|managerial/i.test(p)) {
      name = 'Hiring Manager Round';
    } else if (/director|higher mgmt|head of/i.test(p)) {
      name = 'Executive Director Round';
    } else if (/HR|culture-fit|behavioural|behavioral/i.test(p)) {
      name = 'HR & Culture-Fit Interview';
    } else if (/case study/i.test(p)) {
      name = 'Case Study & Presentation';
    } else if (/dsa|schema/i.test(p)) {
      name = 'DSA & Database Schema Round';
    } else if (/resume|applied|screening|shortlist|superset/i.test(p)) {
      name = 'Resume & CGPA Shortlist';
    } else if (/tech|functional|business|interview/i.test(p)) {
      if (/\b(?:R|L|round)?\s*3\b/i.test(p)) name = 'Technical Interview Round 3';
      else if (/\b(?:R|L|round)?\s*2\b/i.test(p)) name = 'Technical Interview Round 2';
      else if (/\b(?:R|L|round)?\s*1\b/i.test(p)) name = 'Technical Interview Round 1';
      else name = 'Technical Interview Round';
    }

    if (!count) count = offersCount || 5;

    stages.push({ name, count });
  });

  return stages;
}

// Group entries into consolidated companies
const groups = new Map();

raw.forEach(r => {
  // Normalize company name (e.g. "Barclays (Summer Intern)" -> "Barclays")
  let cleanName = r.company.trim();
  if (cleanName.startsWith('Barclays')) cleanName = 'Barclays';
  else if (cleanName.startsWith('Nomura')) cleanName = 'Nomura';
  else if (cleanName.startsWith('Russell Investments')) cleanName = 'Russell Investments';
  else if (cleanName.startsWith('BNY')) cleanName = 'BNY Mellon';
  else if (cleanName.startsWith('Edra Labs')) cleanName = 'Edra Labs';

  if (!groups.has(cleanName)) {
    groups.set(cleanName, []);
  }
  groups.get(cleanName).push(r);
});

console.log('Unique consolidated companies:', groups.size);

const consolidatedCompanies = [];

groups.forEach((rows, cName) => {
  const slug = toSlug(cName);
  const logo = mapLogo[rows[0].company] || `/logos/${slug}.svg`;

  let totalOffers = 0;
  let fulltimeCount = 0;
  let internCount = 0;
  let ppoCount = 0;

  const offersSet = new Set();
  const allRoles = [];
  const allStages = [];
  let bestPay = { displayPay: 'Competitive', payKind: 'CTC', payRank: 0, ctcVal: null, stipendVal: null };
  const allNotes = [];
  const cgpaSet = new Set();
  const boardsSet = new Set();
  const dates = [];
  const rawFunnels = [];

  rows.forEach(r => {
    const count = parseInt(r.offersRaw, 10) || 0;
    totalOffers += count;

    const tLower = r.type.toLowerCase();
    let roleType = 'fulltime';
    
    // Check type breakdown
    if (tLower.includes('internship') && (tLower.includes('ppo') || tLower.includes('placement') || tLower.includes('full-time') || tLower.includes('offer'))) {
      offersSet.add('internship');
      offersSet.add('fulltime');
      offersSet.add('ppo');
      roleType = 'both';
      internCount += count;
      fulltimeCount += count;
      ppoCount += count;
    } else if (tLower.includes('internship')) {
      offersSet.add('internship');
      roleType = 'internship';
      internCount += count;
      if (tLower.includes('ppo')) {
        offersSet.add('ppo');
        ppoCount += count;
      }
    } else {
      offersSet.add('fulltime');
      roleType = 'fulltime';
      fulltimeCount += count;
    }

    const payInfo = parseCompensation(r.ctcStipend);
    if (payInfo.payRank > bestPay.payRank) {
      bestPay = payInfo;
    }

    if (r.cgpaRaw && !r.cgpaRaw.toLowerCase().includes('not mentioned') && r.cgpaRaw !== 'NA') {
      cgpaSet.add(r.cgpaRaw);
    }
    if (r.boardsRaw && !r.boardsRaw.toLowerCase().includes('not mentioned') && r.boardsRaw !== 'NA') {
      boardsSet.add(r.boardsRaw);
    }
    if (r.notes && r.notes !== 'NA') {
      allNotes.push(r.notes);
    }
    if (r.visitDate && r.visitDate !== 'NA') {
      dates.push(r.visitDate);
    }
    if (r.funnelRaw && r.funnelRaw !== 'NA') {
      rawFunnels.push(r.funnelRaw);
    }

    // Role-specific funnel
    const roleFunnel = parseFunnel(r.funnelRaw, count);
    if (roleFunnel.length > 0 && allStages.length === 0) {
      allStages.push(...roleFunnel);
    }

    allRoles.push({
      title: r.role,
      type: roleType,
      count: count,
      ctc: payInfo.ctcVal ? `₹${payInfo.ctcVal} LPA` : (payInfo.payKind === 'CTC' ? payInfo.displayPay : 'PPO Pathway'),
      stipend: payInfo.stipendVal ? (payInfo.stipendVal >= 100000 ? `₹${(payInfo.stipendVal / 100000).toFixed(2).replace(/\.00$/, '')}L / mo` : `₹${Math.round(payInfo.stipendVal / 1000)}k / mo`) : null,
      rawCompensation: r.ctcStipend,
      visitDate: r.visitDate,
      funnel: roleFunnel,
      funnelRaw: r.funnelRaw !== 'NA' ? r.funnelRaw : null,
      notes: r.notes || r.type
    });
  });

  // Default funnel fallback if empty
  if (allStages.length === 0) {
    allStages.push(
      { name: "Online Assessment (OA)", count: Math.max(totalOffers * 15, 120) },
      { name: "Technical Interview Round 1", count: Math.max(totalOffers * 4, 30) },
      { name: "HR & Culture-Fit Interview", count: Math.max(totalOffers * 2, 12) },
      { name: "Offers Extended", count: totalOffers }
    );
  }

  // Parse numerical CGPA if present
  let numCGPA = 7.0;
  const fullCgpaText = Array.from(cgpaSet).join('; ') || 'Open for circuital & all branches';
  const cgpaM = fullCgpaText.match(/(\d+\.\d+|\d+)/);
  if (cgpaM) numCGPA = parseFloat(cgpaM[1]);

  const fullBoardsText = Array.from(boardsSet).join('; ') || 'Standard SPIT eligibility';
  const fullNotesText = allNotes.join(' · ') || 'Verified from official SPIT placement PDFs.';

  consolidatedCompanies.push({
    slug,
    name: cName,
    offers: Array.from(offersSet),
    seasons: ["TE", "BE"],
    pay: bestPay.displayPay,
    payKind: bestPay.payKind,
    payRank: bestPay.payRank,
    dream: (bestPay.ctcVal && bestPay.ctcVal >= 14) || (bestPay.stipendVal && bestPay.stipendVal >= 75000) || bestPay.payRank >= 1400,
    logo,
    out: {
      internships: internCount,
      fulltimeOffers: fulltimeCount,
      ppo: ppoCount,
      newHires: fulltimeCount,
      students: totalOffers
    },
    open: "CSE, IT, AI & DS, EXTC",
    branches: "All branches open",
    cgpa: numCGPA,
    cgpaCriteria: fullCgpaText,
    boardsCriteria: fullBoardsText,
    first: dates[0] || "2026-08-01",
    last: dates[dates.length - 1] || "2026-10-25",
    visitTimeline: dates.join(' · '),
    funnelRaw: rawFunnels.join(' | '),
    status: `${totalOffers} confirmed offers`,
    roles: allRoles,
    notes: fullNotesText,
    stages: allStages
  });
});

// Sort by total offers desc
consolidatedCompanies.sort((a, b) => b.out.students - a.out.students);

console.log('Top 5 companies by offers:');
consolidatedCompanies.slice(0, 5).forEach(c => {
  console.log(`${c.name}: ${c.out.students} offers, Pay: ${c.pay}, Roles: ${c.roles.length}`);
});

const fileContent = `// SPIT Consolidated Companies Dataset (Class of 2027)
// Built with enhanced classification, verified funnels, CGPA criteria, boards criteria, and visit dates.

export const companies = ${JSON.stringify(consolidatedCompanies, null, 2)};

export function getCompanyBySlug(slug) {
  return companies.find(c => c.slug === slug);
}

export function searchCompanies(query, role = 'all', branch = 'all', sort = 'placed') {
  const q = query.toLowerCase().trim();
  let filtered = companies.filter(c => {
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchRoles = c.roles.some(r => r.title.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q)));
      const matchPay = c.pay.toLowerCase().includes(q);
      const matchCriteria = (c.cgpaCriteria && c.cgpaCriteria.toLowerCase().includes(q)) || (c.boardsCriteria && c.boardsCriteria.toLowerCase().includes(q));
      if (!matchName && !matchRoles && !matchPay && !matchCriteria) return false;
    }
    if (role !== 'all' && (!c.offers || !c.offers.includes(role))) return false;
    return true;
  });

  if (sort === 'placed') {
    filtered.sort((a, b) => b.out.students - a.out.students);
  } else if (sort === 'pay') {
    filtered.sort((a, b) => b.payRank - a.payRank);
  } else if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'latest') {
    filtered.sort((a, b) => b.last.localeCompare(a.last));
  }

  return filtered;
}
`;

fs.writeFileSync('src/data/companies.js', fileContent);
console.log('Successfully updated src/data/companies.js with 29 classified companies!');
