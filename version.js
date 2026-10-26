export const VERSION = "v0.02";

// Newest first. Bump VERSION and prepend an entry on EVERY publish, so the live
// app always shows exactly what shipped. Dates are YYYY-MM-DD.
export const CHANGELOG = [
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
