// SPIT 2027 Recruitment Timeline Dataset
// Month-by-month drive announcements and milestones from official records

export const timelineData = {
  summary: {
    internshipDrives: 15,
    finalYearDrives: 27,
    busiestMonth: "Jul – Oct 2026 (42 drives)",
    medianWaitDays: "12 days"
  },

  // Monthly stats for the timeline histogram chart
  months: [
    { label: "Jun 2026", count: 4, intern: 4, fulltime: 0, ppo: 0 },
    { label: "Jul 2026", count: 12, intern: 6, fulltime: 6, ppo: 4 },
    { label: "Aug 2026", count: 11, intern: 3, fulltime: 8, ppo: 3 },
    { label: "Sep 2026", count: 8, intern: 2, fulltime: 6, ppo: 2 },
    { label: "Oct 2026", count: 7, intern: 1, fulltime: 6, ppo: 2 }
  ],

  // Recent drive events from SPIT CSV
  events: [
    {
      date: "28 Oct 2026",
      company: "PhonePe",
      type: "fulltime",
      role: "Software Development Engineer (SDE)",
      status: "6 selections confirmed at ₹33 LPA (₹80k/mo stipend)"
    },
    {
      date: "24 Oct 2026",
      company: "JPMorgan Chase & Co. (JPMC)",
      type: "internship",
      role: "CIB Banking, Corporate Risk, CADP, CTC Risk & FinTech",
      status: "31 selections confirmed across 5 divisions (up to ₹1.60L/mo stipend)"
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
      role: "Graduate Engineering Trainee & Agentic AI Specialist",
      status: "14 selections confirmed (10 GET at ₹16 LPA + 4 Agentic AI at ₹13 LPA)"
    },
    {
      date: "29 Sep 2026",
      company: "TransUnion",
      type: "fulltime",
      role: "Developer / Quality Engineer",
      status: "10 selections confirmed at ₹9.5 LPA"
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
      company: "AuxoAI",
      type: "ppo",
      role: "Artificial Intelligence Engineer",
      status: "5 selections confirmed at ₹18.8 LPA with ₹60,000/mo stipend"
    }
  ]
};
