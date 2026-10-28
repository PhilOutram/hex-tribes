// Hex Tribes - splash screen, then seven swipeable reference pages: home (tribe colour),
// research tree, buildings, units, ruins dice, star tracker and city levels.
import { VERSION, CHANGELOG } from "./version.js?v=0.06";
import {
  TRIBES, INNER_COST, OUTER_COST, RESEARCH, BUILDINGS, UNIT_STATS, UNITS,
  SUPER_UNIT_MAX_HP, CITY_LEVELS, DIE_FACES, RUIN_MAX_UNIT_COST, RUIN_MAX_BUILDING_COST,
  RUIN_STARS, RUIN_OUTCOMES, COMBAT_RULES, CITY_LEVEL_STARS, CAPITAL_EXTRA_STARS,
  STARS_PER_GO_RULE, WIN_RULE, GATEHOUSE_UPGRADE,
} from "./game.js?v=0.06";

// Register the service worker so the app is installable and works offline.
// The relative path resolves correctly on the GitHub Pages /<slug>/ subpath.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}

const STORE_KEY = "hex-tribes-state";
const DEFAULT_TRIBE = "blue";

const TABS = [
  { icon: "🚩", label: "Home" },
  { icon: "📜", label: "Research" },
  { icon: "🔨", label: "Build" },
  { icon: "⚔️", label: "Units" },
  { icon: "🎲", label: "Ruins" },
  { icon: "⭐", label: "Tracker" },
  { icon: "🏘️", label: "Cities" },
];
const TRACKER_PAGE = 5;

// A city starts at level 1; a gatehouse has levels 1 and 2.
const START_CITY_LEVEL = 1;
const FIRST_REWARD_LEVEL = 2;
const GATEHOUSE_MAX_LEVEL = 2;
const CAPITAL_NAME = "Capital";

// Research tree layout, in SVG units around the centre (0, 0). Angles are in degrees,
// clockwise from 3 o'clock; the first branch sits top-left as on the cardboard.
const INNER_RADIUS = 84;
const OUTER_RADIUS = 160;
const NODE_RADIUS = 25;
const RING_GAP = 5;
const CENTRE_RADIUS = 26;
const FIRST_BRANCH_ANGLE = -135;
const BRANCH_STEP = 90;
const CHILD_SPREAD = 30;
const LABEL_OFFSET = 15;
const LABEL_GAP_ABOVE = 9;
const GLYPH_BASELINE = 8;
const COST_LABEL_ANGLE = -90;
const OUTER_COST_RADIUS = 122;

const SPEND_STEPS = [2, 3, 4, 5, 6, 8];

// Die roll animation: show this many random faces, this far apart, before the result.
const ROLL_FRAMES = 9;
const ROLL_FRAME_MS = 70;

// Which of the die's 3 x 3 pip spots are filled for each face (index = face - 1).
const PIP_SPOTS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
const DIE_SPOTS = 9;
const TOAST_MS = 2200;
const TOAST_ACTION_MS = 5000;

// Every research skill by key, with its parent (inner ring skills have none) and cost.
const NODES = {};
RESEARCH.forEach((branch) => {
  NODES[branch.key] = { ...branch, parent: null, cost: INNER_COST };
  branch.children.forEach((child) => {
    NODES[child.key] = { ...child, parent: branch.key, cost: OUTER_COST };
  });
});
const NODE_COUNT = Object.keys(NODES).length;
const GATEHOUSE = BUILDINGS.find((b) => b.research === "gatehouse");

const state = loadState();

const splash = document.getElementById("splash");
const app = document.getElementById("app");
const pages = document.getElementById("pages");
const pageEls = [...pages.querySelectorAll(".page")];
let currentPage = Math.min(state.page, pageEls.length - 1);
let toastTimer = 0;
let rolling = false;
let bannerStars = state.stars;

applyTribe();
renderTabs();
renderTribes();
document.getElementById("win-rule").textContent = WIN_RULE;
renderTree();
renderBuildings();
renderUnits();
renderCombatRules();
renderRuins();
renderTracker();
renderCities();
renderBanner();
renderVersionBadge(document.body, "version-badge splash-version");
renderVersionBadge(document.getElementById("home-version"), "version-badge inline");

