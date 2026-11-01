export type Role = {
  id: string
  period: string
  title: string
  org: string
  place: string
  detail: string
  current?: boolean
}

export const alecRoles: readonly Role[] = [
  {
    id: "silent-falcon",
    period: "2022–2024",
    title: "Sales and business development",
    org: "Silent Falcon UAS Technologies",
    place: "Started after Babson",
    detail:
      "He began in May 2022 as a business development associate, after a Babson Management Consulting Field Experience, then moved into sales. His profile has listed Director of Sales from August 2022 to April 2024. The work included calling small airports, the AAAE Conference in Seattle, and the Farnborough International Airshow. He stayed on part-time through senior year.",
  },
  {
    id: "blue-water",
    period: "Aug 2024 – Sep 2025",
    title: "Growth",
    org: "Blue Water Mortgage",
    place: "Boston",
    detail: "Cold outreach. The dates overlap his time at Vive Mints, as they do on his public profile.",
  },
  {
    id: "vive",
    period: "Feb 2025 – Sep 2025",
    title: "Co-founder and CEO",
    org: "Vive Mints",
    place: "Boston",
    detail: "He co-founded the company.",
  },
  {
    id: "rho",
    period: "Sep 2025 – Oct 2026",
    title: "GTM, Startup Banking",
    org: "Rho",
    place: "San Francisco",
    detail: "Account executive for startup banking.",
  },
  {
    id: "lance",
    period: "Oct 2026 – present",
    title: "GTM lead",
    org: "Lance",
    place: "San Francisco",
    detail:
      "Lance, Y Combinator W26, builds AI for hotel operations. Lance Live covers guest calls, staff messaging, housekeeping, work orders, and scheduling. It is live in more than 50 hotels, including properties under the Marriott, Hilton, and Hyatt brands. Backers include Y Combinator, SV Angel, and executives from OpenAI, Expedia, and Marriott. The co-founders are Caleb Chan, Gavin Brennen, and Gatik Trivedi. Alec has been described as the company's first GTM hire.",
    current: true,
  },
]

export const alecQuote = {
  text: "From hosting family and friends at home to traveling around the world. Taking care of others is how I believe people should operate.",
  source: "Alec, on joining Lance",
  href: "https://www.linkedin.com/posts/aleckacavas_i-have-a-new-hotel-key-it-unlocks-my-role-activity-7519067663931752448-WxTb",
}
