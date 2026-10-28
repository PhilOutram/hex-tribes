export const VERSION = "v0.09";

// Newest first. Bump VERSION and prepend an entry on EVERY publish, so the live
// app always shows exactly what shipped. Dates are YYYY-MM-DD.
export const CHANGELOG = [
  {
    version: "v0.09",
    date: "2026-10-28",
    notes: [
      "Active units at the top of the Units page, each with a health counter.",
      "The Super Unit is tracked there too (a city's Super Unit reward adds one).",
      "Climbing: units can climb over iron and stone mountains.",
    ],
  },
  {
    version: "v0.08",
    date: "2026-10-28",
    notes: [
      "Hold a research skill to see what it unlocks and why you'd want it.",
      "Research page shows the new 3 / 4 ★ prices (it still said 4 / 6).",
    ],
  },
  {
    version: "v0.07",
    date: "2026-10-28",
    notes: [
      "Tribes have names (Xin-xi, Oumaji, Imperius, Bardur) and a free starting skill.",
      "Population counter on each city and gatehouse shows how close it is to levelling up.",
    ],
  },
  {
    version: "v0.06",
    date: "2026-10-28",
    notes: [
      "Cheaper research (3 / 4 ★) and buildings to speed up the game; units unchanged.",
      "Cities page tracks each city's level and chosen rewards, with a Mega mill counter.",
      "Gatehouse costs 3 ★, is tracked on the Cities page and now has a castle icon.",
    ],
  },
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