// Any tap, click or key on the splash moves on to the app.
splash.addEventListener("click", showApp);
document.addEventListener("keydown", (e) => {
  if (!splash.hidden && !e.repeat) showApp();
});
document.getElementById("home").addEventListener("click", showSplash);
document.getElementById("star-banner").addEventListener("click", () => goToPage(TRACKER_PAGE));
document.getElementById("building-list").addEventListener("click", (e) => {
  buyFrom(e, BUILDINGS, "Built");
});
document.getElementById("unit-list").addEventListener("click", (e) => {
  buyFrom(e, UNITS, "Trained");
});
document.getElementById("new-game").addEventListener("click", newGame);
document.getElementById("my-cities").addEventListener("click", onCityClick);
document.getElementById("add-city").addEventListener("click", addCity);
document.getElementById("gatehouse-list").addEventListener("click", onGatehouseClick);

pages.addEventListener("scroll", () => requestAnimationFrame(syncPageFromScroll), {
  passive: true,
});
window.addEventListener("resize", () => goToPage(currentPage, false));

// ---------- State ----------

function defaultState() {
  const capital = newCity(CAPITAL_NAME);
  return {
    tribe: DEFAULT_TRIBE,
    researched: [],
    stars: 0,
    perGo: cityPerGo(capital, 0),
    superHp: SUPER_UNIT_MAX_HP,
    go: 1,
    page: 0,
    // The first city is always the capital. cityCount numbers the cities you add.
    cities: [capital],
    cityCount: 1,
    gatehouses: [],
  };
}

function loadState() {
  try {
    const saved = { ...defaultState(), ...JSON.parse(localStorage.getItem(STORE_KEY)) };
    // Drop research saved under a skill that has since been renamed or removed.
    saved.researched = saved.researched.filter((key) => key in NODES);
    return saved;
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or storage blocked: the app still works, it just won't remember.
  }
}

function isResearched(key) {
  return state.researched.includes(key);
}

function tribe() {
  return TRIBES.find((t) => t.key === state.tribe) || TRIBES[0];
}

// ---------- Screens and pages ----------

function showApp() {
  splash.hidden = true;
  document.querySelector(".splash-version").hidden = true;
  app.hidden = false;
  goToPage(currentPage, false);
}

function showSplash() {
  app.hidden = true;
  splash.hidden = false;
  document.querySelector(".splash-version").hidden = false;
}

function renderTabs() {
  const nav = document.getElementById("tabs");
  nav.innerHTML = TABS.map(
    (t, i) =>
      `<button type="button" class="tab" data-page="${i}">` +
      `<span class="tab-icon" aria-hidden="true">${t.icon}</span>` +
      `<span class="tab-label">${t.label}</span></button>`
  ).join("");
  nav.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (tab) goToPage(Number(tab.dataset.page));
  });
  setCurrentPage(currentPage);
}

function goToPage(index, smooth = true) {
  pages.scrollTo({ left: index * pages.clientWidth, behavior: smooth ? "smooth" : "auto" });
  setCurrentPage(index);
}

function syncPageFromScroll() {
  if (!pages.clientWidth) return;
  const index = Math.round(pages.scrollLeft / pages.clientWidth);
  if (index !== currentPage) setCurrentPage(index);
}

