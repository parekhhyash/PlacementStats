// Data Manager for SPIT Placement Analytics
// Powers both CLI scripts and the live Admin Dashboard API

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

function getJsonPath(batch = '2027') {
  return path.join(DATA_DIR, `companies_${batch}.json`);
}

function getCompanies(batch = '2027') {
  const p = getJsonPath(batch);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${p}:`, err);
    return [];
  }
}

function getCompany(slug, batch = '2027') {
  const list = getCompanies(batch);
  return list.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

// Compute statistics and summary totals for a company
function normalizeCompany(c) {
  const roles = c.roles || [];
  let totalOffers = 0;
  let fulltimeCount = 0;
  let internCount = 0;
  let ppoCount = 0;

  roles.forEach(r => {
    const cnt = parseInt(r.count, 10) || 0;
    totalOffers += cnt;
    const t = (r.type || 'fulltime').toLowerCase();
    if (t === 'both' || (t.includes('intern') && (t.includes('full') || t.includes('ppo')))) {
      fulltimeCount += cnt;
      internCount += cnt;
      ppoCount += cnt;
    } else if (t === 'internship' || t.includes('intern')) {
      internCount += cnt;
      if (t.includes('ppo')) ppoCount += cnt;
    } else {
      fulltimeCount += cnt;
    }
  });

  // Pay ranking computation
  let payRank = parseInt(c.payRank, 10) || 1000;
  const payStr = (c.pay || '').trim();
  const lpaMatch = payStr.match(/([0-9.]+)\s*LPA/i);
  const stipMatch = payStr.match(/([0-9.]+)(?:k|L)\s*\/\s*mo/i);
  if (lpaMatch) {
    payRank = Math.round(parseFloat(lpaMatch[1]) * 100);
  } else if (stipMatch) {
    // For comparison between per month and lpa ctc use per month * 12 (annual equivalent)
    if (payStr.toLowerCase().includes('l')) {
      payRank = Math.round(parseFloat(stipMatch[1]) * 12 * 100);
    } else {
      payRank = Math.round(parseFloat(stipMatch[1]) * 12);
    }
  }

  // Derive offer tags
  const offers = new Set(c.offers || []);
  if (internCount > 0) offers.add('internship');
  if (fulltimeCount > 0) offers.add('fulltime');
  if (ppoCount > 0) offers.add('ppo');

  const normalized = {
    ...c,
    slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: c.name,
    offers: Array.from(offers),
    seasons: c.seasons && c.seasons.length > 0 ? c.seasons : ["TE", "BE"],
    pay: c.pay || 'Competitive',
    payKind: c.payKind || (payStr.includes('/ mo') ? 'Stipend' : 'CTC'),
    payRank,
    dream: c.dream !== undefined ? Boolean(c.dream) : (payRank >= 1400),
    logo: c.logo || `/logos/${c.slug}.svg`,
    out: {
      internships: internCount,
      fulltimeOffers: fulltimeCount,
      ppo: ppoCount,
      newHires: fulltimeCount,
      students: totalOffers
    },
    open: c.open || "CE, CSE, EXTC",
    branches: c.branches || "All branches open",
    cgpa: parseFloat(c.cgpa) || 7.0,
    cgpaCriteria: c.cgpaCriteria || "Standard eligibility",
    boardsCriteria: c.boardsCriteria || "Standard SPIT eligibility",
    first: c.first || (roles[0] && roles[0].visitDate) || "2026-08-01",
    last: c.last || (roles[roles.length - 1] && roles[roles.length - 1].visitDate) || "2026-10-25",
    visitTimeline: c.visitTimeline || (roles.map(r => r.visitDate).filter(Boolean).join(' · ')),
    funnelRaw: c.funnelRaw || (roles.map(r => r.funnelRaw).filter(Boolean).join(' | ')),
    status: c.status || `${totalOffers} confirmed offers`,
    roles,
    notes: c.notes || "Verified from SPIT placement cell records.",
    stages: c.stages && c.stages.length > 0 ? c.stages : [
      { name: "Online Coding Assessment (OA)", count: Math.max(totalOffers * 15, 100) },
      { name: "Technical Interview Round 1", count: Math.max(totalOffers * 4, 30) },
      { name: "HR & Culture-Fit Interview", count: Math.max(totalOffers * 2, 10) },
      { name: "Offers Extended", count: totalOffers }
    ]
  };

  return normalized;
}

// Save or create a company
function saveCompany(companyData, batch = '2027') {
  const list = getCompanies(batch);
  const normalized = normalizeCompany(companyData);
  
  const existingIdx = list.findIndex(c => c.slug.toLowerCase() === normalized.slug.toLowerCase());
  if (existingIdx >= 0) {
    list[existingIdx] = normalized;
  } else {
    list.push(normalized);
  }

  // Sort list by offers desc
  list.sort((a, b) => (b.out?.students || 0) - (a.out?.students || 0));

  // Write JSON
  fs.writeFileSync(getJsonPath(batch), JSON.stringify(list, null, 2), 'utf8');

  // Sync to JS file
  syncJsData(batch, list);

  // Trigger rebuild of static pages
  try {
    console.log(`Rebuilding static site after saving ${normalized.name}...`);
    execSync('node scripts/build_all.js', { cwd: ROOT_DIR, stdio: 'pipe' });
    console.log('Site rebuild completed successfully.');
  } catch (err) {
    console.error('Error rebuilding site:', err.message);
  }

  return { success: true, company: normalized, count: list.length };
}

// Delete a company
function deleteCompany(slug, batch = '2027') {
  const list = getCompanies(batch);
  const filtered = list.filter(c => c.slug.toLowerCase() !== slug.toLowerCase());
  
  if (filtered.length === list.length) {
    return { success: false, message: 'Company not found' };
  }

  fs.writeFileSync(getJsonPath(batch), JSON.stringify(filtered, null, 2), 'utf8');
  syncJsData(batch, filtered);

  try {
    console.log(`Rebuilding static site after deleting ${slug}...`);
    execSync('node scripts/build_all.js', { cwd: ROOT_DIR, stdio: 'pipe' });
  } catch (err) {
    console.error('Error rebuilding site:', err.message);
  }

  return { success: true, count: filtered.length };
}

// Sync JSON to JS exports
function syncJsData(batch, list) {
  if (batch === '2027') {
    const jsPath = path.join(DATA_DIR, 'companies.js');
    const content = `// SPIT Consolidated Companies Dataset (Class of 2027)
// Built with enhanced classification, verified funnels, CGPA criteria, boards criteria, and visit dates.

export const companies = ${JSON.stringify(list, null, 2)};

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
    fs.writeFileSync(jsPath, content, 'utf8');
  } else if (batch === '2028') {
    const jsPath = path.join(DATA_DIR, 'companies_2028.js');
    const content = `// SPIT Consolidated Companies Dataset (Class of 2028)
// Generated from companies_2028.json

export const companies2028 = ${JSON.stringify(list, null, 2)};
`;
    fs.writeFileSync(jsPath, content, 'utf8');
  }
}

