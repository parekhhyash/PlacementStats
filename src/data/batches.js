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
    id: "cse",
    name: "Computer Engineering",
    shortName: "CSE",
    color: "var(--color-br-ce)",
    placedPercentage: 18,
    totalStudents: 110,
    placedStudents: 20,
    medianCTC: "₹15.05 LPA",
    averageCTC: "₹14.5 LPA",
    highestCTC: "₹15.05 LPA",
    ppoCount: 16,
    topRecruiters: [
      { name: "Barclays", offers: 11, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 4, logo: "/logos/mastercard.svg" },
      { name: "IBM", offers: 3, logo: "/logos/ibm.svg" },
      { name: "General Mills", offers: 2, logo: "/logos/general-mills.png" }
    ],
    summary: "Early placement momentum with 20 selections in fintech, payments and software development internships."
  },
  {
    id: "it",
    name: "Information Technology",
    shortName: "IT",
    color: "var(--color-br-it)",
    placedPercentage: 16,
    totalStudents: 90,
    placedStudents: 14,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹14.0 LPA",
    highestCTC: "₹15.05 LPA",
    ppoCount: 10,
    topRecruiters: [
      { name: "Barclays", offers: 7, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 3, logo: "/logos/mastercard.svg" },
      { name: "General Mills", offers: 2, logo: "/logos/general-mills.png" },
      { name: "Russell Investments", offers: 2, logo: "/logos/russell-investments.svg" }
    ],
    summary: "Consistent early hiring across investment technology, enterprise cloud, and payments."
  },
  {
    id: "extc",
    name: "Electronics & Telecommunication",
    shortName: "EXTC",
    color: "var(--color-br-entc)",
    placedPercentage: 8,
    totalStudents: 90,
    placedStudents: 7,
    medianCTC: "₹13.0 LPA",
    averageCTC: "₹13.0 LPA",
    highestCTC: "₹14.0 LPA",
    ppoCount: 4,
    topRecruiters: [
      { name: "Barclays", offers: 3, logo: "/logos/barclays.png" },
      { name: "IBM", offers: 2, logo: "/logos/ibm.svg" },
      { name: "Mastercard", offers: 2, logo: "/logos/mastercard.svg" }
    ],
    summary: "Selections in core software, systems analysis, and cloud computing roles."
  },
  {
    id: "aids",
    name: "AI & Data Science",
    shortName: "AI & DS",
    color: "var(--color-br-aids)",
    placedPercentage: 13,
    totalStudents: 70,
    placedStudents: 9,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹14.2 LPA",
    highestCTC: "₹15.05 LPA",
    ppoCount: 7,
    topRecruiters: [
      { name: "Barclays", offers: 4, logo: "/logos/barclays.png" },
      { name: "Russell Investments", offers: 3, logo: "/logos/russell-investments.svg" },
      { name: "General Mills", offers: 2, logo: "/logos/general-mills.png" }
    ],
    summary: "High interest in quantitative analytics, machine learning pipelines, and investment technology."
  },
  {
    id: "all",
    name: "All Branches Combined",
    shortName: "All",
    color: "var(--color-fg)",
    placedPercentage: 14,
    totalStudents: 360,
    placedStudents: 50,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹14.2 LPA",
    highestCTC: "₹15.05 LPA",
    ppoCount: 37,
    topRecruiters: [
      { name: "Barclays", offers: 25, logo: "/logos/barclays.png" },
      { name: "Mastercard", offers: 9, logo: "/logos/mastercard.svg" },
      { name: "General Mills", offers: 6, logo: "/logos/general-mills.png" },
      { name: "IBM", offers: 5, logo: "/logos/ibm.svg" },
      { name: "Russell Investments", offers: 5, logo: "/logos/russell-investments.svg" }
    ],
    summary: "Overall early hiring snapshot for SPIT Class of 2028 across initial 5 recruiting companies."
  }
];

