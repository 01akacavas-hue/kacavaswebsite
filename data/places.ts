import type { Place } from "@/lib/types"

/**
 * Restaurants and places.
 *
 * Every pin shipped with the site is an EXAMPLE. The notes say so.
 * Replace them, or add real visits below the examples and delete the ones
 * you do not want.
 *
 * To add a place, copy a block and edit it:
 *
 *   {
 *     id: "short-unique-id",          // letters, numbers, hyphens
 *     name: "The place name",
 *     city: "City",
 *     country: "Country",
 *     type: "restaurant",             // or "place"
 *     latitude: 42.99,                // decimal degrees, north is positive
 *     longitude: -71.46,              // decimal degrees, east is positive
 *     brothers: ["eli"],              // "alec", "eli", and/or "niko"
 *     notes: "Who ordered what.",
 *     example: false,                 // true only while it is still a sample
 *   },
 *
 * Coordinates can be approximate. Two pins in one city should not share the
 * exact same pair or they will stack.
 *
 * Nicholas is on active duty. Do not add his unit, his base, or a deployment.
 * West Point may stay: it is school, class of 2022, and the note should say so.
 */

export const places: readonly Place[] = [
  {
    id: "example-foundry",
    name: "The Foundry",
    city: "Manchester",
    country: "United States",
    type: "restaurant",
    latitude: 42.9904,
    longitude: -71.4632,
    brothers: ["eli"],
    notes:
      "EXAMPLE. Elias has named The Foundry as a favorite New Hampshire restaurant. Confirm the visit, then set example to false or replace this pin.",
    example: true,
  },
  {
    id: "example-fotia",
    name: "Fotia",
    city: "Manchester",
    country: "United States",
    type: "restaurant",
    latitude: 43.0008,
    longitude: -71.4496,
    brothers: ["eli"],
    notes:
      "EXAMPLE. Elias has named Fotia, a Greek restaurant, as a favorite in New Hampshire. Confirm the visit before treating this as a record.",
    example: true,
  },
  {
    id: "example-bay-ridge",
    name: "Bay Ridge",
    city: "Brooklyn",
    country: "United States",
    type: "place",
    latitude: 40.636,
    longitude: -74.031,
    brothers: ["eli"],
    notes:
      "EXAMPLE. Elias spent a gap year in Bay Ridge. Replace this with a specific table or address.",
    example: true,
  },
  {
    id: "example-new-york",
    name: "New York",
    city: "New York",
    country: "United States",
    type: "place",
    latitude: 40.748,
    longitude: -73.986,
    brothers: ["eli"],
    notes:
      "EXAMPLE. As of a June 2024 interview he was based in New York. Add the actual restaurant.",
    example: true,
  },
  {
    id: "example-manchester",
    name: "Manchester",
    city: "Manchester",
    country: "United States",
    type: "place",
    latitude: 42.9956,
    longitude: -71.4548,
    brothers: ["alec", "eli", "niko"],
    notes: "EXAMPLE. The brothers grew up in Manchester, New Hampshire. Add a real table.",
    example: true,
  },
  {
    id: "example-west-point",
    name: "West Point",
    city: "West Point",
    country: "United States",
    type: "place",
    latitude: 41.3915,
    longitude: -73.9557,
    brothers: ["niko"],
    notes:
      "EXAMPLE. United States Military Academy, class of 2022. This is school, not a duty station. Do not add a unit, a base, or a deployment.",
    example: true,
  },
  {
    id: "example-san-francisco",
    name: "San Francisco",
    city: "San Francisco",
    country: "United States",
    type: "place",
    latitude: 37.7879,
    longitude: -122.4075,
    brothers: ["alec"],
    notes: "EXAMPLE. Alec lives in San Francisco and works at Lance. Add the restaurant.",
    example: true,
  },
  {
    id: "example-babson",
    name: "Babson College",
    city: "Wellesley",
    country: "United States",
    type: "place",
    latitude: 42.2968,
    longitude: -71.2656,
    brothers: ["alec"],
    notes: "EXAMPLE. Alec attended Babson College. Replace this with a Boston or Wellesley table.",
    example: true,
  },
  {
    id: "example-farnborough",
    name: "Farnborough",
    city: "Farnborough",
    country: "United Kingdom",
    type: "place",
    latitude: 51.276,
    longitude: -0.776,
    brothers: ["alec"],
    notes:
      "EXAMPLE. Alec went to the Farnborough International Airshow while at Silent Falcon. Add a meal if there was one.",
    example: true,
  },
  {
    id: "example-seattle",
    name: "Seattle",
    city: "Seattle",
    country: "United States",
    type: "place",
    latitude: 47.6062,
    longitude: -122.3321,
    brothers: ["alec"],
    notes: "EXAMPLE. Alec attended the AAAE Conference in Seattle. Add the actual place.",
    example: true,
  },
]
