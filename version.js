export const VERSION = "v0.05";

// Newest first. Bump VERSION and prepend an entry on EVERY publish, so the live
// app always shows exactly what shipped. Dates are YYYY-MM-DD.
export const CHANGELOG = [
  {
    version: "v0.05",
    date: "2026-10-27",
    notes: [
      "Fence is now the Gatehouse, with its own building card and level 2 reward.",
      "Static explained; Mega mill counts store houses, markets and quarries; how to win.",
      "Stars per go rule and a city level-up button on the Cities page.",
    ],
  },
  {
    version: "v0.04",
    date: "2026-10-27",
    notes: [
      "Super Unit: Def 1 and 20 HP (tracker now counts down from 20).",
      "New rules: a unit that kills moves onto the space; Persist lets the Knight keep " +
        "attacking while it keeps killing.",
    ],
  },
  {
    version: "v0.03",
    date: "2026-10-27",
    notes: [
      "Combat is now Atk − Def (at least 1); the rules are at the top of the Units page.",
      "Unit stats rebalanced: Archers cost 4, Knights cost 6 and are stronger, Defenders " +
        "have Def 2.",
    ],
  },
  {
    version: "v0.02",
    date: "2026-10-26",
    notes: [
      "Researching, building or training now takes the stars off automatically; undo gives " +
        "them back.",
      "Build and Train buttons on unlocked cards.",
      "Stars banner under the header, on every page.",
    ],
  },
  {
    version: "v0.01",
    date: "2026-10-26",
    notes: [
      "Splash screen, tribe colour and seven swipeable pages: research tree, buildings, " +
        "units, ruins dice, star tracker and city levels.",
    ],
  },
];