export const payData2028 = {
  summary: {
    overallAverageCTC: "₹14.20 LPA",
    overallMedianCTC: "₹14.00 LPA",
    drivesWithSelections: 5,
    fulltimeAverageCTC: "₹15.05 LPA",
    fulltimeMedianCTC: "₹15.05 LPA",
    fulltimeDrivesCount: 1,
    ppoAverageCTC: "₹13.50 LPA",
    ppoMedianCTC: "₹13.00 LPA",
    ppoDrivesCount: 4,
    highestCTC: "₹15.05 LPA",
    lowestCTC: "₹12.50 LPA",
    highestStipend: "₹75,000 / mo",
    medianStipend: "₹50,000 / mo",
    averageStipend: "₹54,000 / mo"
  },
  brackets: [
    { tier: "Dream Tier (₹14 – ₹20 LPA)", count: 34, percentage: "68%", color: "var(--color-fulltime)", description: "Barclays (₹15.05 LPA) & Mastercard (₹14 LPA)" },
    { tier: "Core Tech (₹10 – ₹14 LPA)", count: 16, percentage: "32%", color: "var(--color-intern)", description: "IBM (₹13 LPA) & General Mills (₹12.5 LPA)" }
  ],
  stipendBrackets: [
    { tier: "High (₹60k – ₹80k / mo)", count: 21, percentage: "42%", description: "Barclays (₹75k), Russell Investments (₹60k)" },
    { tier: "Core (₹40k – ₹60k / mo)", count: 20, percentage: "40%", description: "Mastercard (₹50k), General Mills (₹45k), IBM (₹40k)" }
  ],
  scatterPoints: [
    { name: "Barclays", pay: 15.05, type: "fulltime", students: 25 },
    { name: "Mastercard", pay: 14.0, type: "ppo", students: 9 },
    { name: "IBM", pay: 13.0, type: "ppo", students: 5 },
    { name: "General Mills", pay: 12.5, type: "ppo", students: 6 }
  ]
};

