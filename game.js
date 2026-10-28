// Game data, copied from the hand-drawn cardboard sheets: research tree, buildings table,
// units table, star tracker and city level upgrades.

// Each tribe's special bonus adds this much to one stat.
export const TRIBE_BONUS = 1;

// ink = text colour that reads clearly on top of the tribe colour; startTech = the inner ring
// skill the tribe starts with, free (Oumaji's Riding is the Explorer branch here); special =
// its bonus in words; bonus = the unit stat it raises, or cityPop for population in new
// cities.
export const TRIBES = [
  { key: "red", name: "Xin-xi", colour: "#d93a2b", ink: "#fff", startTech: "climbing",
    special: `Warriors have +${TRIBE_BONUS} HP`, bonus: { unit: "Warrior", stat: "hp" } },
  { key: "yellow", name: "Oumaji", colour: "#e8b10c", ink: "#2b1d0e", startTech: "explorer",
    special: `Explorers move +${TRIBE_BONUS}`, bonus: { unit: "Explorer", stat: "move" } },
  { key: "blue", name: "Imperius", colour: "#2a6fd6", ink: "#fff",
    startTech: "organization",
    special: `New cities start with ${TRIBE_BONUS} population`, bonus: { cityPop: true } },
  { key: "green", name: "Bardur", colour: "#2f9a45", ink: "#fff", startTech: "hunting",
    special: `Archers have +${TRIBE_BONUS} range`, bonus: { unit: "Archer", stat: "range" } },
];

// Research and building prices were lowered on 2026-10-27: the family test game grew too
// slowly. Unit prices stayed the same.
export const INNER_COST = 3;
export const OUTER_COST = 4;

