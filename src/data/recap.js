// SPIT 2027 Season Highlights and Interactive Recap Slides

export const recapData = {
  seasonTitle: "The Season, Replayed · SPIT 2027",
  latestPeriod: "August – October 2026",
  lastFiveCompanies: [
    {
      company: "PhonePe",
      slug: "phonepe",
      logo: "/logos/phonepe.png",
      date: "28 Oct 2026",
      headline: "6 SDE selections at ₹33.5 LPA",
      pay: "₹33.5 LPA",
      type: "fulltime",
      details: "Top package on campus: ₹19.25 LPA base + ₹5L joining bonus + stocks and ₹80k/mo stipend."
    },
    {
      company: "JPMorgan Chase & Co. (JPMC)",
      slug: "jpmc",
      logo: "/logos/jpmc.svg",
      date: "24 Oct 2026",
      headline: "41 offers across 6 banking & risk tracks",
      pay: "₹1.60L / mo",
      type: "internship",
      details: "Premier financial recruiter with 41 selections across CIB, IB, Risk and CADP tracks."
    },
    {
      company: "Barclays",
      slug: "barclays",
      logo: "/logos/barclays.png",
      date: "20 Oct 2026",
      headline: "28 total offers in Technology & Summer Interns",
      pay: "₹15.05 LPA",
      type: "fulltime",
      details: "12 Technology Graduate Developers (₹15.05 LPA) and 16 Summer Interns (₹75k/mo)."
    },
    {
      company: "ISS / STOXX",
      slug: "iss-stoxx",
      logo: "/logos/iss-stoxx.svg",
      date: "14 Oct 2026",
      headline: "15 SDE selections",
      pay: "₹14.7 LPA",
      type: "fulltime",
      details: "Major tech recruitment with 15 offers at ₹14.7 LPA and ₹60k/mo internship stipend."
    },
    {
      company: "UBS",
      slug: "ubs",
      logo: "/logos/ubs.svg",
      date: "08 Oct 2026",
      headline: "13 offers across Tech & Agentic AI",
      pay: "₹13.0 LPA",
      type: "fulltime",
      details: "9 Graduate Trainees and 4 Agentic AI Specialist engineers."
    }
  ],

  // Full slide cards for the interactive story reel player
  slides: [
    {
      id: 1,
      title: "SPIT 2027 Season Highlights",
      subtitle: "Sardar Patel Institute of Technology",
      badge: "Overview",
      stat: "235 Offers",
      text: "Placement season for SPIT's Class of 2027 records 235 confirmed selections across 31 premier multinationals and tech leaders.",
      color: "var(--color-intern)"
    },
    {
      id: 2,
      company: "PhonePe",
      slug: "phonepe",
      logo: "/logos/phonepe.png",
      badge: "Highest Package",
      stat: "₹33.5 LPA",
      subtitle: "6 SDE Selections",
      text: "PhonePe recruited 6 Software Development Engineers with compensation of ₹33–33.5 LPA and ₹80,000/month internship stipend.",
      color: "var(--color-ppo)"
    },
    {
      id: 3,
      company: "JPMorgan Chase & Co.",
      slug: "jpmc",
      logo: "/logos/jpmc.svg",
      badge: "Top Recruiter",
      stat: "41 Offers",
      subtitle: "Highest Stipend ₹1.60L / mo",
      text: "JPMC led the season with 41 selections across Investment Banking, Corporate Risk, CIB FinTech, and CADP.",
      color: "var(--color-fulltime)"
    },
    {
      id: 4,
      company: "Barclays",
      slug: "barclays",
      logo: "/logos/barclays.png",
      badge: "Major Fintech Recruiter",
      stat: "28 Offers",
      subtitle: "Graduate & Summer Interns",
      text: "Barclays extended 12 Technology Graduate Developer roles at ₹15.05 LPA and 16 Summer Internships at ₹75,000/month.",
      color: "var(--color-ppo)"
    },
    {
      id: 5,
      company: "ISS / STOXX",
      slug: "iss-stoxx",
      logo: "/logos/iss-stoxx.svg",
      badge: "High-Volume Tech Hiring",
      stat: "15 Offers",
      subtitle: "₹14.7 LPA CTC",
      text: "ISS / STOXX selected 15 Software Development Engineers with ₹14.7 LPA full-time package and ₹60,000/month stipend.",
      color: "var(--color-intern)"
    },
    {
      id: 6,
      company: "UBS & BlackRock",
      slug: "ubs",
      logo: "/logos/ubs.svg",
      badge: "AI & Capital Markets",
      stat: "21 Combined Offers",
      subtitle: "Agentic AI & Aladdin Platform",
      text: "UBS recruited 13 engineers including 4 Agentic AI Specialists, and BlackRock selected 8 engineers for SDE and Aladdin Data at ₹15 LPA.",
      color: "var(--color-fulltime)"
    }
  ]
};
