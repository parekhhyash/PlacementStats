// Batch Datasets & Multi-Batch Switcher Manager
// Supports switching between Batch 2027 and Batch 2028

import { companies as companies2027 } from './companies.js';
import { branches as branches2027 } from './branches.js';
import { payData as payData2027 } from './pay.js';
import { timelineData as timelineData2027 } from './timeline.js';
import { updatesData as updatesData2027 } from './updates.js';
import { recapData as recapData2027 } from './recap.js';

// Batch 2028 Companies Dataset
import { companies2028 } from './companies_2028.js';
export { companies2028 };

export const branches2028 = [
  {
    id: "ce",
    name: "Computer Engineering",
    shortName: "CE",
    color: "var(--color-br-ce, #10b981)",
    totalStudents: 275,
    medianCTC: "—",
    averageCTC: "—",
    highestCTC: "—",
    ppoCount: 0,
    topRecruiters: [
      { name: "Barclays", offers: 25, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 9, logo: "/logos/mastercard.svg" },
      { name: "IBM", offers: 5, logo: "/logos/ibm.svg" },
      { name: "General Mills", offers: 6, logo: "/logos/general-mills.png" }
    ],
    summary: "Class of 2028 Computer Engineering summer internship drives."
  },
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    color: "var(--color-br-cse, #38bdf8)",
    totalStudents: 137,
    medianCTC: "—",
    averageCTC: "—",
    highestCTC: "—",
    ppoCount: 0,
    topRecruiters: [
      { name: "Barclays", offers: 25, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 9, logo: "/logos/mastercard.svg" },
      { name: "General Mills", offers: 6, logo: "/logos/general-mills.png" },
      { name: "Russell Investments", offers: 5, logo: "/logos/russell-investments.svg" }
    ],
    summary: "Class of 2028 Computer Science Engineering summer internship drives."
  },
  {
    id: "extc",
    name: "Electronics and Telecommunications Engineering",
    shortName: "EXTC",
    color: "var(--color-br-entc, #c2185b)",
    totalStudents: 139,
    medianCTC: "—",
    averageCTC: "—",
    highestCTC: "—",
    ppoCount: 0,
    topRecruiters: [
      { name: "Barclays", offers: 25, logo: "/logos/barclays.png" },
      { name: "IBM", offers: 5, logo: "/logos/ibm.svg" },
      { name: "Mastercard", offers: 9, logo: "/logos/mastercard.svg" }
    ],
    summary: "Class of 2028 Electronics and Telecommunications Engineering summer internship drives."
  },
  {
    id: "all",
    name: "All Branches Combined",
    shortName: "All",
    color: "var(--color-fg)",
    totalStudents: 551,
    confirmedOffers: 50,
    medianCTC: "—",
    averageCTC: "—",
    highestCTC: "—",
    ppoCount: 0,
    topRecruiters: [
      { name: "Barclays", offers: 25, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 9, logo: "/logos/mastercard.svg" },
      { name: "General Mills", offers: 6, logo: "/logos/general-mills.png" },
      { name: "IBM", offers: 5, logo: "/logos/ibm.svg" },
      { name: "Russell Investments", offers: 5, logo: "/logos/russell-investments.svg" }
    ],
    summary: "Comprehensive batch-wide analytics for SPIT Class of 2028 across all 3 engineering branches."
  }
];

export const payData2028 = {
  summary: {
    overallAverageCTC: "—",
    overallMedianCTC: "—",
    drivesWithSelections: 5,
    fulltimeAverageCTC: "—",
    fulltimeMedianCTC: "—",
    fulltimeDrivesCount: 0,
    ppoAverageCTC: "—",
    ppoMedianCTC: "—",
    ppoDrivesCount: 0,
    highestCTC: "—",
    lowestCTC: "—",
    highestStipend: "₹75,000 / mo",
    medianStipend: "₹50,000 / mo",
    averageStipend: "₹54,000 / mo"
  },
  brackets: [],
  stipendBrackets: [
    { tier: "High (₹60k – ₹80k / mo)", count: 30, percentage: "60%", description: "Barclays (₹75k), Russell Investments (₹60k)" },
    { tier: "Core (₹35k – ₹55k / mo)", count: 20, percentage: "40%", description: "Mastercard (₹50k), IBM (₹50k), General Mills (₹35k)" }
  ],
  scatterPoints: []
};

