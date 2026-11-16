import type { BrotherId } from "@/lib/types"

export type StateVisit = {
  brother: BrotherId
  state: string
  note: string
}

/**
 * States Alexander has visited and stayed in.
 * Idaho is not included. He mentioned it from Wyoming and does not count it.
 * The District is Washington, DC, not Washington state.
 */
export const alecStateVisits: readonly StateVisit[] = [
  {
    brother: "alec",
    state: "Maine",
    note: "Vacationing with Hawkoms in Ogunquit. Drakes Island for the Mokas'. And surfing in York at Long Sands.",
  },
  {
    brother: "alec",
    state: "New Hampshire",
    note: "Born and raised.",
  },
  {
    brother: "alec",
    state: "Massachusetts",
    note: "College and living in Boston.",
  },
  {
    brother: "alec",
    state: "Rhode Island",
    note: "1 Atlantic Avenue, Newport with Uncle Dave felt like a second home.",
  },
  {
    brother: "alec",
    state: "Connecticut",
    note: "CCSU parties with Hawk and Hawk's wedding.",
  },
  {
    brother: "alec",
    state: "New York",
    note: "Countless times living it up in NYC. Staying up north at Congels' in the Steanatles and on the Hudson at West Point for Niko's graduation.",
  },
  {
    brother: "alec",
    state: "New Jersey",
    note: "Drew Mokas' wedding in Jersey City!",
  },
  {
    brother: "alec",
    state: "Maryland",
    note: "Mindy and I had both a lacrosse tournament there and post Silent Falcon fun.",
  },
  {
    brother: "alec",
    state: "Washington, DC",
    note: "Many visits to see Devito in Adams Morgan, a trip with Dad with the Secret Service watching us, and a trip to the Continental with him again after Silent Falcon.",
  },
  {
    brother: "alec",
    state: "Virginia",
    note: "Lived in the grand ol' Front Royal for 9 months.",
  },
  {
    brother: "alec",
    state: "Pennsylvania",
    note: "Lacrosse tournament in Philly.",
  },
  {
    brother: "alec",
    state: "North Carolina",
    note: "Chapel Hill, Lance deployment.",
  },
  {
    brother: "alec",
    state: "South Carolina",
    note: "Greenville, one of the most lovely places I've ever visited. Johnny, Bode, and I had a blast at their all-you-can-drink mimosas at this awesome brunch spot.",
  },
  {
    brother: "alec",
    state: "Georgia",
    note: "Many times to beautiful Savannah to stay with Niko and the family. Also Atlanta with the Wilson family.",
  },
  {
    brother: "alec",
    state: "Florida",
    note: "Miami is one of my favorite US cities to visit. Orlando was fun visiting Griff.",
  },
  {
    brother: "alec",
    state: "Mississippi",
    note: "Biloxi with Andrew! Tearing up the casino and Jefferson Davis' house.",
  },
  {
    brother: "alec",
    state: "Louisiana",
    note: "Solo trip to New Orleans. Met amazing people and had a blast in hostels and on Frenchmen Street. Café du Monde.",
  },
  {
    brother: "alec",
    state: "Arkansas",
    note: "Rogers for a Silent Falcon conference. I always tell people how shocked I was. Had a blast.",
  },
  {
    brother: "alec",
    state: "Tennessee",
    note: "Nashville is a fun ass city. The Broadway country bars are all time.",
  },
  {
    brother: "alec",
    state: "Missouri",
    note: "Kansas City for a Silent Falcon conference. Great BBQ.",
  },
  {
    brother: "alec",
    state: "Texas",
    note: "Fun Dallas with Uncle Dave and Aunt Jenean. Some tremendous trips there with them. Also Austin and Fort Worth.",
  },
  {
    brother: "alec",
    state: "Arizona",
    note: "Coyote Camp with the Pelletiers when we were youngins.",
  },
  {
    brother: "alec",
    state: "Colorado",
    note: "Denver trip for a Silent Falcon conference. Cute city, great mostly for outdoorsy things.",
  },
  {
    brother: "alec",
    state: "Wyoming",
    note: "Nina Braga's wedding with family. Crept into Idaho but I don't count that yet.",
  },
  {
    brother: "alec",
    state: "Utah",
    note: "Salt Lake City and neighboring towns for a Silent Falcon deployment. Park City for the Live Like Sam Gala.",
  },
  {
    brother: "alec",
    state: "California",
    note: "My new home. Future home San Diego, great visits. LA is great with Elias, and amazing San Francisco. Tahoe, Napa, and Sonoma are truly special too.",
  },
]
