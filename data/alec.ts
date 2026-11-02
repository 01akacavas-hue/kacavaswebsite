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
      "I started in May 2022 as a business development associate, after a Babson Management Consulting Field Experience, then moved into sales. Director of Sales from August 2022 to April 2024. I called small airports, worked the AAAE Conference in Seattle, and went to the Farnborough International Airshow. I stayed on part-time through senior year.",
  },
  {
    id: "blue-water",
    period: "Aug 2024 – Sep 2025",
    title: "Growth",
    org: "Blue Water Mortgage",
    place: "Boston",
    detail: "Cold outreach in Boston. The dates overlap Vive Mints, the same way my profile lists them.",
  },
  {
    id: "vive",
    period: "Feb 2025 – Sep 2025",
    title: "Co-founder and CEO",
    org: "Vive Mints",
    place: "Boston",
    detail: "I co-founded the company.",
  },
  {
    id: "rho",
    period: "Sep 2025 – Oct 2026",
    title: "GTM, Startup Banking",
    org: "Rho",
    place: "San Francisco",
    detail: "Account executive for startup banking in San Francisco.",
  },
  {
    id: "lance",
    period: "Oct 2026 – present",
    title: "GTM lead",
    org: "Lance",
    place: "San Francisco",
    detail:
      "Lance is Y Combinator W26. We build AI for hotel operations. Lance Live covers guest calls, staff messaging, housekeeping, work orders, and scheduling. It is live in more than 50 hotels, including Marriott, Hilton, and Hyatt properties. Backers include Y Combinator, SV Angel, and executives from OpenAI, Expedia, and Marriott. The co-founders are Caleb Chan, Gavin Brennen, and Gatik Trivedi. I was the first GTM hire.",
    current: true,
  },
]

/**
 * An Academy Award statuette, not a still from CODA and not a photo of Alexander.
 * Downloaded from Wikimedia Commons. License: Creative Commons Attribution-ShareAlike 4.0.
 * Source: https://commons.wikimedia.org/wiki/File:DSC_7227_Музей_кино.jpg
 * Author: Amm789 (https://commons.wikimedia.org/wiki/User:Amm789), own work, 2021-05-17.
 */
export const academyAwardPhoto = {
  src: "/images/alec/academy-award.jpg",
  alt: "An Academy Award statuette in a museum case.",
  width: 1280,
  height: 854,
  author: "Amm789",
  authorUrl: "https://commons.wikimedia.org/wiki/User:Amm789",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:DSC_7227_Музей_кино.jpg",
  depicted: "Oscar statuette for the 1943 documentary Moscow Strikes Back, at the State Central Film Museum in Moscow",
} as const

export const alecQuote = {
  text: "From hosting family and friends at home to traveling around the world. Taking care of others is how I believe people should operate.",
  source: "Alexander, on joining Lance",
  href: "https://www.linkedin.com/posts/aleckacavas_i-have-a-new-hotel-key-it-unlocks-my-role-activity-7519067663931752448-WxTb",
}