export const timelineData2028 = {
  summary: {
    internshipDrives: 5,
    finalYearDrives: 0,
    busiestMonth: "Oct 2026 (4 drives)"
  },
  months: [
    { label: "Aug '26", count: 0, intern: 0, fulltime: 0, ppo: 0 },
    { label: "Sep '26", count: 0, intern: 0, fulltime: 0, ppo: 0 },
    { label: "Oct '26", count: 4, intern: 4, fulltime: 0, ppo: 0 },
    { label: "Nov '26", count: 1, intern: 1, fulltime: 0, ppo: 0 }
  ],
  events: [
    {
      date: "04 Nov 2026",
      displayDate: "4 Nov",
      monthGroup: "Nov 2026",
      timestamp: 1793836800000,
      company: "Russell Investments",
      slug: "russell-investments",
      type: "internship",
      typeLabel: "Summer Internship",
      role: "Technology & Investment Research Intern",
      offers: 5,
      pay: "Stipend ₹60,000/mo",
      status: "5 summer intern selections at ₹60,000/month"
    },
    {
      date: "31 Oct 2026",
      displayDate: "31 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1793491200000,
      company: "IBM",
      slug: "ibm",
      type: "internship",
      typeLabel: "Summer Internship",
      role: "Global Sales Intern",
      offers: 5,
      pay: "Stipend ₹50,000/mo",
      status: "5 summer intern selections at ₹50,000/month"
    },
    {
      date: "28 Oct 2026",
      displayDate: "28 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1793232000000,
      company: "General Mills",
      slug: "general-mills",
      type: "internship",
      typeLabel: "Summer Internship",
      role: "Digital & Technology Intern",
      offers: 6,
      pay: "Stipend ₹35,000/mo",
      status: "6 summer intern selections at ₹35,000/month"
    },
    {
      date: "25 Oct 2026",
      displayDate: "25 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1792972800000,
      company: "Mastercard",
      slug: "mastercard",
      type: "internship",
      typeLabel: "Summer Internship",
      role: "Software Engineering Intern",
      offers: 9,
      pay: "Stipend ₹50,000/mo",
      status: "9 summer intern selections at ₹50,000/month"
    },
    {
      date: "20 Oct 2026",
      displayDate: "20 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1792540800000,
      company: "Barclays",
      slug: "barclays",
      type: "internship",
      typeLabel: "Summer Internship",
      role: "Summer Internship 2028",
      offers: 25,
      pay: "Stipend ₹75,000/mo",
      status: "25 summer intern selections at ₹75,000/month"
    }
  ]
};

export const updatesData2028 = [
  {
    id: "up-28-1",
    timestamp: "04 Nov 2026, 4:00 PM",
    company: "Russell Investments",
    category: "Results",
    title: "Russell Investments selects 5 students for 2028 batch",
    content: "5 candidates selected for Technology & Investment Research summer internships at ₹60,000/month stipend.",
    companySlug: "russell-investments",
    logo: "/logos/russell-investments.svg"
  },
  {
    id: "up-28-2",
    timestamp: "31 Oct 2026, 5:30 PM",
    company: "IBM",
    category: "Results",
    title: "IBM selects 5 Global Sales Interns",
    content: "5 students selected for Global Sales Internship at ₹50,000/month stipend.",
    companySlug: "ibm",
    logo: "/logos/ibm.svg"
  },
  {
    id: "up-28-3",
    timestamp: "28 Oct 2026, 1:45 PM",
    company: "General Mills",
    category: "Results",
    title: "General Mills announces 6 selections for 2028 batch",
    content: "6 students offered Digital & Technology summer internships at ₹35,000/month stipend.",
    companySlug: "general-mills",
    logo: "/logos/general-mills.png"
  },
  {
    id: "up-28-4",
    timestamp: "25 Oct 2026, 6:00 PM",
    company: "Mastercard",
    category: "Results",
    title: "Mastercard selects 9 software interns for 2028 batch",
    content: "9 candidates selected for software engineering summer internships at ₹50,000/month stipend.",
    companySlug: "mastercard",
    logo: "/logos/mastercard.svg"
  },
  {
    id: "up-28-5",
    timestamp: "20 Oct 2026, 2:30 PM",
    company: "Barclays",
    category: "Results",
    title: "Barclays leads 2028 hiring with 25 summer intern offers",
    content: "Historic early hiring outcome: 25 summer internships at ₹75,000/month stipend.",
    companySlug: "barclays",
    logo: "/logos/barclays.png"
  }
];

