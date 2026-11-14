// Configuration for the Placement Statistics Portal
// Configured for Sardar Patel Institute of Technology (SPIT), Batch 2027

import { companies } from '../data/companies.js';

export const siteConfig = {
  // Canonical Site URL & SEO Metadata
  siteUrl: "https://placement-stats.vercel.app",
  seo: {
    siteName: "Placed ’27 · SPIT Placements",
    defaultTitle: "Placed ’27 · SPIT Placement Statistics & Campus Recruitment Analytics",
    titleTemplate: "%s | SPIT Placements",
    defaultDescription: "Explore verified campus placement records, recruiter salary packages, stipend distributions, branch-wise statistics, and drive timelines for Sardar Patel Institute of Technology (SPIT Mumbai).",
    defaultKeywords: "SPIT placement statistics, SPIT placements 2027, Sardar Patel Institute of Technology placements, SPIT Mumbai average package, SPIT highest package, SPIT recruiter CTC, SPIT branchwise placement, SPIT Computer Engineering, SPIT CSE, SPIT EXTC",
    ogImage: "/og.png",
    twitterHandle: "@spit_mumbai"
  },

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
    placementPercentage: "74%",
    fulltimeOffersCount: 139,
    internshipsCount: 114,
    ppoCount: 72,
    highestCTC: "₹33.0 LPA",
    medianCTC: "₹14.70 LPA",
    averageCTC: "₹14.27 LPA",
    highestStipend: "₹1,60,000 / mo",
    medianStipend: "₹40,000 / mo",
    averageStipend: "₹53,600 / mo",
    drivesCount: 47,
    busiestMonth: "Jul 2026"
  },

  // Navigation Links
  navLinks: [
    { label: "Highlights", href: "/highlights/", glow: true },
    { label: "Companies", href: "/companies/" },
    { label: "Offers", href: "/offers/" },
    { label: "Branchwise", href: "/branchwise/" },
    { label: "Timeline", href: "/timeline/" },
    { label: "Submit Data", href: "/corrections/" },
    { label: "Feedback", href: "/feedback/" }
  ],

  // Footer Actions
  footer: {
    feedbackLink: "/feedback/",
    correctionLink: "/corrections/",
    contactLink: "/contact/",
    shareText: "Check out the SPIT 2027 placement statistics and campus recruitment analytics on Placed ’27!"
  }
};
