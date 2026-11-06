// SPIT 2027 Branch Placement Statistics
// Computer Engineering, Information Technology, EXTC, and AI & Data Science

export const branches = [
  {
    id: "cse",
    name: "Computer Engineering",
    shortName: "CSE",
    color: "var(--color-br-ce)",
    placedPercentage: 69,
    totalStudents: 110,
    placedStudents: 76,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹15.2 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 26,
    topRecruiters: [
      { name: "JPMC", offers: 15, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 12, logo: "/logos/barclays.png" },
      { name: "ISS / STOXX", offers: 8, logo: "/logos/iss-stoxx.svg" },
      { name: "UBS", offers: 6, logo: "/logos/ubs.svg" },
      { name: "PhonePe", offers: 4, logo: "/logos/phonepe.png" }
    ],
    summary: "Premier hiring rate across top fintech multinationals, algorithmic trading desks, and high-scale consumer tech firms."
  },
  {
    id: "it",
    name: "Information Technology",
    shortName: "IT",
    color: "var(--color-br-it)",
    placedPercentage: 69,
    totalStudents: 90,
    placedStudents: 62,
    medianCTC: "₹13.5 LPA",
    averageCTC: "₹14.5 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 20,
    topRecruiters: [
      { name: "JPMC", offers: 10, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 10, logo: "/logos/barclays.png" },
      { name: "ISS / STOXX", offers: 7, logo: "/logos/iss-stoxx.svg" },
      { name: "UBS", offers: 4, logo: "/logos/ubs.svg" },
      { name: "IDFC FIRST Bank", offers: 4, logo: "/logos/idfc.svg" }
    ],
    summary: "Strong presence in distributed systems, investment banking platforms, and full-stack software development roles."
  },
  {
    id: "extc",
    name: "Electronics & Telecommunication",
    shortName: "EXTC",
    color: "var(--color-br-entc)",
    placedPercentage: 48,
    totalStudents: 90,
    placedStudents: 43,
    medianCTC: "₹11.0 LPA",
    averageCTC: "₹12.0 LPA",
    highestCTC: "₹18.1 LPA",
    ppoCount: 11,
    topRecruiters: [
      { name: "GEP Worldwide", offers: 4, logo: "/logos/gep.svg" },
      { name: "IDFC FIRST Bank", offers: 4, logo: "/logos/idfc.svg" },
      { name: "Capgemini", offers: 3, logo: "/logos/capgemini.png" },
      { name: "Baker Hughes", offers: 3, logo: "/logos/baker-hughes.svg" },
      { name: "Futures First", offers: 2, logo: "/logos/futures-first.png" }
    ],
    summary: "Active recruiting in financial technology analytics, energy systems engineering, core networks, and software applications."
  },
  {
    id: "aids",
    name: "AI & Data Science",
    shortName: "AI & DS",
    color: "var(--color-br-aids)",
    placedPercentage: 63,
    totalStudents: 70,
    placedStudents: 44,
    medianCTC: "₹14.5 LPA",
    averageCTC: "₹15.8 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 15,
    topRecruiters: [
      { name: "JPMC", offers: 6, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 6, logo: "/logos/barclays.png" },
      { name: "Quantiphi", offers: 5, logo: "/logos/quantiphi.svg" },
      { name: "AuxoAI", offers: 5, logo: "/logos/auxo-ai.svg" },
      { name: "UBS (Agentic AI)", offers: 4, logo: "/logos/ubs.svg" }
    ],
    summary: "High-demand cohort specializing in generative & agentic AI architectures, quantitative analytics, and machine learning engineering."
  },
  {
    id: "all",
    name: "All Branches Combined",
    shortName: "All",
    color: "var(--color-fg)",
    placedPercentage: 63,
    totalStudents: 360,
    placedStudents: 225,
    medianCTC: "₹13.0 LPA",
    averageCTC: "₹14.06 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 72,
    topRecruiters: [
      { name: "JPMC", offers: 31, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 28, logo: "/logos/barclays.png" },
      { name: "ISS / STOXX", offers: 15, logo: "/logos/iss-stoxx.svg" },
      { name: "UBS", offers: 14, logo: "/logos/ubs.svg" },
      { name: "TransUnion", offers: 10, logo: "/logos/transunion.svg" }
    ],
    summary: "Comprehensive batch-wide analytics for SPIT Class of 2027 across all 4 engineering branches."
  }
];

export function getBranchById(id) {
  return branches.find(b => b.id.toLowerCase() === id.toLowerCase()) || branches[0];
}