function setCurrentPage(index) {
  currentPage = index;
  document.querySelectorAll(".tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
    if (i === index) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  document.getElementById("page-title").textContent = pageEls[index].dataset.title;
  state.page = index;
  saveState();
}

// ---------- Home: tribe colour and new game ----------

function applyTribe() {
  document.documentElement.style.setProperty("--tribe", tribe().colour);
  document.documentElement.style.setProperty("--tribe-ink", tribe().ink);
}

function renderTribes() {
  const box = document.getElementById("tribes");
  box.innerHTML = TRIBES.map(
    (t) =>
      `<button type="button" class="tribe${t.key === state.tribe ? " chosen" : ""}" ` +
      `data-tribe="${t.key}" style="--swatch: ${t.colour}" ` +
      `aria-pressed="${t.key === state.tribe}">` +
      `<span class="swatch" aria-hidden="true"></span>${t.name}</button>`
  ).join("");
  box.onclick = (e) => {
    const btn = e.target.closest(".tribe");
    if (!btn) return;
    state.tribe = btn.dataset.tribe;
    saveState();
    applyTribe();
    renderTribes();
  };
}

function newGame() {
  if (!confirm("Start a new game? This clears your research and resets the tracker.")) {
    return;
  }
  const keep = { tribe: state.tribe, page: state.page };
  Object.assign(state, defaultState(), keep);
  saveState();
  bannerStars = state.stars;
  renderTree();
  renderStars();
  toast("New game started");
}

// ---------- Research tree ----------

function polar(radius, degrees) {
  const r = (degrees * Math.PI) / 180;
  return { x: Math.round(radius * Math.cos(r)), y: Math.round(radius * Math.sin(r)) };
}

function renderTree() {
  const svg = document.getElementById("tree");
  const lines = [];
  const nodes = [];

  RESEARCH.forEach((branch, b) => {
    const angle = FIRST_BRANCH_ANGLE + b * BRANCH_STEP;
    const inner = polar(INNER_RADIUS, angle);
    const open = isResearched(branch.key);
    lines.push(line({ x: 0, y: 0 }, inner, open));
    branch.children.forEach((child, c) => {
      const outer = polar(OUTER_RADIUS, angle + (c - 1) * CHILD_SPREAD);
      lines.push(line(inner, outer, open && isResearched(child.key)));
      nodes.push(treeNode(child, outer, outer.y < 0));
    });
    nodes.push(treeNode(branch, inner, false));
  });

  const done = state.researched.length;
  const innerLabel = polar(INNER_RADIUS, COST_LABEL_ANGLE);
  const outerLabel = polar(OUTER_COST_RADIUS, COST_LABEL_ANGLE);
  svg.innerHTML =
    `<circle class="guide" r="${INNER_RADIUS}" />` +
    `<circle class="guide" r="${OUTER_RADIUS}" />` +
    `<text class="cost-label" x="${innerLabel.x}" y="${innerLabel.y}">${INNER_COST} ★</text>` +
    `<text class="cost-label" x="${outerLabel.x}" y="${outerLabel.y}">${OUTER_COST} ★</text>` +
    lines.join("") +
    `<circle class="centre" r="${CENTRE_RADIUS}" />` +
    `<text class="centre-count" y="5">${done}/${NODE_COUNT}</text>` +
    nodes.join("");

  svg.onclick = (e) => {
    const node = e.target.closest(".node");
    if (node) toggleResearch(node.dataset.key);
  };
  svg.onkeydown = (e) => {
    const node = e.target.closest(".node");
    if (node && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleResearch(node.dataset.key);
    }
  };

  const spent = state.researched.reduce((sum, key) => sum + NODES[key].cost, 0);
  document.getElementById("research-summary").innerHTML =
    `Researched <b>${done}</b> of ${NODE_COUNT} &middot; <b>${spent} ★</b> spent`;
}

function line(from, to, open) {
  return (
    `<line class="link${open ? " open" : ""}" x1="${from.x}" y1="${from.y}" ` +
    `x2="${to.x}" y2="${to.y}" />`
  );
}

// Outer skills in the top half put their name above the circle, clear of the inner ring.
function treeNode(skill, at, labelAbove) {
  const node = NODES[skill.key];
  const done = isResearched(skill.key);
  const locked = !done && node.parent && !isResearched(node.parent);
  const status = done ? "done" : locked ? "locked" : "open";
  const labelY = labelAbove ? -(NODE_RADIUS + LABEL_GAP_ABOVE) : NODE_RADIUS + LABEL_OFFSET;
  const label = `${skill.name}, ${node.cost} stars, ` +
    (done ? "researched" : locked ? `needs ${NODES[node.parent].name}` : "available");
  return (
    `<g class="node ${status}" data-key="${skill.key}" transform="translate(${at.x} ${at.y})" ` +
    `role="button" tabindex="0" aria-label="${label}">` +
    `<circle class="ring" r="${NODE_RADIUS + RING_GAP}" />` +
    `<circle class="disc" r="${NODE_RADIUS}" />` +
    `<text class="glyph" y="${GLYPH_BASELINE}">${skill.icon}</text>` +
    `<text class="label" y="${labelY}">${skill.name}</text></g>`
  );
}

function toggleResearch(key) {
  const node = NODES[key];
  if (isResearched(key)) {
    const children = (node.children || []).filter((c) => isResearched(c.key));
    const also = children.length
      ? ` This also undoes ${children.map((c) => c.name).join(", ")}.`
      : "";
    const refund = node.cost + children.length * OUTER_COST;
    if (!confirm(`Undo ${node.name}?${also} You get ${refund} ★ back.`)) return;
    const drop = [key, ...children.map((c) => c.key)];
    state.researched = state.researched.filter((k) => !drop.includes(k));
    state.stars += refund;
  } else if (node.parent && !isResearched(node.parent)) {
    toast(`Research ${NODES[node.parent].name} first`);
    return;
  } else {
    if (!spend(node.cost, node.name)) return;
    state.researched.push(key);
    toast(`${node.name} researched: −${node.cost} ★`);
  }
  saveState();
  renderTree();
  renderStars();
}

// ---------- Buildings and units ----------

// Research chip for a card: unlocked, or what is still needed.
function unlockChip(research, fallback) {
  if (!research) return `<span class="chip">${fallback}</span>`;
  if (isResearched(research)) return `<span class="chip unlocked">✓ Unlocked</span>`;
  return `<span class="chip">🔒 Research ${NODES[research].name}</span>`;
}

function isLocked(research) {
  return research !== null && !isResearched(research);
}

// Build / Train button for an unlocked card, dimmed when you can't afford it yet.
function buyButton(item, index, verb) {
  if (isLocked(item.research) || item.cost === null) return "";
  const short = state.stars < item.cost ? " short" : "";
  return (
    `<button type="button" class="buy${short}" data-buy="${index}">` +
    `${verb} &middot; ${item.cost} ★</button>`
  );
}

function buyFrom(e, items, done) {
  const btn = e.target.closest(".buy");
  if (!btn) return;
  buy(items[Number(btn.dataset.buy)], done);
}

// Pays for a building or unit, with Undo. A gatehouse also joins your list on the Cities
// page, so its level can be tracked.
function buy(item, done) {
  if (!spend(item.cost, item.name)) return;
  const isGatehouse = item === GATEHOUSE;
  if (isGatehouse) state.gatehouses.push({ level: START_CITY_LEVEL });
  saveState();
  renderStars();
  toast(`${done} ${item.name}: −${item.cost} ★`, "Undo", () => {
    state.stars += item.cost;
    if (isGatehouse) state.gatehouses.pop();
    saveState();
    renderStars();
    toast(`${item.name} undone: +${item.cost} ★`);
  });
}

function renderBuildings() {
  document.getElementById("building-list").innerHTML = BUILDINGS.map(
    (b, i) =>
      `<article class="card${isLocked(b.research) ? " locked" : ""}">` +
      `<div class="art" aria-hidden="true">${b.icon}</div>` +
      `<div class="info"><h3>${b.name}</h3>${unlockChip(b.research)}` +
      `<dl class="stats building-stats">` +
      `<div class="stat"><dt>Cost</dt><dd>${b.cost === null ? "?" : `${b.cost} ★`}</dd></div>` +
      `<div class="stat wide"><dt>Terrain</dt><dd>${b.terrain}</dd></div>` +
      `<div class="stat full"><dt>Population</dt><dd>${b.pop}</dd></div>` +
      `</dl>${b.note ? `<p class="ability">${b.note}</p>` : ""}` +
      `${buyButton(b, i, "Build")}</div></article>`
  ).join("");
}

function renderUnits() {
  document.getElementById("unit-list").innerHTML = UNITS.map((u, i) => {
    const stats = UNIT_STATS.map(
      (s) => `<div class="stat"><dt>${s.label}</dt><dd>${statText(u[s.key])}</dd></div>`
    ).join("");
    const tag = u.tag ? `<span class="chip tag">${u.tag}</span>` : "";
    const ability = u.ability ? `<p class="ability">${u.ability}</p>` : "";
    return (
      `<article class="card${isLocked(u.research) ? " locked" : ""}">` +
      `<div class="art" aria-hidden="true">${u.icon}</div>` +
      `<div class="info"><h3>${u.name}</h3>${unlockChip(u.research, u.unlock)}${tag}` +
      `<dl class="stats">${stats}</dl>${ability}${buyButton(u, i, "Train")}</div></article>`
    );
  }).join("");
}

function renderCombatRules() {
  document.getElementById("combat-rules").innerHTML =
    COMBAT_RULES.map((rule) => `<li>${rule}</li>`).join("");
}

// A cost of null (the Super Unit) shows as a dash, as on the cardboard.
function statText(value) {
  return value === null ? "-" : value;
}

// ---------- Ruins ----------

function renderRuins() {
  showDie(DIE_FACES);
  document.getElementById("ruin-table").innerHTML = RUIN_OUTCOMES.map(
    (o) =>
      `<div class="ruin-row" data-kind="${o.kind}">` +
      `<span class="ruin-rolls">${o.rolls.join(" or ")}</span>` +
      `<span class="ruin-icon" aria-hidden="true">${o.icon}</span>` +
      `<span><b>${o.title}</b><br /><span class="muted">${o.text}</span></span></div>`
  ).join("");
  document.getElementById("die").addEventListener("click", rollDie);
  document.getElementById("roll").addEventListener("click", rollDie);
}

function showDie(face) {
  const filled = PIP_SPOTS[face - 1];
  const die = document.getElementById("die");
  die.innerHTML = Array.from(
    { length: DIE_SPOTS },
    (_, i) => `<span class="pip${filled.includes(i) ? " on" : ""}"></span>`
  ).join("");
  die.dataset.face = face;
}

function randomFace() {
  return Math.floor(Math.random() * DIE_FACES) + 1;
}

function rollDie() {
  if (rolling) return;
  rolling = true;
  const die = document.getElementById("die");
  const result = document.getElementById("ruin-result");
  result.innerHTML = "";
  document.querySelectorAll(".ruin-row").forEach((row) => row.classList.remove("hit"));
  die.classList.add("rolling");

  let frame = 0;
  const timer = setInterval(() => {
    showDie(randomFace());
    frame += 1;
    if (frame < ROLL_FRAMES) return;
    clearInterval(timer);
    const face = randomFace();
    showDie(face);
    die.classList.remove("rolling");
    showRuinResult(face);
    rolling = false;
  }, ROLL_FRAME_MS);
}

function showRuinResult(face) {
  const outcome = RUIN_OUTCOMES.find((o) => o.rolls.includes(face));
  document.querySelector(`.ruin-row[data-kind="${outcome.kind}"]`).classList.add("hit");

  let body = "";
  if (outcome.kind === "unit") {
    body = pickList(UNITS.filter((u) => u.cost !== null && u.cost <= RUIN_MAX_UNIT_COST));
  } else if (outcome.kind === "building") {
    body = pickList(BUILDINGS.filter((b) => b.cost !== null && b.cost <= RUIN_MAX_BUILDING_COST));
  } else {
    body = `<button type="button" id="claim-stars" class="btn">` +
      `Add ${RUIN_STARS} ★ to my stars</button>`;
  }

  const result = document.getElementById("ruin-result");
  result.innerHTML =
    `<p class="ruin-rolled">You rolled <b>${face}</b>: ` +
    `<span class="ruin-icon" aria-hidden="true">${outcome.icon}</span> ` +
    `<b>${outcome.title}</b></p>${body}`;

  const claim = document.getElementById("claim-stars");
  if (claim) {
    claim.addEventListener("click", () => {
      state.stars += RUIN_STARS;
      saveState();
      renderStars();
      claim.disabled = true;
      claim.textContent = `Added - you now have ${state.stars} ★`;
    });
  }
}

// The units or buildings a ruin roll lets you choose from.
function pickList(items) {
  return (
    `<p class="muted">Choose one:</p><div class="pick-list">` +
    items.map(
      (item) =>
        `<span class="pick"><span aria-hidden="true">${item.icon}</span> ${item.name} ` +
        `<small>${item.cost} ★</small></span>`
    ).join("") +
    `</div>`
  );
}

// ---------- Tracker ----------

function renderTracker() {
  const box = document.getElementById("tracker");
  const hpPct = (state.superHp / SUPER_UNIT_MAX_HP) * 100;
  box.innerHTML =
    `<section class="counter">` +
    `<h2>Stars I own</h2>${counterRow("stars", state.stars, "★")}` +
    `<div class="spend"><span class="muted">Spend</span>` +
    SPEND_STEPS.map(
      (n) => `<button type="button" class="chip-btn" data-field="stars" data-step="-${n}">` +
        `−${n}</button>`
    ).join("") +
    `</div></section>` +
    `<section class="counter"><h2>Stars per go</h2>${counterRow("perGo", state.perGo, "★")}` +
    `</section>` +
    `<button type="button" class="btn big" data-action="next-go">` +
    `End go ${state.go}: collect +${state.perGo} ★</button>` +
    `<section class="counter"><h2>Super unit health</h2>` +
    counterRow("superHp", state.superHp, `/ ${SUPER_UNIT_MAX_HP}`) +
    `<div class="hp-bar"><div class="hp-fill" style="width: ${hpPct}%"></div></div>` +
    `<button type="button" class="btn small" data-action="heal">` +
    `Full health (${SUPER_UNIT_MAX_HP})</button></section>`;

  box.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.field) {
      changeCounter(btn.dataset.field, Number(btn.dataset.step));
    } else if (btn.dataset.action === "next-go") {
      state.stars += state.perGo;
      state.go += 1;
      toast(`+${state.perGo} ★ - now ${state.stars} ★`);
    } else if (btn.dataset.action === "heal") {
      state.superHp = SUPER_UNIT_MAX_HP;
    }
    saveState();
    renderStars();
  };
}

