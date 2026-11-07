import type { Place, PlaceCategory } from "@/lib/types"

type EliPin = {
  id: string
  name: string
  city: string
  neighborhood?: string
  country?: string
  category: PlaceCategory
  latitude: number
  longitude: number
  notes: string
}

function eli(input: EliPin): Place {
  return {
    brothers: ["eli"],
    ...input,
    country: input.country ?? "United States",
  }
}

/**
 * Elias's restaurants. He has been. Notes keep his wording when a name was
 * normalized, plus the door that was matched. No ratings were supplied.
 * "Ask for Shig" is the same North Hollywood sushi bar as Chiba, so it is one pin.
 * Los Angeles and New York already have restaurant pins, so no country pin is added.
 */
export const eliPlaces: readonly Place[] = [
  eli({
    id: "eli-chiba",
    name: "Chiba",
    city: "Los Angeles",
    neighborhood: "North Hollywood",
    category: "restaurant",
    latitude: 34.206944,
    longitude: -118.387849,
    notes: "Ask for Shig. Raul. 7515 Lankershim Boulevard.",
  }),
  eli({
    id: "eli-sachi-sushi",
    name: "Sachi Sushi",
    city: "Los Angeles",
    neighborhood: "West Hollywood",
    category: "restaurant",
    latitude: 34.087087,
    longitude: -118.380639,
    notes: "8730 Santa Monica Boulevard.",
  }),
  eli({
    id: "eli-hedleys",
    name: "Hedley's",
    city: "Los Angeles",
    neighborhood: "West Hollywood",
    category: "restaurant",
    latitude: 34.082033,
    longitude: -118.385339,
    notes: "Listed as Hedleys. 640 North Robertson Boulevard.",
  }),
  eli({
    id: "eli-carving-board",
    name: "The Carving Board",
    city: "Los Angeles",
    neighborhood: "West Los Angeles",
    category: "restaurant",
    latitude: 34.028619,
    longitude: -118.443042,
    notes: "11676 Gateway Boulevard.",
  }),
  eli({
    id: "eli-philz",
    name: "Philz Coffee",
    city: "Los Angeles",
    neighborhood: "Hollywood",
    category: "cafe",
    latitude: 34.097931,
    longitude: -118.330214,
    notes: "6430 Sunset Boulevard.",
  }),
  eli({
    id: "eli-sugarfish",
    name: "Sugarfish",
    city: "Los Angeles",
    neighborhood: "Marina del Rey",
    category: "restaurant",
    latitude: 33.979229,
    longitude: -118.439628,
    notes: "Listed as Sugar fish. 4722 Admiralty Way, Marina del Rey.",
  }),
  eli({
    id: "eli-estiatorio-louka",
    name: "Estiatorio Louká",
    city: "Los Angeles",
    neighborhood: "Beverly Hills",
    category: "restaurant",
    latitude: 34.069835,
    longitude: -118.400001,
    notes: "Listed as Estiotoria Luka. 340 North Canon Drive.",
  }),
  eli({
    id: "eli-avra",
    name: "Avra",
    city: "Los Angeles",
    neighborhood: "Beverly Hills",
    category: "restaurant",
    latitude: 34.067513,
    longitude: -118.3996,
    notes: "233 North Beverly Drive.",
  }),
  eli({
    id: "eli-kitchen-24",
    name: "Kitchen 24",
    city: "Los Angeles",
    neighborhood: "Hollywood",
    category: "restaurant",
    latitude: 34.100087,
    longitude: -118.329338,
    notes: "1608 North Cahuenga Boulevard.",
  }),
  eli({
    id: "eli-backyard-bowls",
    name: "Backyard Bowls",
    city: "Los Angeles",
    neighborhood: "Beverly Grove",
    category: "cafe",
    latitude: 34.075881,
    longitude: -118.370511,
    notes: "8303 Beverly Boulevard.",
  }),
  eli({
    id: "eli-apple-pan",
    name: "The Apple Pan",
    city: "Los Angeles",
    neighborhood: "West Los Angeles",
    category: "restaurant",
    latitude: 34.04071,
    longitude: -118.42783,
    notes: "Listed as Apple Pan. 10801 West Pico Boulevard.",
  }),
  eli({
    id: "eli-bombay-frankie",
    name: "The Bombay Frankie Company",
    city: "Los Angeles",
    neighborhood: "Culver City",
    category: "restaurant",
    latitude: 33.986662,
    longitude: -118.392937,
    notes: "Listed as Bombay Frankies. 6000 Sepulveda Boulevard, Culver City.",
  }),
  eli({
    id: "eli-tu-madre",
    name: "Tu Madre",
    city: "Los Angeles",
    neighborhood: "Westwood",
    category: "restaurant",
    latitude: 34.047492,
    longitude: -118.435049,
    notes: "Tacos. Sandeep suggested it. 1945 1/2 Westwood Boulevard.",
  }),
  eli({
    id: "eli-salsa-and-beer",
    name: "Salsa and Beer",
    city: "Los Angeles",
    neighborhood: "Lake Balboa",
    category: "restaurant",
    latitude: 34.193158,
    longitude: -118.518498,
    notes: "6740 White Oak Avenue, Lake Balboa.",
  }),
  eli({
    id: "eli-catch",
    name: "Catch",
    city: "Los Angeles",
    neighborhood: "West Hollywood",
    category: "restaurant",
    latitude: 34.081455,
    longitude: -118.383482,
    notes: "8715 Melrose Avenue.",
  }),
  eli({
    id: "eli-tar-and-roses",
    name: "Tar & Roses",
    city: "Los Angeles",
    neighborhood: "Santa Monica",
    category: "restaurant",
    latitude: 34.017989,
    longitude: -118.493095,
    notes: "Listed as Tar and Roses. 602 Santa Monica Boulevard.",
  }),
  eli({
    id: "eli-quantum-leap",
    name: "Quantum Leap",
    city: "New York",
    neighborhood: "Upper East Side",
    category: "restaurant",
    latitude: 40.760606,
    longitude: -73.961484,
    notes: "1103 1st Avenue.",
  }),
  eli({
    id: "eli-pause-cafe",
    name: "Pause Cafe",
    city: "New York",
    neighborhood: "Lower East Side",
    category: "cafe",
    latitude: 40.721226,
    longitude: -73.984094,
    notes: "3 Clinton Street.",
  }),
  eli({
    id: "eli-good-beer",
    name: "Good Beer",
    city: "New York",
    neighborhood: "East Village",
    category: "bar",
    latitude: 40.727919,
    longitude: -73.984377,
    notes: "422 East 9th Street.",
  }),
]
