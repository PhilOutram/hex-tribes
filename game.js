// Game data, copied from the hand-drawn cardboard sheets: research tree, buildings table,
// units table, star / super unit tracker and city level upgrades.

export const TRIBES = [
  // ink = text colour that reads clearly on top of the tribe colour.
  { key: "red", name: "Red", colour: "#d93a2b", ink: "#fff" },
  { key: "yellow", name: "Yellow", colour: "#e8b10c", ink: "#2b1d0e" },
  { key: "blue", name: "Blue", colour: "#2a6fd6", ink: "#fff" },
  { key: "green", name: "Green", colour: "#2f9a45", ink: "#fff" },
];

// Research and building prices were lowered on 2026-10-27: the family test game grew too
// slowly. Unit prices stayed the same.
export const INNER_COST = 3;
export const OUTER_COST = 4;

// Inner ring, clockwise from top-left as drawn. Each branch opens three outer-ring skills.
export const RESEARCH = [
  {
    key: "hunting", name: "Hunting", icon: "🦌",
    children: [
      { key: "storehouse", name: "Store house", icon: "🏠" },
      { key: "lumberhut", name: "Lumber hut", icon: "🪓" },
      { key: "archer", name: "Archer", icon: "🏹" },
    ],
  },
  {
    key: "organization", name: "Organization", icon: "🧺",
    children: [
      { key: "market", name: "Market", icon: "🏪" },
      { key: "farm", name: "Farm", icon: "🌾" },
      { key: "defender", name: "Defender", icon: "🛡️" },
    ],
  },
  {
    key: "climbing", name: "Climbing", icon: "🧗",
    children: [
      { key: "quarry", name: "Stone quarry", icon: "🪨" },
      { key: "mining", name: "Mining", icon: "⛏️" },
      { key: "swordsman", name: "Swordsman", icon: "⚔️" },
    ],
  },
  {
    key: "explorer", name: "Explorer", icon: "🧭",
    children: [
      { key: "road", name: "Road", icon: "🛣️" },
      { key: "gatehouse", name: "Gatehouse", icon: "🏰" },
      { key: "rider", name: "Rider", icon: "🐎" },
    ],
  },
];

export const GATEHOUSE_COST = 3;
export const GATEHOUSE_LEVEL_2_POP = 4;

// research = key of the research skill that unlocks it; note = rule text shown on the card.
export const BUILDINGS = [
  { name: "Organize", icon: "🧺", research: "organization", cost: 1, terrain: "Grass",
    pop: "1" },
  { name: "Hunt", icon: "🦌", research: "hunting", cost: 1, terrain: "Wood", pop: "1" },
  { name: "Lumber hut", icon: "🪓", research: "lumberhut", cost: 2, terrain: "Wood",
    pop: "1" },
  { name: "Store house", icon: "🏠", research: "storehouse", cost: 3, terrain: "Wood / grass",
    pop: "1 per adjacent lumber hut" },
  { name: "Farm", icon: "🌾", research: "farm", cost: 4, terrain: "Grass", pop: "2" },
  { name: "Market", icon: "🏪", research: "market", cost: 3, terrain: "Grass",
    pop: "1 per adjacent farm" },
  { name: "Mine", icon: "⛏️", research: "mining", cost: 3, terrain: "Iron mountain",
    pop: "2" },
  { name: "Stone quarry", icon: "🪨", research: "quarry", cost: 3, terrain: "Grass / wood",
    pop: "2 per adjacent mine" },
  { name: "Road", icon: "🛣️", research: "road", cost: 1, terrain: "Grass / wood",
    pop: "1 for capital, 1 for town" },
  { name: "Gatehouse", icon: "🏰", research: "gatehouse", cost: GATEHOUSE_COST,
    terrain: "1 or 2 spaces from one of your cities",
    pop: `${GATEHOUSE_LEVEL_2_POP} pop to reach level 2`,
    note: "Enemy units can't move onto it. At level 2, units can be trained on it. " +
      "It never gives stars per go." },
];

export const UNIT_STATS = [
  { key: "atk", label: "Atk" },
  { key: "def", label: "Def" },
  { key: "hp", label: "HP" },
  { key: "cost", label: "Cost" },
  { key: "move", label: "Move" },
  { key: "range", label: "Range" },
  { key: "atkBack", label: "Atk bak" },
];

// research: null = available from the start; unlock = text shown when not unlocked by
// research.
export const SUPER_UNIT_MAX_HP = 20;

const STATIC_TEXT = "Static: can't move and then attack in the same go.";

// Stats rebalanced on 2026-10-27 for Atk - Def damage (they were tuned for Atk / Def).
// ability = rule text shown on the unit's card.
export const UNITS = [
  { name: "Warrior", icon: "🪖", research: null, unlock: "Start unit",
    atk: 3, def: 1, hp: 4, cost: 2, move: 1, range: 1, atkBack: 2 },
  { name: "Explorer", icon: "🧭", research: "explorer",
    atk: 3, def: 1, hp: 4, cost: 3, move: 2, range: 1, atkBack: 1 },
  { name: "Defender", icon: "🛡️", research: "defender", tag: "Static", ability: STATIC_TEXT,
    atk: 2, def: 2, hp: 5, cost: 3, move: 1, range: 1, atkBack: 3 },
  { name: "Archer", icon: "🏹", research: "archer",
    atk: 3, def: 1, hp: 5, cost: 4, move: 1, range: 3, atkBack: 1 },
  { name: "Swordsman", icon: "⚔️", research: "swordsman",
    atk: 4, def: 2, hp: 6, cost: 5, move: 1, range: 1, atkBack: 2 },
  { name: "Knight", icon: "🐎", research: "rider", tag: "Persist",
    ability: "Persist: after each kill it moves onto the space and may attack again.",
    atk: 5, def: 1, hp: 5, cost: 6, move: 3, range: 1, atkBack: 2 },
  { name: "Super Unit", icon: "🗿", research: null, unlock: "City level 5", tag: "Static",
    ability: STATIC_TEXT,
    atk: 4, def: 1, hp: SUPER_UNIT_MAX_HP, cost: null, move: 1, range: 1, atkBack: 2 },
];

