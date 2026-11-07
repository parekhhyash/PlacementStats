// Eligibility & Academic Cut-off Dataset
// Customize according to your college's placement cell eligibility policies

export const eligibilityData = {
  summary: {
    mostCommonCGPA: "6.74",
    mostCommonCount: 37,
    totalDrivesStatedCGPA: 102,
    medianCGPA: "6.85",
    openToAllPercent: "70%",
    openToAllCount: 74,
    totalDrivesStatedBranches: 105,
    femaleOnlyDrives: 1
  },

  // Histogram buckets for CGPA cut-offs
  cgpaDistribution: [
    { label: "Under 6.0", count: 0, percentage: 0 },
    { label: "6.0–6.5", count: 12, percentage: 12 },
    { label: "6.5–7.0", count: 52, percentage: 51 },
    { label: "7.0–7.5", count: 24, percentage: 23 },
    { label: "7.5–8.0", count: 10, percentage: 10 },
    { label: "8.0–8.5", count: 3, percentage: 3 },
    { label: "8.5+", count: 1, percentage: 1 }
  ],

  // 10th and 12th criteria
  schoolMarksCriteria: [
    { criteria: "No minimum specified", drives: 28, percentage: "27%" },
    { criteria: "60% or 6.0 CGPA", drives: 48, percentage: "47%" },
    { criteria: "70% or 7.0 CGPA", drives: 22, percentage: "22%" },
    { criteria: "75% and above", drives: 4, percentage: "4%" }
  ],

  // Highest CGPA cut-off recruiters
  highestCutoffs: [
    { company: "Arista Networks", cgpa: "8.50", branches: "CE, CSE", offers: "Full-time" },
    { company: "Bloomberg", cgpa: "8.00", branches: "All branches", offers: "Full-time / Intern" },
    { company: "Cohesity", cgpa: "8.00", branches: "CE, CSE", offers: "Full-time" },
    { company: "Cadence Design", cgpa: "7.75", branches: "CE, CSE, EXTC", offers: "Full-time" },
    { company: "Amazon", cgpa: "7.50", branches: "CE, CSE, EXTC", offers: "Full-time / Intern" }
  ],

  // Backlog criteria policies
  backlogRules: [
    { rule: "No active backlogs allowed", count: 86, percentage: "84%" },
    { rule: "No history of backlogs (clean record)", count: 12, percentage: "12%" },
    { rule: "1 active backlog permitted", count: 4, percentage: "4%" }
  ]
};