export const timelineData2028 = {
  summary: {
    internshipDrives: 5,
    finalYearDrives: 1,
    busiestMonth: "Oct 2026 (4 drives)"
  },
  months: [
    { label: "Aug '26", count: 0, intern: 0, fulltime: 0, ppo: 0 },
    { label: "Sep '26", count: 0, intern: 0, fulltime: 0, ppo: 0 },
    { label: "Oct '26", count: 4, intern: 3, fulltime: 1, ppo: 0 },
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
      typeLabel: "Internship Only",
      role: "Technology & Investment Research Intern",
      offers: 5,
      pay: "Stipend ₹60,000/mo",
      status: "5 selections confirmed at ₹60,000/month"
    },
    {
      date: "31 Oct 2026",
      displayDate: "31 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1793491200000,
      company: "IBM",
      slug: "ibm",
      type: "internship",
      typeLabel: "Internship Only",
      role: "Cloud & Cognitive Software Intern",
      offers: 5,
      pay: "Stipend ₹40,000/mo",
      status: "5 selections confirmed at ₹40,000/month"
    },
    {
      date: "28 Oct 2026",
      displayDate: "28 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1793232000000,
      company: "General Mills",
      slug: "general-mills",
      type: "internship",
      typeLabel: "Internship + PPO",
      role: "Digital & Technology Intern",
      offers: 6,
      pay: "Stipend ₹45,000/mo",
      status: "6 selections confirmed at ₹45,000/month"
    },
    {
      date: "25 Oct 2026",
      displayDate: "25 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1792972800000,
      company: "Mastercard",
      slug: "mastercard",
      type: "ppo",
      typeLabel: "Internship + PPO",
      role: "Software Engineering Intern",
      offers: 9,
      pay: "Stipend ₹50,000/mo",
      status: "9 selections confirmed at ₹50,000/month (PPO pathway)"
    },
    {
      date: "20 Oct 2026",
      displayDate: "20 Oct",
      monthGroup: "Oct 2026",
      timestamp: 1792540800000,
      company: "Barclays",
      slug: "barclays",
      type: "fulltime",
      typeLabel: "Summer Internship & Graduate Developer",
      role: "Summer Internship & Technology Developer",
      offers: 25,
      pay: "Stipend ₹75k/mo · CTC 15.05 LPA",
      status: "25 total offers (16 Interns @ ₹75k/mo + 9 Dev @ ₹15.05 LPA)"
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
    content: "5 candidates selected for Technology & Investment Research summer internships at ₹60,000/month with PPO opportunities.",
    companySlug: "russell-investments",
    logo: "/logos/russell-investments.svg"
  },
  {
    id: "up-28-2",
    timestamp: "31 Oct 2026, 5:30 PM",
    company: "IBM",
    category: "Results",
    title: "IBM selects 5 Cloud & Cognitive Software Interns",
    content: "5 students selected for IBM Cloud and cognitive engineering roles at ₹40,000/month stipend.",
    companySlug: "ibm",
    logo: "/logos/ibm.svg"
  },
  {
    id: "up-28-3",
    timestamp: "28 Oct 2026, 1:45 PM",
    company: "General Mills",
    category: "Results",
    title: "General Mills announces 6 selections for 2028 batch",
    content: "6 students offered Digital & Technology roles at ₹45,000/month stipend and 12–13 LPA PPO pathway.",
    companySlug: "general-mills",
    logo: "/logos/general-mills.png"
  },
  {
    id: "up-28-4",
    timestamp: "25 Oct 2026, 6:00 PM",
    company: "Mastercard",
    category: "Results",
    title: "Mastercard selects 9 software interns for 2028 batch",
    content: "9 candidates selected for software engineering internships at ₹50,000/month with direct full-time PPO pathway at ₹13–15 LPA.",
    companySlug: "mastercard",
    logo: "/logos/mastercard.svg"
  },
  {
    id: "up-28-5",
    timestamp: "20 Oct 2026, 2:30 PM",
    company: "Barclays",
    category: "Results",
    title: "Barclays leads 2028 hiring with 25 offers",
    content: "Historic early hiring outcome: 16 summer internships at ₹75,000/month plus 9 Technology Graduate Developers at ₹15.05 LPA.",
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
      headline: "25 total offers (16 Interns + 9 Dev)",
      pay: "₹15.05 LPA",
      type: "fulltime",
      details: "Top early recruiter with 16 summer interns (₹75k/mo) and 9 developer roles (₹15.05 LPA)."
    },
    {
      company: "Mastercard",
      slug: "mastercard",
      logo: "/logos/mastercard.svg",
      date: "25 Oct 2026",
      headline: "9 Software Interns",
      pay: "₹14.0 LPA",
      type: "internship",
      details: "9 selections with ₹50,000/month stipend and 13–15 LPA PPO conversion."
    },
    {
      company: "General Mills",
      slug: "general-mills",
      logo: "/logos/general-mills.png",
      date: "28 Oct 2026",
      headline: "6 Digital & Technology Interns",
      pay: "₹12.5 LPA",
      type: "internship",
      details: "6 candidates placed with ₹45,000/month stipend."
    },
    {
      company: "IBM",
      slug: "ibm",
      logo: "/logos/ibm.svg",
      date: "31 Oct 2026",
      headline: "5 Cloud & Software Interns",
      pay: "₹13.0 LPA",
      type: "internship",
      details: "5 selections for cloud computing & software engineering at ₹40k/mo."
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
      subtitle: "Summer Internships & Flagship Drives",
      badge: "Early Season",
      stat: "50 Offers",
      text: "The 2028 batch kicks off recruitment season with 50 confirmed selections across 5 premier global companies.",
      color: "var(--color-intern)"
    },
    {
      id: 2,
      company: "Barclays",
      slug: "barclays",
      logo: "/logos/barclays.png",
      badge: "Largest Early Recruiter",
      stat: "25 Offers",
      subtitle: "16 Interns + 9 Developers",
      text: "Barclays selected 25 students for the 2028 batch: 16 summer internships at ₹75,000/month and 9 developers at ₹15.05 LPA.",
      color: "var(--color-ppo)"
    },
    {
      id: 3,
      company: "Mastercard",
      slug: "mastercard",
      logo: "/logos/mastercard.svg",
      badge: "Payments Technology",
      stat: "9 Offers",
      subtitle: "₹50,000 / month",
      text: "Mastercard selected 9 software interns with high-probability PPO conversion opportunities.",
      color: "var(--color-fulltime)"
    },
    {
      id: 4,
      company: "General Mills & IBM",
      slug: "general-mills",
      logo: "/logos/general-mills.png",
      badge: "Enterprise Tech",
      stat: "11 Combined Offers",
      subtitle: "Data & Cloud Platforms",
      text: "General Mills (6 offers @ ₹45k/mo) and IBM (5 offers @ ₹40k/mo) conducted full recruitment cycles for the 2028 cohort.",
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
      text: "Russell Investments selected 5 students for investment technology and analytics research roles.",
      color: "var(--color-ppo)"
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
      totalCompanies: 29,
      studentsPlaced: 225,
      totalBatchSize: 360,
      placementPercentage: "63%",
      fulltimeOffersCount: 111,
      internshipsCount: 114,
      ppoCount: 72,
      highestCTC: "₹33.0 LPA",
      medianCTC: "₹13.0 LPA",
      averageCTC: "₹14.06 LPA",
      highestStipend: "₹1,60,000 / mo",
      medianStipend: "₹40,000 / mo",
      averageStipend: "₹53,600 / mo",
      drivesCount: 35,
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
      totalCompanies: 5,
      studentsPlaced: 50,
      totalBatchSize: 360,
      placementPercentage: "14%",
      fulltimeOffersCount: 9,
      internshipsCount: 41,
      ppoCount: 15,
      highestCTC: "₹15.05 LPA",
      medianCTC: "₹14.0 LPA",
      averageCTC: "₹14.05 LPA",
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

// Client-side batch accessor
export function getBatchKey() {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('batch');
    if (fromUrl === '2028' || fromUrl === '2027') {
      localStorage.setItem('spit_batch', fromUrl);
      return fromUrl;
    }
    const stored = localStorage.getItem('spit_batch');
    if (stored === '2028' || stored === '2027') return stored;
  }
  return "2027";
}

export function getActiveBatchData() {
  const key = getBatchKey();
  return allBatches[key] || allBatches["2027"];
}

export function setBatch(year) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spit_batch', year);
    const url = new URL(window.location.href);
    url.searchParams.set('batch', year);
    window.location.href = url.toString();
  }
}