// Inner ring, clockwise from top-left as drawn. Each branch opens three outer-ring skills.
// about = why you'd want it, shown when you hold the skill down. What it unlocks is worked
// out from the buildings and units tables, so it can't go out of date.
export const RESEARCH = [
  {
    key: "hunting", name: "Hunting", icon: "🦌",
    about: "A cheap way to grow cities that sit next to forest. It opens the path to " +
      "Lumber huts and Store houses for more population, and to Archers.",
    children: [
      { key: "storehouse", name: "Store house", icon: "🏠",
        about: "Build it in the middle of your lumber huts: the more huts around it, the " +
          "more population it gives. It also counts towards a Mega mill." },
      { key: "lumberhut", name: "Lumber hut", icon: "🪓",
        about: "Cheap population from forest. Group them together so a Store house can " +
          "sit next to several." },
      { key: "archer", name: "Archer", icon: "🏹",
        about: "Shoots from up to 3 hexes away, and a target that far away can't hit " +
          "back. Great for defending and for weakening enemies before you attack." },
    ],
  },
  {
    key: "organization", name: "Organization", icon: "🧺",
    about: "The cheapest way to grow cities on grassland. It opens the path to Farms, " +
      "Markets and the Defender.",
    children: [
      { key: "market", name: "Market", icon: "🏪",
        about: "Build it next to your farms: the more farms around it, the more " +
          "population it gives. It also counts towards a Mega mill." },
      { key: "farm", name: "Farm", icon: "🌾",
        about: "2 population on grass - the biggest single boost for a grassy city." },
      { key: "defender", name: "Defender", icon: "🛡️",
        about: "A cheap, tough unit that hits back hard. Park it in a city or on a " +
          "gatehouse to hold it. It is Static, so it can't move and then attack." },
    ],
  },
  {
    key: "climbing", name: "Climbing", icon: "🧗",
    about: "Your units can climb over iron mountains and stone mountains, so mountains " +
      "stop blocking your way. It also opens Stone quarries, Mining and the Swordsman.",
    children: [
      { key: "quarry", name: "Stone quarry", icon: "🪨",
        about: "Build it next to your mines: each mine around it adds 2 population. It " +
          "also counts towards a Mega mill." },
      { key: "mining", name: "Mining", icon: "⛏️",
        about: "Mines on iron mountains give 2 population, and make Stone quarries next " +
          "to them worth more." },
      { key: "swordsman", name: "Swordsman", icon: "⚔️",
        about: "Your strongest all-round fighter: good attack, defence and health for 5 " +
          "stars." },
    ],
  },
  {
    key: "explorer", name: "Explorer", icon: "🧭",
    about: "The Explorer moves 2 spaces, so it is quick at finding ruins and cities to " +
      "take. It opens Roads, the Gatehouse and the Rider.",
    children: [
      { key: "road", name: "Road", icon: "🛣️",
        about: "Gives population to both your capital and the town it reaches." },
      { key: "gatehouse", name: "Gatehouse", icon: "🏰",
        about: "A wall enemy units can't move onto - block a path into your land. At " +
          "level 2 you can train units on it, right at the front line." },
      { key: "rider", name: "Rider", icon: "🐎",
        about: "The Knight moves 3 spaces and has Persist: every kill lets it move on and " +
          "attack again, so it can break through a line of weak units." },
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

// Healing: a unit that rests (doesn't move or attack) for a go heals this much.
export const REST_HEAL      = 2;
export const CITY_REST_HEAL = 4;

// Kill rewards: stars for each kill; this many kills makes a Veteran with extra max HP.
export const KILL_STARS    = 1;
export const VETERAN_KILLS = 3;
export const VETERAN_HP    = 2;

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
  `<b>Healing:</b> a unit that doesn't move or attack on its go heals ${REST_HEAL} HP, or ` +
    `${CITY_REST_HEAL} HP in one of your cities. It never goes above full health.`,
  `<b>Kill rewards:</b> +${KILL_STARS} ★ for every enemy unit you kill. A unit with ` +
    `${VETERAN_KILLS} kills becomes a <b>Veteran</b>: +${VETERAN_HP} max HP and fully ` +
    "healed.",
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
export const POPULATION_REWARD   = 3;

export const STARS_PER_GO_RULE =
  "Each city gives stars per go equal to its level, like Polytopia. Your capital gives " +
  `${CAPITAL_EXTRA_STARS} extra. Gatehouses give none. Keep your cities below up to date ` +
  "and your stars per go follows.";

// Round limit: after this many rounds the tribe with the most points wins. Points come from
// city levels, researched skills (the free one too) and units still alive.
export const ROUND_LIMIT       = 15;
export const CITY_LEVEL_POINTS = 5;
export const SKILL_POINTS      = 3;
export const UNIT_POINTS       = 2;

export const WIN_RULE =
  `Take over all the other tribes' cities - or, after ${ROUND_LIMIT} rounds, the tribe with ` +
  "the most points wins.";

export const SCORE_RULE =
  `${CITY_LEVEL_POINTS} points for each city level, ${SKILL_POINTS} for each researched ` +
  `skill and ${UNIT_POINTS} for each unit still alive.`;

// The go timer, for whoever is taking their go.
export const GO_TIMER_SECONDS = 60;

// Every tribe starts the game with these stars and this unit.
export const START_STARS = 5;
export const START_UNIT  = "Warrior";

// City upgrades: pop = population needed to reach the next level; pick one reward. The last
// row repeats for every level from 5 up. perGo = stars per go the reward adds, stars = stars
// it gives once, perAdjacent = stars per go for each adjacent building you count, pop =
// population it adds to the city, unit = a unit it gives you.
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
    { name: "Population", icon: "👪", text: `+${POPULATION_REWARD} population`,
      pop: POPULATION_REWARD },
  ] },
  { from: "City level 4", to: "City level 5+", pop: 5, choices: [
    { name: "Super Unit", icon: "🗿", text: `A Super Unit (${SUPER_UNIT_MAX_HP} HP)`,
      unit: "Super Unit" },
    { name: "Park of fortune", icon: "🌳", text: `+${PARK_STARS} ★ per go`,
      perGo: PARK_STARS },
  ] },
];

export const GATEHOUSE_UPGRADE = {
  from: "Gatehouse level 1", to: "Gatehouse level 2", pop: GATEHOUSE_LEVEL_2_POP, choices: [
    { name: "Training ground", icon: "⚔️", text: "Units can be trained on the gatehouse" },
  ],
};

// Ruins: roll a six-sided die. Rolls 1-2 give a unit, 3-4 a building, 5 stars and 6 a free
// research skill. The building limit dropped from 3 to 2 with the cheaper buildings, so the
// same four (Organize, Hunt, Lumber hut, Road) are still on offer.
export const DIE_FACES = 6;
export const RUIN_MAX_UNIT_COST = 3;
export const RUIN_MAX_BUILDING_COST = 2;
export const RUIN_STARS = 4;

export const RUIN_OUTCOMES = [
  { rolls: [1, 2], kind: "unit", icon: "⚔️", title: "A unit",
    text: `Any unit costing up to ${RUIN_MAX_UNIT_COST} ★` },
  { rolls: [3, 4], kind: "building", icon: "🔨", title: "A building",
    text: `Any building costing up to ${RUIN_MAX_BUILDING_COST} ★` },
  { rolls: [5], kind: "stars", icon: "⭐", title: `${RUIN_STARS} stars`,
    text: `+${RUIN_STARS} ★ to spend` },
  { rolls: [6], kind: "research", icon: "📜", title: "A free skill",
    text: "Research any skill you can reach, for free" },
];
