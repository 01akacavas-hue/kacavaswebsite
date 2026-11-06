/**
 * Countries Nicholas has been to, in the order Alexander wrote them.
 * America is stored as the United States, and Czechia as the Czech Republic,
 * so they match the place records and are not counted twice.
 * England stays England. Alexander's London pins use United Kingdom, which belongs to his list.
 */
export const nikoVisitedCountries = [
  "Canada",
  "United States",
  "Jamaica",
  "Barbados",
  "Turks and Caicos",
  "France",
  "Spain",
  "Greece",
  "Italy",
  "Germany",
  "Luxembourg",
  "Malta",
  "Monaco",
  "Poland",
  "Czech Republic",
  "Estonia",
  "Latvia",
  "England",
  "Belgium",
  "Netherlands",
  "Switzerland",
  "Austria",
  "Hungary",
] as const

/** Fold the names Alexander used into the names the place records already use. */
export function canonicalCountry(country: string): string {
  if (country === "America") return "United States"
  if (country === "Czechia") return "Czech Republic"
  return country
}