function counterRow(field, value, unit) {
  return (
    `<div class="count-row">` +
    `<button type="button" class="step" data-field="${field}" data-step="-1" ` +
    `aria-label="Minus one">−</button>` +
    `<output class="count">${value}<small>${unit}</small></output>` +
    `<button type="button" class="step" data-field="${field}" data-step="1" ` +
    `aria-label="Plus one">+</button></div>`
  );
}

function changeCounter(field, step) {
  const max = field === "superHp" ? SUPER_UNIT_MAX_HP : Infinity;
  const next = state[field] + step;
  if (next < 0) {
    if (field === "stars") toast(`Not enough stars - you have ${state.stars} ★`);
    return;
  }
  state[field] = Math.min(next, max);
}

// Takes the cost off your stars. If you can't afford it, says so and returns false.
function spend(cost, what) {
  if (state.stars < cost) {
    toast(`${what} costs ${cost} ★ - you have ${state.stars} ★`);
    return false;
  }
  state.stars -= cost;
  return true;
}

// The stars banner under the header, on every page. A change floats up as +n / −n.
function renderBanner() {
  const delta = state.stars - bannerStars;
  bannerStars = state.stars;
  document.getElementById("star-banner").innerHTML =
    `<span class="ribbon${delta ? " pop" : ""}">` +
    `<span class="banner-count">★ ${state.stars}</span>` +
    `<span class="banner-word">${state.stars === 1 ? "star" : "stars"}</span>` +
    `<span class="banner-rate">+${state.perGo} per go</span></span>` +
    (delta
      ? `<span class="banner-delta ${delta > 0 ? "up" : "down"}">` +
        `${delta > 0 ? "+" : "−"}${Math.abs(delta)}</span>`
      : "");
}

