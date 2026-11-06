// SPIT 2027 Recruitment Timeline Dataset
// Month-by-month drive announcements and milestones

export const timelineData = {
  summary: {
    internshipDrives: 15,
    finalYearDrives: 23,
    busiestMonth: "Aug 2026 (14 drives)",
    medianWaitDays: "14 days"
  },

  // Monthly stats for the timeline histogram chart
  months: [
    { label: "Jun 2026", count: 4, intern: 4, fulltime: 0, ppo: 0 },
    { label: "Jul 2026", count: 8, intern: 5, fulltime: 3, ppo: 0 },
    { label: "Aug 2026", count: 14, intern: 4, fulltime: 8, ppo: 2 },
    { label: "Sep 2026", count: 7, intern: 2, fulltime: 4, ppo: 1 },
    { label: "Oct 2026", count: 5, intern: 0, fulltime: 4, ppo: 1 }
  ],

  // Recent drive events from SPIT CSV
  events: [
    {
      date: "28 Oct 2026",
      company: "PhonePe",
      type: "fulltime",
      role: "Software Development Engineer (SDE)",
      status: "6 selections confirmed at ₹33.5 LPA (₹80k/mo stipend)"
    },
    {
      date: "24 Oct 2026",
      company: "JPMorgan Chase & Co. (JPMC)",
      type: "internship",
      role: "CIB Banking, Corporate Risk, CADP, CTC Risk & IB",
      status: "41 selections confirmed across 6 divisions (up to ₹1.60L/mo stipend)"
    },
    {
      date: "20 Oct 2026",
      company: "Barclays",
      type: "fulltime",
      role: "Technology Graduate Developer & Summer Internship",
      status: "28 total offers (12 FT at ₹15.05 LPA + 16 interns at ₹75k/mo)"
    },
    {
      date: "14 Oct 2026",
      company: "ISS / STOXX",
      type: "fulltime",
      role: "Software Development Engineer",
      status: "15 selections confirmed at ₹14.7 LPA (₹60k/mo stipend)"
    },
    {
      date: "08 Oct 2026",
      company: "UBS",
      type: "fulltime",
      role: "Graduate Trainee & Agentic AI Specialist",
      status: "13 selections confirmed (9 FT + 4 Agentic AI at ₹13 LPA + bonus)"
    },
    {
      date: "29 Sep 2026",
      company: "BlackRock",
      type: "fulltime",
      role: "SDE + Aladdin Data",
      status: "8 selections confirmed at ₹15 LPA (₹50k/mo stipend)"
    },
    {
      date: "22 Sep 2026",
      company: "IDFC FIRST Bank",
      type: "fulltime",
      role: "Application Engineer",
      status: "8 selections confirmed at ₹18.10 LPA"
    },
    {
      date: "15 Sep 2026",
      company: "Auxo AI",
      type: "ppo",
      role: "Artificial Intelligence Engineer",
      status: "5 selections confirmed at ₹15.5 LPA base + bonus"
    }
  ]
};