export const recapData2028 = {
  seasonTitle: "Early Highlights · SPIT 2028",
  latestPeriod: "October – November 2026",
  lastFiveCompanies: [
    {
      company: "Barclays",
      slug: "barclays",
      logo: "/logos/barclays.png",
      date: "20 Oct 2026",
      headline: "25 Summer Interns",
      pay: "₹75k / mo",
      type: "internship",
      details: "Top early recruiter with 25 summer intern offers at ₹75,000/month stipend."
    },
    {
      company: "Mastercard",
      slug: "mastercard",
      logo: "/logos/mastercard.svg",
      date: "25 Oct 2026",
      headline: "9 Software Interns",
      pay: "₹50k / mo",
      type: "internship",
      details: "9 selections with ₹50,000/month stipend."
    },
    {
      company: "General Mills",
      slug: "general-mills",
      logo: "/logos/general-mills.png",
      date: "28 Oct 2026",
      headline: "6 Digital & Tech Interns",
      pay: "₹35k / mo",
      type: "internship",
      details: "6 candidates placed with ₹35,000/month stipend."
    },
    {
      company: "IBM",
      slug: "ibm",
      logo: "/logos/ibm.svg",
      date: "31 Oct 2026",
      headline: "5 Global Sales Interns",
      pay: "₹50k / mo",
      type: "internship",
      details: "5 selections for Global Sales Internship at ₹50,000/month stipend."
    },
    {
      company: "Russell Investments",
      slug: "russell-investments",
      logo: "/logos/russell-investments.svg",
      date: "04 Nov 2026",
      headline: "5 Technology & Research Interns",
      pay: "₹60k / mo",
      type: "internship",
      details: "5 selections at ₹60,000/month stipend."
    }
  ],
  slides: [
    {
      id: 1,
      title: "SPIT 2028 Early Kickoff",
      subtitle: "Summer Internships",
      badge: "Early Season",
      stat: "50 Offers",
      text: "The 2028 batch kicks off recruitment season with 50 confirmed summer internship selections across 5 premier global companies.",
      color: "var(--color-intern)"
    },
    {
      id: 2,
      company: "Barclays",
      slug: "barclays",
      logo: "/logos/barclays.png",
      badge: "Largest Recruiter",
      stat: "25 Offers",
      subtitle: "Summer Interns · ₹75,000 / mo",
      text: "Barclays selected 25 students for summer internships in the 2028 batch at ₹75,000/month stipend.",
      color: "var(--color-intern)"
    },
    {
      id: 3,
      company: "Mastercard",
      slug: "mastercard",
      logo: "/logos/mastercard.svg",
      badge: "Payments Technology",
      stat: "9 Offers",
      subtitle: "₹50,000 / month",
      text: "Mastercard selected 9 software engineering interns at ₹50,000/month stipend.",
      color: "var(--color-intern)"
    },
    {
      id: 4,
      company: "General Mills & IBM",
      slug: "general-mills",
      logo: "/logos/general-mills.png",
      badge: "Enterprise Tech",
      stat: "11 Combined Offers",
      subtitle: "Tech & Global Sales",
      text: "General Mills (6 offers @ ₹35k/mo) and IBM (5 Global Sales offers @ ₹50k/mo) completed summer recruitment drives for the 2028 cohort.",
      color: "var(--color-intern)"
    },
    {
      id: 5,
      company: "Russell Investments",
      slug: "russell-investments",
      logo: "/logos/russell-investments.svg",
      badge: "Quantitative Tech",
      stat: "5 Offers",
      subtitle: "₹60,000 / month",
      text: "Russell Investments selected 5 students for investment technology and analytics research summer internships at ₹60,000/month.",
      color: "var(--color-intern)"
    }
  ]
};

// Batches Registry
export const allBatches = {
  "2027": {
    year: "2027",
    label: "Class of 2027",
    title: "Placed ’27 · SPIT",
    statusBadge: "Placements in progress",
    stats: {
      totalCompanies: companies2027.length,
      studentsPlaced: companies2027.reduce((sum, c) => sum + (c.out?.students || 0), 0),
      totalBatchSize: 534,
      fulltimeOffersCount: 140,
      internshipsCount: 117,
      ppoCount: 75,
      highestCTC: "₹33.0 LPA",
      medianCTC: "₹14.0 LPA",
      averageCTC: "₹14.05 LPA",
      highestStipend: "₹1,60,000 / mo",
      medianStipend: "₹40,000 / mo",
      averageStipend: "₹53,600 / mo",
      drivesCount: 48,
      busiestMonth: "Jul 2026"
    },
    companies: companies2027,
    branches: branches2027,
    pay: payData2027,
    timeline: timelineData2027,
    updates: updatesData2027,
    recap: recapData2027
  },
  "2028": {
    year: "2028",
    label: "Class of 2028",
    title: "Placed ’28 · SPIT",
    statusBadge: "Summer internship drives ongoing",
    stats: {
      totalCompanies: companies2028.length,
      studentsPlaced: 50,
      totalBatchSize: 551,
      fulltimeOffersCount: 0,
      internshipsCount: 50,
      ppoCount: 0,
      highestCTC: "—",
      medianCTC: "—",
      averageCTC: "—",
      highestStipend: "₹75,000 / mo",
      medianStipend: "₹50,000 / mo",
      averageStipend: "₹54,000 / mo",
      drivesCount: 5,
      busiestMonth: "Oct 2026"
    },
    companies: companies2028,
    branches: branches2028,
    pay: payData2028,
    timeline: timelineData2028,
    updates: updatesData2028,
    recap: recapData2028
  }
};

// Client-side batch accessor - strictly defaults to 2027 for all pages
export function getBatchKey() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('batch');
    if (fromUrl === '2028') {
      return '2028';
    }
    // Clean URLs and standard links always default to 2027
    return '2027';
  }
  return "2027";
}

export function getActiveBatchData() {
  const key = getBatchKey();
  return allBatches[key] || allBatches["2027"];
}

export function setBatch(year) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('spit_batch', year);
    } catch (e) {}
    const url = new URL(window.location.href);
    if (year === '2028') {
      url.searchParams.set('batch', '2028');
    } else {
      url.searchParams.delete('batch');
    }
    window.location.href = url.toString();
  }
}