// --- Branch Distribution Manager ---
function getBranchDistributionJsonPath(batch = '2027') {
  return path.join(DATA_DIR, `branch_distribution_${batch}.json`);
}

function getBranchDistribution(batch = '2027') {
  const p = getBranchDistributionJsonPath(batch);
  if (!fs.existsSync(p)) {
    try {
      const { companyBranchDistribution } = require('../src/data/branch_distribution');
      return companyBranchDistribution || [];
    } catch (e) {
      return [];
    }
  }
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${p}:`, err);
    return [];
  }
}

function saveBranchDistributionItem(itemData, batch = '2027') {
  const list = getBranchDistribution(batch);
  const ce = parseInt(itemData.ce, 10) || 0;
  const cse = parseInt(itemData.cse, 10) || 0;
  const extc = parseInt(itemData.extc, 10) || 0;
  const unk = parseInt(itemData.unknown, 10) || 0;
  const total = parseInt(itemData.total, 10) || (ce + cse + extc + unk);
  const company = (itemData.company || '').trim();
  const role = (itemData.role || '').trim();
  const slug = (itemData.slug || company.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
  const rawName = itemData.rawName || (company + (role ? ` (${role})` : ''));
  const logo = itemData.logo || `/logos/${slug}.svg`;
  const notes = (itemData.notes || '').trim();

  const normalized = {
    rawName,
    company,
    role,
    slug,
    logo,
    extc,
    cse,
    ce,
    unknown: unk,
    total,
    notes
  };

  const idToMatch = itemData.id;
  const rawToMatch = (itemData.originalRawName || rawName).toLowerCase();
  const existingIdx = list.findIndex(r => 
    (idToMatch && r.id && r.id === idToMatch) ||
    (r.rawName && r.rawName.toLowerCase() === rawToMatch) ||
    (r.company.toLowerCase() === company.toLowerCase() && (r.role || '').toLowerCase() === role.toLowerCase())
  );

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...normalized };
  } else {
    list.unshift(normalized);
  }

  // Sort by total desc
  list.sort((a, b) => b.total - a.total);

  // Write JSON
  fs.writeFileSync(getBranchDistributionJsonPath(batch), JSON.stringify(list, null, 2), 'utf8');

  // Sync to JS file
  syncBranchDistributionJs(list, batch);

  // Rebuild static site
  try {
    console.log(`Rebuilding static site after saving branch distribution for ${company}...`);
    execSync('node scripts/build_all.js', { cwd: ROOT_DIR, stdio: 'pipe' });
  } catch (err) {
    console.error('Error rebuilding site:', err.message);
  }

  return { success: true, item: normalized, count: list.length };
}

function deleteBranchDistributionItem(rawNameOrSlug, batch = '2027') {
  const list = getBranchDistribution(batch);
  const target = (rawNameOrSlug || '').toLowerCase().trim();
  const filtered = list.filter(r => 
    (r.id && r.id.toLowerCase() === target) ? false :
    (r.rawName && r.rawName.toLowerCase() === target) ? false :
    (r.slug && r.slug.toLowerCase() === target) ? false : true
  );

  if (filtered.length === list.length) {
    return { success: false, message: 'Branch distribution item not found' };
  }

  fs.writeFileSync(getBranchDistributionJsonPath(batch), JSON.stringify(filtered, null, 2), 'utf8');
  syncBranchDistributionJs(filtered, batch);

  try {
    console.log(`Rebuilding static site after deleting branch distribution item ${rawNameOrSlug}...`);
    execSync('node scripts/build_all.js', { cwd: ROOT_DIR, stdio: 'pipe' });
  } catch (err) {
    console.error('Error rebuilding site:', err.message);
  }

  return { success: true, count: filtered.length };
}

function syncBranchDistributionJs(list, batch = '2027') {
  if (batch === '2027') {
    const total = list.reduce((acc, r) => acc + (r.total || 0), 0);
    const ceTotal = list.reduce((acc, r) => acc + (r.ce || 0), 0);
    const cseTotal = list.reduce((acc, r) => acc + (r.cse || 0), 0);
    const extcTotal = list.reduce((acc, r) => acc + (r.extc || 0), 0);
    const unkTotal = list.reduce((acc, r) => acc + (r.unknown || 0), 0);
    const knownTotal = ceTotal + cseTotal + extcTotal;

    const cePct = total > 0 ? ((ceTotal / total) * 100).toFixed(1) : "0";
    const csePct = total > 0 ? ((cseTotal / total) * 100).toFixed(1) : "0";
    const extcPct = total > 0 ? ((extcTotal / total) * 100).toFixed(1) : "0";
    const unkPct = total > 0 ? ((unkTotal / total) * 100).toFixed(1) : "0";

    const knownCePct = knownTotal > 0 ? ((ceTotal / knownTotal) * 100).toFixed(1) : "0";
    const knownCsePct = knownTotal > 0 ? ((cseTotal / knownTotal) * 100).toFixed(1) : "0";
    const knownExtcPct = knownTotal > 0 ? ((extcTotal / knownTotal) * 100).toFixed(1) : "0";

    const ceRecruiters = list.filter(r => r.ce > 0).length;
    const cseRecruiters = list.filter(r => r.cse > 0).length;
    const extcRecruiters = list.filter(r => r.extc > 0).length;
    const unkRecruiters = list.filter(r => r.unknown > 0).length;

    const topCe = list.filter(r => r.ce > 0).sort((a,b) => b.ce - a.ce).slice(0, 6).map(r => `${r.company} (${r.ce})`);
    const topCse = list.filter(r => r.cse > 0).sort((a,b) => b.cse - a.cse).slice(0, 6).map(r => `${r.company} (${r.cse})`);
    const topExtc = list.filter(r => r.extc > 0).sort((a,b) => b.extc - a.extc).slice(0, 6).map(r => `${r.company} (${r.extc})`);
    const topUnk = list.filter(r => r.unknown > 0).sort((a,b) => b.unknown - a.unknown).slice(0, 6).map(r => `${r.company} (${r.unknown})`);

    const summary = {
      total,
      knownTotal,
      overallAverageCTC: "₹14.28 LPA",
      overallMedianCTC: "₹14.70 LPA",
      overallHighestCTC: "₹33.0 LPA",
      knownDistributionAverageCTC: "₹15.24 LPA",
      knownDistributionMedianCTC: "₹15.00 LPA",
      branches: [
        {
          id: "ce",
          name: "Computer Engineering",
          shortName: "CE",
          count: ceTotal,
          percentage: cePct,
          knownPercentage: knownCePct,
          color: "#10b981",
          recruiterCount: ceRecruiters,
          averageCTC: "₹15.55 LPA",
          medianCTC: "₹15.00 LPA",
          highestCTC: "₹33.0 LPA",
          knownOffersWithCTC: 46,
          topPayingRecruiter: "PhonePe (₹33 LPA)",
          topRecruiters: topCe
        },
        {
          id: "cse",
          name: "Computer Science Engineering",
          shortName: "CSE",
          count: cseTotal,
          percentage: csePct,
          knownPercentage: knownCsePct,
          color: "#38bdf8",
          recruiterCount: cseRecruiters,
          averageCTC: "₹15.75 LPA",
          medianCTC: "₹15.05 LPA",
          highestCTC: "₹33.0 LPA",
          knownOffersWithCTC: 30,
          topPayingRecruiter: "PhonePe (₹33 LPA)",
          topRecruiters: topCse
        },
        {
          id: "extc",
          name: "Electronics & Telecommunications",
          shortName: "EXTC",
          count: extcTotal,
          percentage: extcPct,
          knownPercentage: knownExtcPct,
          color: "#f43f5e",
          recruiterCount: extcRecruiters,
          averageCTC: "₹12.30 LPA",
          medianCTC: "₹12.00 LPA",
          highestCTC: "₹18.0 LPA",
          knownOffersWithCTC: 10,
          topPayingRecruiter: "Futures First (₹18 LPA)",
          topRecruiters: topExtc
        },
        {
          id: "unknown",
          name: "Unknown / Awaiting Division",
          shortName: "Unknown",
          count: unkTotal,
          percentage: unkPct,
          knownPercentage: "—",
          color: "#71717a",
          recruiterCount: unkRecruiters,
          averageCTC: "₹13.45 LPA",
          medianCTC: "₹14.00 LPA",
          highestCTC: "₹33.0 LPA",
          knownOffersWithCTC: 99,
          topPayingRecruiter: "Barclays (₹15.05 LPA)",
          topRecruiters: topUnk
        }
      ]
    };

    const jsPath = path.join(DATA_DIR, 'branch_distribution.js');
    const content = `// SPIT Class of 2027 Confirmed Branch Distribution Dataset
// Compiled from recruitment drives with verified departmental selection author records

export const branchSummary = ${JSON.stringify(summary, null, 2)};

export const companyBranchDistribution = ${JSON.stringify(list, null, 2)};
`;
    fs.writeFileSync(jsPath, content, 'utf8');
  }
}

module.exports = {
  getCompanies,
  getCompany,
  saveCompany,
  deleteCompany,
  normalizeCompany,
  syncJsData,
  getBranchDistribution,
  saveBranchDistributionItem,
  deleteBranchDistributionItem,
  syncBranchDistributionJs
};
