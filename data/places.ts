import type { Place } from "@/lib/types"

/**
 * Restaurants and places.
 *
 * The map starts empty. Add a confirmed visit by copying this shape:
 *
 *   {
 *     id: "short-unique-id",
 *     name: "The place name",
 *     city: "City",
 *     country: "Country",
 *     type: "restaurant", // or "place"
 *     latitude: 42.99,    // north is positive
 *     longitude: -71.46,  // east is positive
 *     brothers: ["eli"],  // "alec", "eli", and/or "niko"
 *     notes: "Who ordered what.",
 *     example: false,
 *   },
 *
 * Two pins in one city should not share the exact same coordinates.
 * Nearby pins are spread automatically when the map is zoomed out.
 *
 * Nicholas is on active duty. Do not add his unit, his base, or a deployment.
 */

export const places: readonly Place[] = []