// Everything that shows your stars: tracker, banner and the Build / Train buttons.
function renderStars() {
  renderTracker();
  renderBanner();
  renderBuildings();
  renderUnits();
  renderCities();
}

// ---------- City levels ----------

// picks[i] = which reward the city chose on reaching level i + 2 (null = not chosen yet);
// adjacent = store houses, markets and quarries next to its Mega mill.
function newCity(name) {
  return { name, level: START_CITY_LEVEL, picks: [], adjacent: 0 };
}

// The row of rewards a city chooses from on reaching this level. The last row repeats.
function tierFor(level) {
  return CITY_LEVELS[Math.min(level - FIRST_REWARD_LEVEL, CITY_LEVELS.length - 1)];
}

function pickedRewards(city) {
  const rewards = [];
  for (let i = 0; i < city.picks.length; i++) {
    const pick = city.picks[i] ?? null;
    if (pick !== null) rewards.push(tierFor(i + FIRST_REWARD_LEVEL).choices[pick]);
  }
  return rewards;
}

// Stars per go from one city: its level, the capital's extra and any rewards that add some.
function cityPerGo(city, index) {
  let total = city.level * CITY_LEVEL_STARS + (index === 0 ? CAPITAL_EXTRA_STARS : 0);
  pickedRewards(city).forEach((c) => {
    total += (c.perGo || 0) + (c.perAdjacent || 0) * city.adjacent;
  });
  return total;
}

