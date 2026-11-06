// Configuration for the Placement Statistics Portal
// Configured for Sardar Patel Institute of Technology (SPIT), Batch 2027

export const siteConfig = {
  // College Information
  collegeName: "Sardar Patel Institute of Technology",
  collegeShort: "SPIT",
  collegeLocation: "Mumbai, India",
  batchYear: "2027",
  batchLabel: "Class of 2027",
  siteTitle: "Placed ’27 · SPIT",
  siteTagline: "Official campus recruitment statistics, roles, pay packages and selection analytics for SPIT 2027.",
  
  // Status banner
  statusBadge: "Placements in progress",
  isActiveSeason: true,
  lastUpdatedDate: "November 2026",

  // Top summary headline stats from SPIT 2027 data
  stats: {
    totalCompanies: 31,
    studentsPlaced: 235,
    totalBatchSize: 360,
    placementPercentage: "65%",
    fulltimeOffersCount: 146,
    internshipsCount: 89,
    ppoCount: 93,
    highestCTC: "₹33.5 LPA",
    medianCTC: "₹13.0 LPA",
    averageCTC: "₹13.86 LPA",
    highestStipend: "₹1,60,000 / mo",
    medianStipend: "₹50,000 / mo",
    averageStipend: "₹60,000 / mo",
    drivesCount: 38,
    busiestMonth: "Aug 2026",
    medianWaitDays: "14 days"
  },

  // Navigation Links (Eligibility removed per previous request)
  navLinks: [
    { label: "Companies", href: "/companies/" },
    { label: "Recap", href: "/recap/", glow: true },
    { label: "Pay", href: "/pay/" },
    { label: "Offers", href: "/selections/" },
    { label: "Branches", href: "/branches/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "About", href: "/about/" }
  ],

  // Footer Actions
  footer: {
    feedbackLink: "/feedback/",
    correctionLink: "/corrections/",
    contactLink: "/contact/",
    shareText: "Check out the SPIT 2027 placement statistics and campus recruitment analytics on Placed ’27!"
  }
};
