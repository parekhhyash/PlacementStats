// SPIT 2027 Pay & CTC Statistics
// Derived from SPIT_2027_company_offers_ctc_stipend.csv

export const payData = {
  summary: {
    overallAverageCTC: "₹13.86 LPA",
    overallMedianCTC: "₹13.00 LPA",
    drivesWithSelections: 31,
    fulltimeAverageCTC: "₹14.20 LPA",
    fulltimeMedianCTC: "₹13.50 LPA",
    fulltimeDrivesCount: 16,
    ppoAverageCTC: "₹14.80 LPA",
    ppoMedianCTC: "₹15.00 LPA",
    ppoDrivesCount: 18,
    highestCTC: "₹33.50 LPA",
    lowestCTC: "₹8.23 LPA",
    highestStipend: "₹1,60,000 / mo",
    medianStipend: "₹50,000 / mo",
    averageStipend: "₹60,000 / mo"
  },

  // CTC Package Distribution Brackets
  brackets: [
    { tier: "Super Dream (> ₹20 LPA)", count: 6, percentage: "15%", color: "var(--color-ppo)", description: "PhonePe SDE (₹33.5 LPA) & marquee product roles" },
    { tier: "Dream (₹14 – ₹20 LPA)", count: 18, percentage: "45%", color: "var(--color-fulltime)", description: "IDFC, Barclays, BlackRock, ISS/STOXX, WorkIndia, Auxo AI, UBS, Futures First" },
    { tier: "Core Tech (₹10 – ₹14 LPA)", count: 9, percentage: "25%", color: "var(--color-intern)", description: "Capgemini, Aspect Ratio, InCred, InSync, Baker Hughes, Infosys" },
    { tier: "Standard (< ₹10 LPA)", count: 6, percentage: "15%", color: "var(--color-muted)", description: "GEP, TransUnion, Quantiphi, Wissen, Revvity, Axis MF" }
  ],

  // Stipend Distribution Brackets
  stipendBrackets: [
    { tier: "Premier (> ₹1,00,000 / mo)", count: 24, percentage: "28%", description: "JPMC (₹1.60L/mo CTC Risk, ₹1.35L/mo CIB/IB/FinTech)" },
    { tier: "High (₹60k – ₹1,00,000 / mo)", count: 32, percentage: "35%", description: "PhonePe (₹80k), Barclays (₹75k), Nomura (₹75k), Auxo (₹60k), UBS (₹60k)" },
    { tier: "Core (₹30k – ₹60k / mo)", count: 21, percentage: "24%", description: "BlackRock (₹50k), Baker Hughes (₹50k), IDFC (₹40k), WorkIndia (₹40k)" },
    { tier: "Base (< ₹30,000 / mo)", count: 12, percentage: "13%", description: "Colgate (₹25k), Quantiphi (₹24k), TransUnion (₹25k), Wissen (₹25k)" }
  ],

  // Real data points for CTC scatter / strip chart
  scatterPoints: [
    { name: "PhonePe", pay: 33.5, type: "fulltime", students: 6 },
    { name: "IDFC", pay: 18.1, type: "fulltime", students: 8 },
    { name: "Futures First", pay: 18.0, type: "fulltime", students: 3 },
    { name: "EdraLabs", pay: 16.5, type: "ppo", students: 1 },
    { name: "WorkIndia", pay: 16.0, type: "fulltime", students: 5 },
    { name: "Auxo AI", pay: 15.5, type: "ppo", students: 5 },
    { name: "Barclays", pay: 15.05, type: "fulltime", students: 12 },
    { name: "BlackRock", pay: 15.0, type: "fulltime", students: 8 },
    { name: "ISS / STOXX", pay: 14.7, type: "fulltime", students: 15 },
    { name: "Mahindra Finance", pay: 14.0, type: "fulltime", students: 9 },
    { name: "Nomura", pay: 13.9, type: "fulltime", students: 1 },
    { name: "UBS", pay: 13.0, type: "fulltime", students: 13 },
    { name: "Capgemini", pay: 13.0, type: "fulltime", students: 5 },
    { name: "Baker Hughes", pay: 13.0, type: "fulltime", students: 3 },
    { name: "Aspect Ratio", pay: 12.0, type: "fulltime", students: 3 },
    { name: "InCred", pay: 12.0, type: "fulltime", students: 5 },
    { name: "InSync Analytics", pay: 11.5, type: "ppo", students: 3 },
    { name: "Infosys", pay: 11.0, type: "fulltime", students: 2 },
    { name: "Wissen", pay: 9.5, type: "fulltime", students: 9 },
    { name: "GEP", pay: 9.0, type: "fulltime", students: 9 },
    { name: "TransUnion", pay: 9.0, type: "fulltime", students: 10 },
    { name: "Quantiphi", pay: 8.5, type: "fulltime", students: 9 },
    { name: "Axis Mutual Fund", pay: 8.23, type: "fulltime", students: 1 },
    { name: "Revvity", pay: 8.0, type: "ppo", students: 7 }
  ]
};
