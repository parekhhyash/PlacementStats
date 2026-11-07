// Configuration for the Placement Statistics Portal
// Configured for Sardar Patel Institute of Technology (SPIT), Batch 2027

import { companies } from '../data/companies.js';

export const siteConfig = {
  // College Information
  collegeName: "Sardar Patel Institute of Technology",
  collegeShort: "SPIT",
  collegeLocation: "Mumbai, India",
  batchYear: "2027",
  batchLabel: "Class of 2027",
  siteTitle: "Placed ’27 · SPIT",
  siteTagline: "Campus recruitment statistics, roles, pay packages and selection analytics for SPIT 2027.",
  
  // Status banner
  statusBadge: "Placements in progress",
  isActiveSeason: true,
  lastUpdatedDate: "November 2026",

  // Top summary headline stats from SPIT 2027 classified data
  stats: {
    totalCompanies: companies.length,
    studentsPlaced: companies.reduce((sum, c) => sum + (c.out?.students || 0), 0),
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

  // Navigation Links
  navLinks: [
    { label: "Highlights", href: "/highlights/", glow: true },
    { label: "Companies", href: "/companies/" },
    { label: "Pay", href: "/pay/" },
    { label: "Branches", href: "/branches/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Submit Data", href: "/corrections/" }
  ],

  // Footer Actions
  footer: {
    feedbackLink: "/feedback/",
    correctionLink: "/corrections/",
    contactLink: "/contact/",
    shareText: "Check out the SPIT 2027 placement statistics and campus recruitment analytics on Placed ’27!"
  }
};
