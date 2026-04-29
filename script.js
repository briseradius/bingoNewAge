const DEFAULT_ITEMS = [
  "LOI DE L’ATTRACTION","ÉVEIL SPIRITUEL","3ÈME ŒIL OUVERT","ÂMES SŒURS KARMIQUES",
  "FLAMMES JUMELLES","VIBRATIONS ÉLEVÉES","ÉNERGIES NÉGATIVES","GUÉRISON QUANTIQUE",
  "ENFANTS INDIGO","LA 5G NOCIVE","REIKI UNIVERSEL",
  "ALIGNEMENT DES CHAKRAS","GUIDES SPIRITUELS","SYNCHRONICITÉS",
  "ASCENSION","FRÉQUENCES VIBRATOIRES","LITHOTHÉRAPIE","PURIFICATION ÉNERGÉTIQUE",
  "CANALISATION D’ENTITÉS","VOYAGE ASTRAL","HOROSCOPE KARMIQUE",
  "MERCURE RÉTROGRADE","TRANSMUTATION ÉNERGÉTIQUE","L’EAU CE LIQUIDE MAGIQUE",
  "ÉNERGIE COSMIQUE","PORTAILS ÉNERGÉTIQUES","GUÉRISSEURS INTUITIFS","AURA",
  "MISSION D’ÂME","CONSCIENCE UNIVERSELLE"
];

const selectSound = new Audio("sounds/biensur.ogg");
const unselectSound = new Audio("sounds/unselect.mp3");

selectSound.volume = 0.7;
unselectSound.volume = 0.7;

let currentSoundboard = null;

const STORAGE_KEY = "bingo-complotisme-v1";
const state = { items: [], selected: new Set() };

const shuffle = (arr) => {
  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

function save() {
  const payload = {
    items: state.items,
    selected: Array.from(state.selected)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);

    if (!Array.isArray(data.items) || data.items.length !== 25) {
      return false;
    }

    state.items = data.items;
    state.selected = new Set(data.selected || []);

    return true;
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  state.items.forEach((label, idx) => {
    const tile = document.createElement("button");

    tile.className = "tile" + (state.selected.has(idx) ? " selected" : "");
    tile.setAttribute("role", "gridcell");
    tile.setAttribute("aria-pressed", state.selected.has(idx) ? "true" : "false");
    tile.title = "Cliquer pour cocher/décocher";
    tile.textContent = label;

    tile.addEventListener("click", () => toggle(idx, tile));

    board.appendChild(tile);
  });
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function toggle(idx, el) {
  if (state.selected.has(idx)) {
    playSound(unselectSound);
    state.selected.delete(idx);
  } else {
    playSound(selectSound);
    state.selected.add(idx);
  }

  el.classList.toggle("selected");
  el.setAttribute(
    "aria-pressed",
    el.classList.contains("selected") ? "true" : "false"
  );

  save();
}

function playSoundboard() {
  const select = document.getElementById("soundboardSelect");
  const src = select.value;

  if (!src) return;

  if (currentSoundboard) {
    currentSoundboard.pause();
    currentSoundboard.currentTime = 0;
  }

  currentSoundboard = new Audio(src);
  currentSoundboard.volume = 0.5;
  currentSoundboard.play().catch(() => {});
}

function reset() {
  state.selected.clear();
  save();
  render();
}

function shuffleBoard() {
  const base = DEFAULT_ITEMS.slice();

  while (base.length < 25) {
    base.push("Case vide");
  }

  state.items = shuffle(base).slice(0, 25);
  state.selected.clear();

  save();
  render();
}

(function init() {
  const ok = load();

  if (!ok) {
    shuffleBoard();
  } else {
    render();
  }

  document.getElementById("reset").addEventListener("click", reset);
  document.getElementById("shuffle").addEventListener("click", shuffleBoard);
  document.getElementById("playSoundboard").addEventListener("click", playSoundboard);
})();