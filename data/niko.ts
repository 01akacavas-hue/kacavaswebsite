export type ServiceEntry = {
  id: string
  period: string
  title: string
  detail: string
}

/**
 * Role titles and West Point only.
 * Do not add a unit designation, a base, or a deployment.
 */
export const nikoService: readonly ServiceEntry[] = [
  {
    id: "west-point",
    period: "2018–2022",
    title: "United States Military Academy",
    detail:
      "West Point. Bachelor of Science in Political Science, minor in European Regional Studies. Class of 2022.",
  },
  {
    id: "s3",
    period: "Jul 2023 – Nov 2023",
    title: "Assistant Operations Officer",
    detail: "Staff role.",
  },
  {
    id: "scout",
    period: "Nov 2023 – Dec 2024",
    title: "Scout Platoon Leader",
    detail: "Cavalry.",
  },
  {
    id: "uas",
    period: "Dec 2024 – Jun 2025",
    title: "Brigade UAS Platoon Leader",
    detail: "Unmanned aircraft.",
  },
  {
    id: "adjutant",
    period: "Jun 2025 – Jan 2026",
    title: "Brigade Adjutant",
    detail: "Brigade staff.",
  },
  {
    id: "aide",
    period: "Jan 2026 – present",
    title: "Aide-de-camp",
    detail: "Current role.",
  },
]

export const nikoPromotion = {
  year: "2025",
    detail:
      "Promoted to captain in 2025. The West Point Association of Graduates lists Nicholas H. Kacavas ’22. The list does not give the day.",
}
