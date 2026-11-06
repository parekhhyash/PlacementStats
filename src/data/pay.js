// SPIT 2027 Pay & CTC Statistics
// Derived from classified placement dataset

export const payData = {
  summary: {
    overallAverageCTC: "₹14.06 LPA",
    overallMedianCTC: "₹13.00 LPA",
    drivesWithSelections: 29,
    fulltimeAverageCTC: "₹14.10 LPA",
    fulltimeMedianCTC: "₹13.50 LPA",
    fulltimeDrivesCount: 22,
    ppoAverageCTC: "₹14.70 LPA",
    ppoMedianCTC: "₹15.00 LPA",
    ppoDrivesCount: 16,
    highestCTC: "₹33.00 LPA",
    lowestCTC: "₹8.23 LPA",
    highestStipend: "₹1,60,000 / mo",
    medianStipend: "₹40,000 / mo",
    averageStipend: "₹53,600 / mo"
  },

  // CTC Package Distribution Brackets
  brackets: [
    { tier: "Super Dream (> ₹20 LPA)", count: 6, percentage: "3%", color: "var(--color-ppo)", description: "PhonePe SDE (₹33 LPA) & marquee product engineering roles" },
    { tier: "Dream (₹14 – ₹20 LPA)", count: 67, percentage: "30%", color: "var(--color-fulltime)", description: "IDFC FIRST, Barclays, ISS/STOXX, WorkIndia, AuxoAI, UBS, Nomura, Futures First" },
    { tier: "Core Tech (₹10 – ₹14 LPA)", count: 56, percentage: "25%", color: "var(--color-intern)", description: "Capgemini, AspectRatio, InCred, InSync, Baker Hughes, Infosys, Colgate" },
    { tier: "Standard (< ₹10 LPA)", count: 96, percentage: "42%", color: "var(--color-muted)", description: "GEP Worldwide, TransUnion, Quantiphi, Wissen, Revvity, Axis MF, JPMC Risk" }
  ],

  // Stipend Distribution Brackets
  stipendBrackets: [
    { tier: "Premier (> ₹1,00,000 / mo)", count: 24, percentage: "21%", description: "JPMC (₹1.60L/mo CTC Risk, ₹1.35L/mo CIB/FinTech)" },
    { tier: "High (₹60k – ₹1,00,000 / mo)", count: 47, percentage: "41%", description: "PhonePe (₹80k), Barclays (₹75k), Nomura (₹75k), AuxoAI (₹60k), UBS (₹60k), Russell (₹60k)" },
    { tier: "Core (₹30k – ₹60k / mo)", count: 26, percentage: "23%", description: "Baker Hughes (₹50k), Pfizer (₹50k), WorkIndia (₹40k), IDFC (₹40k), Nouryon (₹35k), BNY (₹30k), Revvity (₹30k)" },
    { tier: "Base (< ₹30,000 / mo)", count: 17, percentage: "15%", description: "Colgate-Palmolive (₹25k), InSync (₹25k), Infosys (₹25k), TransUnion (₹25k), InCred (₹25k), Quantiphi (₹24k)" }
  ],

  // Real data points for CTC scatter / strip chart
  scatterPoints: [
    { name: "PhonePe", pay: 33.0, type: "fulltime", students: 6 },
    { name: "AuxoAI", pay: 18.8, type: "ppo", students: 5 },
    { name: "IDFC FIRST Bank", pay: 18.1, type: "fulltime", students: 8 },
    { name: "Futures First", pay: 18.0, type: "fulltime", students: 4 },
    { name: "Edra Labs", pay: 16.5, type: "ppo", students: 1 },
    { name: "WorkIndia", pay: 16.0, type: "fulltime", students: 5 },
    { name: "Nomura (KakushIN)", pay: 15.7, type: "fulltime", students: 7 },
    { name: "Barclays", pay: 15.05, type: "fulltime", students: 12 },
    { name: "ISS / STOXX", pay: 14.7, type: "fulltime", students: 15 },
    { name: "Mahindra Finance", pay: 14.0, type: "fulltime", students: 9 },
    { name: "Nomura", pay: 13.9, type: "fulltime", students: 1 },
    { name: "UBS", pay: 16.0, type: "fulltime", students: 14 },
    { name: "Capgemini", pay: 13.0, type: "fulltime", students: 4 },
    { name: "Baker Hughes", pay: 13.0, type: "fulltime", students: 3 },
    { name: "AspectRatio", pay: 12.0, type: "fulltime", students: 3 },
    { name: "InCred Finance", pay: 12.0, type: "fulltime", students: 5 },
    { name: "InSync Analytics", pay: 11.5, type: "ppo", students: 3 },
    { name: "Infosys", pay: 11.0, type: "fulltime", students: 2 },
    { name: "TransUnion", pay: 9.5, type: "fulltime", students: 10 },
    { name: "Wissen Technology", pay: 9.5, type: "fulltime", students: 9 },
    { name: "GEP Worldwide", pay: 9.0, type: "fulltime", students: 9 },
    { name: "Quantiphi", pay: 8.5, type: "fulltime", students: 9 },
    { name: "Axis Mutual Fund", pay: 8.23, type: "fulltime", students: 1 },
    { name: "Revvity", pay: 8.0, type: "ppo", students: 7 }
  ]
};
