// SPIT 2027 Branch Placement Statistics
// Computer Engineering, Information Technology, EXTC, and AI & Data Science

export const branches = [
  {
    id: "cse",
    name: "Computer Engineering",
    shortName: "CSE",
    color: "var(--color-br-ce)",
    placedPercentage: 77,
    totalStudents: 110,
    placedStudents: 85,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹15.2 LPA",
    highestCTC: "₹33.5 LPA",
    ppoCount: 38,
    topRecruiters: [
      { name: "JPMC", offers: 15, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 12, logo: "/logos/barclays.png" },
      { name: "PhonePe", offers: 4, logo: "/logos/phonepe.png" },
      { name: "BlackRock", offers: 5, logo: "/logos/blackrock.svg" },
      { name: "ISS / STOXX", offers: 7, logo: "/logos/iss-stoxx.svg" }
    ],
    summary: "Premier hiring rate across top fintech multinationals, algorithmic trading desks, and high-scale consumer tech firms."
  },
  {
    id: "it",
    name: "Information Technology",
    shortName: "IT",
    color: "var(--color-br-it)",
    placedPercentage: 75,
    totalStudents: 90,
    placedStudents: 68,
    medianCTC: "₹13.5 LPA",
    averageCTC: "₹14.5 LPA",
    highestCTC: "₹33.5 LPA",
    ppoCount: 28,
    topRecruiters: [
      { name: "JPMC", offers: 14, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 10, logo: "/logos/barclays.png" },
      { name: "UBS", offers: 6, logo: "/logos/ubs.svg" },
      { name: "WorkIndia", offers: 3, logo: "/logos/workindia.svg" },
      { name: "IDFC", offers: 4, logo: "/logos/idfc.svg" }
    ],
    summary: "Strong presence in distributed systems, investment banking platforms, and full-stack software development roles."
  },
  {
    id: "extc",
    name: "Electronics & Telecommunication",
    shortName: "EXTC",
    color: "var(--color-br-entc)",
    placedPercentage: 55,
    totalStudents: 90,
    placedStudents: 50,
    medianCTC: "₹11.0 LPA",
    averageCTC: "₹12.0 LPA",
    highestCTC: "₹18.1 LPA",
    ppoCount: 16,
    topRecruiters: [
      { name: "IDFC", offers: 3, logo: "/logos/idfc.svg" },
      { name: "Baker Hughes", offers: 3, logo: "/logos/baker-hughes.svg" },
      { name: "Futures First", offers: 2, logo: "/logos/futures-first.png" },
      { name: "Capgemini", offers: 3, logo: "/logos/capgemini.png" },
      { name: "GEP", offers: 4, logo: "/logos/gep.svg" }
    ],
    summary: "Active recruiting in financial technology analytics, energy systems engineering, core networks, and software applications."
  },
  {
    id: "aids",
    name: "AI & Data Science",
    shortName: "AI & DS",
    color: "var(--color-br-aids)",
    placedPercentage: 74,
    totalStudents: 70,
    placedStudents: 52,
    medianCTC: "₹14.5 LPA",
    averageCTC: "₹15.8 LPA",
    highestCTC: "₹33.5 LPA",
    ppoCount: 22,
    topRecruiters: [
      { name: "Auxo AI", offers: 5, logo: "/logos/auxo-ai.svg" },
      { name: "UBS (Agentic AI)", offers: 4, logo: "/logos/ubs.svg" },
      { name: "Quantiphi", offers: 6, logo: "/logos/quantiphi.svg" },
      { name: "PhonePe", offers: 2, logo: "/logos/phonepe.png" },
      { name: "Revvity", offers: 4, logo: "/logos/revvity.svg" }
    ],
    summary: "High-demand cohort specializing in generative & agentic AI architectures, quantitative analytics, and machine learning engineering."
  },
  {
    id: "all",
    name: "All Branches Combined",
    shortName: "All",
    color: "var(--color-fg)",
    placedPercentage: 65,
    totalStudents: 360,
    placedStudents: 235,
    medianCTC: "₹13.0 LPA",
    averageCTC: "₹13.86 LPA",
    highestCTC: "₹33.5 LPA",
    ppoCount: 93,
    topRecruiters: [
      { name: "JPMC", offers: 41, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 28, logo: "/logos/barclays.png" },
      { name: "ISS / STOXX", offers: 15, logo: "/logos/iss-stoxx.svg" },
      { name: "UBS", offers: 13, logo: "/logos/ubs.svg" },
      { name: "TransUnion", offers: 10, logo: "/logos/transunion.svg" }
    ],
    summary: "Comprehensive batch-wide analytics for SPIT Class of 2027 across all 4 engineering branches."
  }
];

export function getBranchById(id) {
  return branches.find(b => b.id.toLowerCase() === id.toLowerCase()) || branches[0];
}