// Stars a city's rewards gave you once (Resources).
function cityStars(city) {
  return pickedRewards(city).reduce((sum, c) => sum + (c.stars || 0), 0);
}

function signed(n) {
  return n > 0 ? `+${n}` : `−${-n}`;
}

// Changes a city, then moves your stars per go and stars by however much that changed.
function changeCity(index, change) {
  const city = state.cities[index];
  const perGo = cityPerGo(city, index);
  const stars = cityStars(city);
  change(city);
  const perGoDelta = cityPerGo(city, index) - perGo;
  const starsDelta = cityStars(city) - stars;
  state.perGo = Math.max(0, state.perGo + perGoDelta);
  state.stars = Math.max(0, state.stars + starsDelta);
  saveState();
  renderStars();
  const parts = [];
  if (perGoDelta) parts.push(`${signed(perGoDelta)} ★ per go`);
  if (starsDelta) parts.push(`${signed(starsDelta)} ★`);
  if (parts.length) toast(`${city.name}: ${parts.join(", ")}`);
}

function addCity() {
  state.cityCount += 1;
  const city = newCity(`City ${state.cityCount}`);
  state.cities.push(city);
  const perGo = cityPerGo(city, state.cities.length - 1);
  state.perGo += perGo;
  saveState();
  renderStars();
  toast(`${city.name} added: +${perGo} ★ per go`);
}