// Combat: damage is Atk minus Def, but never less than this.
export const MIN_DAMAGE = 1;

export const COMBAT_RULES = [
  `<b>Damage</b> = attacker's Atk − target's Def, always at least ${MIN_DAMAGE}.`,
  "<b>Hitting back:</b> if the target survives, it hits the attacker with its Atk bak − " +
    `the attacker's Def, again at least ${MIN_DAMAGE}.`,
  "<b>Range:</b> the target can only hit back if the attacker is within the target's own " +
    "range. An Archer shooting from 2 or 3 hexes away is not hit back.",
  "<b>Kills:</b> a unit that kills the unit it attacked moves onto that space. An Archer " +
    "shooting from further away stays where it is.",
  "<b>Static</b> (Defender, Super Unit): can't move and then attack in the same go.",
  "<b>Persist</b> (Knight): it moves once, but after each kill it moves onto the space and " +
    "may attack again. It keeps going as long as it keeps killing.",
  "<b>Example:</b> a Warrior (Atk 3) attacks a Defender (Def 2) and does 1 damage. The " +
    "Defender survives and hits back for 3 − 1 = 2.",
];
// Stars per go: each city gives its level, and the capital gives this much extra.
export const CITY_LEVEL_STARS    = 1;
export const CAPITAL_EXTRA_STARS = 1;
export const WORKSHOP_STARS      = 1;
export const PARK_STARS          = 2;
export const MEGA_MILL_STARS     = 1;
export const RESOURCES_STARS     = 5;

export const STARS_PER_GO_RULE =
  "Each city gives stars per go equal to its level, like Polytopia. Your capital gives " +
  `${CAPITAL_EXTRA_STARS} extra. Gatehouses give none. Keep your cities below up to date ` +
  "and your stars per go follows.";

export const WIN_RULE = "Take over all the other tribes' cities.";

// City upgrades: pop = population needed to reach the next level; pick one reward. The last
// row repeats for every level from 5 up. perGo = stars per go the reward adds, stars = stars
// it gives once, perAdjacent = stars per go for each adjacent building you count.
export const CITY_LEVELS = [
  { from: "City level 1", to: "City level 2", pop: 2, choices: [
    { name: "Workshop", icon: "🔨", text: `+${WORKSHOP_STARS} ★ per go`,
      perGo: WORKSHOP_STARS },
    { name: "Mega mill", icon: "🏭",
      text: `+${MEGA_MILL_STARS} ★ per go for each adjacent store house, market and quarry`,
      perAdjacent: MEGA_MILL_STARS },
  ] },
  { from: "City level 2", to: "City level 3", pop: 3, choices: [
    { name: "Resources", icon: "💰", text: `+${RESOURCES_STARS} ★`, stars: RESOURCES_STARS },
    { name: "City wall", icon: "🧱", text: "+1 defence in the city" },
  ] },
  { from: "City level 3", to: "City level 4", pop: 4, choices: [
    { name: "Border growth", icon: "🗺️", text: "City borders grow" },
    { name: "Population", icon: "👪", text: "+3 population" },
  ] },
  { from: "City level 4", to: "City level 5+", pop: 5, choices: [
    { name: "Super Unit", icon: "🗿", text: `A Super Unit (${SUPER_UNIT_MAX_HP} HP)` },
    { name: "Park of fortune", icon: "🌳", text: `+${PARK_STARS} ★ per go`,
      perGo: PARK_STARS },
  ] },
];

export const GATEHOUSE_UPGRADE = {
  from: "Gatehouse level 1", to: "Gatehouse level 2", pop: GATEHOUSE_LEVEL_2_POP, choices: [
    { name: "Training ground", icon: "⚔️", text: "Units can be trained on the gatehouse" },
  ],
};

// Ruins: roll a six-sided die. Rolls 1-2 give a unit, 3-4 a building, 5-6 stars. The
// building limit dropped from 3 to 2 with the cheaper buildings, so the same four
// (Organize, Hunt, Lumber hut, Road) are still on offer.
export const DIE_FACES = 6;
export const RUIN_MAX_UNIT_COST = 3;
export const RUIN_MAX_BUILDING_COST = 2;
export const RUIN_STARS = 4;

export const RUIN_OUTCOMES = [
  { rolls: [1, 2], kind: "unit", icon: "⚔️", title: "A unit",
    text: `Any unit costing up to ${RUIN_MAX_UNIT_COST} ★` },
  { rolls: [3, 4], kind: "building", icon: "🔨", title: "A building",
    text: `Any building costing up to ${RUIN_MAX_BUILDING_COST} ★` },
  { rolls: [5, 6], kind: "stars", icon: "⭐", title: `${RUIN_STARS} stars`,
    text: `+${RUIN_STARS} ★ to spend` },
];
