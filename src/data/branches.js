// SPIT 2027 Branch Placement Statistics
// Computer Engineering (CE), Computer Science Engineering (CSE), and Electronics & Telecommunications Engineering (EXTC)

export const branches = [
  {
    id: "ce",
    name: "Computer Engineering",
    shortName: "CE",
    color: "var(--color-br-ce, #10b981)",
    placedPercentage: 32,
    totalStudents: 266,
    placedStudents: 86,
    medianCTC: "₹14.0 LPA",
    averageCTC: "₹15.2 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 28,
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
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    color: "var(--color-br-cse, #38bdf8)",
    placedPercentage: 61,
    totalStudents: 137,
    placedStudents: 84,
    medianCTC: "₹13.8 LPA",
    averageCTC: "₹14.8 LPA",
    highestCTC: "₹33.0 LPA",
    ppoCount: 27,
    topRecruiters: [
      { name: "JPMC", offers: 14, logo: "/logos/jpmc.svg" },
      { name: "Barclays", offers: 11, logo: "/logos/barclays.png" },
      { name: "ISS / STOXX", offers: 7, logo: "/logos/iss-stoxx.svg" },
      { name: "UBS", offers: 6, logo: "/logos/ubs.svg" },
      { name: "IDFC FIRST Bank", offers: 4, logo: "/logos/idfc.svg" }
    ],
    summary: "Strong presence in distributed systems, intelligent computing platforms, and full-stack software development roles."
  },
  {
    id: "extc",
    name: "Electronics and Telecommunications Engineering",
    shortName: "EXTC",
    color: "var(--color-br-entc, #c2185b)",
    placedPercentage: 44,
    totalStudents: 131,
    placedStudents: 58,
    medianCTC: "₹11.0 LPA",
    averageCTC: "₹12.0 LPA",
    highestCTC: "₹18.1 LPA",
    ppoCount: 17,
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
    id: "all",
    name: "All Branches Combined",
    shortName: "All",
    color: "var(--color-fg)",
    placedPercentage: 43,
    totalStudents: 534,
    placedStudents: 228,
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
    summary: "Comprehensive batch-wide analytics for SPIT Class of 2027 across all 3 engineering branches."
  }
];

export function getBranchById(id) {
  return branches.find(b => b.id.toLowerCase() === id.toLowerCase()) || branches[0];
}