function onCityClick(e) {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const index = Number(btn.closest(".city").dataset.city);
  const city = state.cities[index];
  const act = btn.dataset.act;
  if (act === "up") {
    changeCity(index, (c) => (c.level += 1));
  } else if (act === "down") {
    // Dropping a level also drops the reward chosen for it.
    changeCity(index, (c) => {
      c.level -= 1;
      c.picks = c.picks.slice(0, c.level - START_CITY_LEVEL);
    });
  } else if (act === "pick") {
    const slot = Number(btn.dataset.level) - FIRST_REWARD_LEVEL;
    const choice = Number(btn.dataset.choice);
    changeCity(index, (c) => (c.picks[slot] = c.picks[slot] === choice ? null : choice));
  } else if (act === "adjacent") {
    changeCity(index, (c) => (c.adjacent = Math.max(0, c.adjacent + Number(btn.dataset.step))));
  } else if (act === "rename") {
    const name = prompt("City name", city.name);
    if (!name || !name.trim()) return;
    city.name = name.trim();
    saveState();
    renderCities();
  } else if (act === "remove") {
    const perGo = cityPerGo(city, index);
    if (!confirm(`Remove ${city.name}? Your stars per go goes down by ${perGo}.`)) return;
    state.cities.splice(index, 1);
    state.perGo = Math.max(0, state.perGo - perGo);
    saveState();
    renderStars();
    toast(`${city.name} removed: −${perGo} ★ per go`);
  }
}

function onGatehouseClick(e) {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  if (btn.dataset.act === "build") {
    buy(GATEHOUSE, "Built");
    return;
  }
  const index = Number(btn.closest(".gatehouse").dataset.gate);
  if (btn.dataset.act === "up") {
    state.gatehouses[index].level = GATEHOUSE_MAX_LEVEL;
  } else if (btn.dataset.act === "down") {
    state.gatehouses[index].level = START_CITY_LEVEL;
  } else if (btn.dataset.act === "remove") {
    if (!confirm(`Remove gatehouse ${index + 1}?`)) return;
    state.gatehouses.splice(index, 1);
  }
  saveState();
  renderCities();
}

function cityCard(city, index) {
  const next = tierFor(city.level + 1);
  const rows = [];
  for (let level = FIRST_REWARD_LEVEL; level <= city.level; level++) {
    rows.push(rewardRow(city, level));
  }
  const remove = index === 0
    ? ""
    : `<button type="button" class="chip-btn remove" data-act="remove">Remove city</button>`;
  return (
    `<article class="level city" data-city="${index}"><header class="level-head">` +
    `<button type="button" class="city-name" data-act="rename" ` +
    `aria-label="Rename ${city.name}">${index === 0 ? "👑 " : ""}${city.name} ` +
    `<span aria-hidden="true">✎</span></button>` +
    `<span class="pop-need">+${cityPerGo(city, index)} ★ per go</span></header>` +
    `<div class="city-body"><div class="city-level-row">` +
    `<button type="button" class="step small" data-act="down" aria-label="Level down"` +
    `${city.level <= START_CITY_LEVEL ? " disabled" : ""}>−</button>` +
    `<span class="city-level">Level <b>${city.level}</b></span>` +
    `<button type="button" class="btn level-up" data-act="up">` +
    `Level up &middot; 👪 ${next.pop} pop</button></div>` +
    `${rows.join("")}${remove}</div></article>`
  );
}

// The rewards for one level a city has reached; the chosen one is highlighted.
function rewardRow(city, level) {
  const tier = tierFor(level);
  const picked = city.picks[level - FIRST_REWARD_LEVEL] ?? null;
  const buttons = tier.choices.map(
    (c, i) =>
      `<button type="button" class="reward${picked === i ? " chosen" : ""}" data-act="pick" ` +
      `data-level="${level}" data-choice="${i}" aria-pressed="${picked === i}">` +
      `<span class="choice-icon" aria-hidden="true">${c.icon}</span><b>${c.name}</b>` +
      `<span class="reward-text">${c.text}</span></button>`
  ).join("");
  const choice = picked === null ? null : tier.choices[picked];
  const hint = picked === null ? ` <span class="muted">- tap your reward</span>` : "";
  return (
    `<div class="reward-row"><div class="reward-level">Level ${level}${hint}</div>` +
    `<div class="reward-choices">${buttons}</div>` +
    `${choice && choice.perAdjacent ? millRow(city, choice) : ""}</div>`
  );
}

