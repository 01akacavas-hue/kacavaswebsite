/**
 * Visited U.S. cities in the guides, mapped once.
 * The city of Washington is Washington, DC, counted beside the states.
 * Washington state stays Washington.
 */
export const usStateByCity: Record<string, string> = {
  Arlington: "Virginia",
  Atlanta: "Georgia",
  Berkeley: "California",
  Boston: "Massachusetts",
  Brookline: "Massachusetts",
  Cambridge: "Massachusetts",
  Charleston: "South Carolina",
  Chatham: "Massachusetts",
  Columbus: "Georgia",
  "Daytona Beach": "Florida",
  Denver: "Colorado",
  Everett: "Massachusetts",
  Haleiwa: "Hawaii",
  Hampton: "New Hampshire",
  Honolulu: "Hawaii",
  Kittery: "Maine",
  "Los Angeles": "California",
  Marshfield: "Massachusetts",
  Meredith: "New Hampshire",
  Miami: "Florida",
  "Mount Pleasant": "South Carolina",
  Nashville: "Tennessee",
  "New Haven": "Connecticut",
  "New Orleans": "Louisiana",
  "New York": "New York",
  Newburgh: "New York",
  Orlando: "Florida",
  "Port Orange": "Florida",
  Portsmouth: "New Hampshire",
  Provincetown: "Massachusetts",
  Rye: "New Hampshire",
  "San Francisco": "California",
  Savannah: "Georgia",
  Seattle: "Washington",
  Somerville: "Massachusetts",
  Tampa: "Florida",
  Vacherie: "Louisiana",
  Vernon: "Connecticut",
  Wallace: "Louisiana",
  Washington: "Washington, DC",
  Wellfleet: "Massachusetts",
  Worcester: "Massachusetts",
  York: "Maine",
}

export function stateForCity(city: string): string | null {
  return usStateByCity[city] ?? null
}