// Mega mill: count the adjacent store houses, markets and quarries.
function millRow(city, choice) {
  return (
    `<div class="mill-row"><span>Adjacent store houses, markets and quarries</span>` +
    `<div class="mill-count"><button type="button" class="step small" data-act="adjacent" ` +
    `data-step="-1" aria-label="One fewer">−</button>` +
    `<output class="mill-stars">${city.adjacent} ` +
    `<small>= +${city.adjacent * choice.perAdjacent} ★ per go</small></output>` +
    `<button type="button" class="step small" data-act="adjacent" data-step="1" ` +
    `aria-label="One more">+</button></div></div>`
  );
}

function renderGatehouses() {
  const rows = state.gatehouses.map((g, i) => {
    const upgraded = g.level >= GATEHOUSE_MAX_LEVEL;
    const toggle = upgraded
      ? `<button type="button" class="chip-btn" data-act="down">Level down</button>`
      : `<button type="button" class="chip-btn" data-act="up">` +
        `Level up &middot; 👪 ${GATEHOUSE_UPGRADE.pop}</button>`;
    return (
      `<div class="gatehouse${upgraded ? " upgraded" : ""}" data-gate="${i}">` +
      `<span class="choice-icon" aria-hidden="true">${GATEHOUSE.icon}</span>` +
      `<span class="gate-text"><b>Gatehouse ${i + 1}</b> &middot; level ${g.level}<br />` +
      `<span class="muted">${upgraded ? "Units can be trained here" : "Blocks enemy units"}` +
      `</span></span>${toggle}` +
      `<button type="button" class="chip-btn" data-act="remove" ` +
      `aria-label="Remove gatehouse ${i + 1}">✕</button></div>`
    );
  });
  const build = isResearched(GATEHOUSE.research)
    ? `<button type="button" class="buy${state.stars < GATEHOUSE.cost ? " short" : ""}" ` +
      `data-act="build">Build a gatehouse &middot; ${GATEHOUSE.cost} ★</button>`
    : `<p class="muted">🔒 Research Gatehouse to build one.</p>`;
  document.getElementById("gatehouse-list").innerHTML =
    rows.join("") + `<p class="muted gate-rule">${GATEHOUSE.terrain}. ${GATEHOUSE.note}</p>` +
    build;
}

function renderCities() {
  document.getElementById("city-stars-rule").textContent = STARS_PER_GO_RULE;
  document.getElementById("my-cities").innerHTML = state.cities.map(cityCard).join("");
  renderGatehouses();
  const reference = [...CITY_LEVELS, GATEHOUSE_UPGRADE];
  document.getElementById("city-list").innerHTML = reference.map((level) => {
    const choices = level.choices.map(
      (c) =>
        `<div class="choice"><span class="choice-icon" aria-hidden="true">${c.icon}</span>` +
        `<b>${c.name}</b><span class="muted">${c.text}</span></div>`
    ).join(`<div class="or">or</div>`);
    return (
      `<article class="level"><header class="level-head">` +
      `<span>${level.from} <span class="arrow">→</span> ${level.to}</span>` +
      `<span class="pop-need">👪 ${level.pop} pop</span></header>` +
      `<div class="choices">${choices}</div></article>`
    );
  }).join("");
}

// ---------- Toast, version badge and changelog ----------

// Short message above the tab bar, with an optional button such as Undo.
function toast(text, actionLabel = "", onAction = null) {
  const el = document.getElementById("toast");
  el.textContent = text;
  if (onAction) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toast-action";
    btn.textContent = actionLabel;
    btn.addEventListener("click", () => {
      el.hidden = true;
      onAction();
    });
    el.appendChild(btn);
  }
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), onAction ? TOAST_ACTION_MS : TOAST_MS);
}

// Version badge: shows the current version; click to see the changelog.
function renderVersionBadge(parent, className) {
  const badge = document.createElement("button");
  badge.className = className;
  badge.textContent = VERSION;
  badge.title = "Changelog";
  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    showChangelog();
  });
  parent.appendChild(badge);
}

function showChangelog() {
  const overlay = document.createElement("div");
  overlay.className = "changelog-overlay";
  overlay.addEventListener("click", () => overlay.remove());

  const panel = document.createElement("div");
  panel.className = "changelog";
  panel.addEventListener("click", (e) => e.stopPropagation());
  panel.innerHTML =
    "<h2>Changelog</h2>" +
    CHANGELOG.map(
      (e) =>
        `<section><h3>${e.version} <span class="muted">${e.date}</span></h3>` +
        `<ul>${e.notes.map((n) => `<li>${n}</li>`).join("")}</ul></section>`
    ).join("");
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}
