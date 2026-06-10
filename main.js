// main.js
//
// UI controller for DartKeep v2.
// Connects the HTML UI to the game engine and storage/Elo modules.

// ------------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------------
const homeScreen = document.getElementById("homeScreen");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");

const gameButtonsContainer = document.getElementById("gameButtons");
const setupGameName = document.getElementById("setupGameName");
const playerNameInput = document.getElementById("playerNameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersListEl = document.getElementById("playersList");
const startGameBtn = document.getElementById("startGameBtn");

const gameTitle = document.getElementById("gameTitle");
const roundInfo = document.getElementById("roundInfo");
const scoreboardEl = document.getElementById("scoreboard");
const currentPlayerLabel = document.getElementById("currentPlayerLabel");

const dartboardNumbers = document.getElementById("dartboardNumbers");
const undoBtn = document.getElementById("undoBtn");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");
const winnerBanner = document.getElementById("winnerBanner");

const leaderboardTable = document.querySelector("#leaderboardTable tbody");
const gamesTable = document.querySelector("#gamesTable tbody");


// ------------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------------
document.getElementById("homeBtn").onclick = () => showScreen("home");
document.getElementById("leaderboardBtn").onclick = () => showScreen("leaderboard");
document.getElementById("openLeaderboardFromHome").onclick = () => showScreen("leaderboard");

function showScreen(which) {
  homeScreen.classList.add("hidden");
  setupScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  leaderboardScreen.classList.add("hidden");

  if (which === "home") homeScreen.classList.remove("hidden");
  if (which === "setup") setupScreen.classList.remove("hidden");
  if (which === "game") gameScreen.classList.remove("hidden");
  if (which === "leaderboard") {
    leaderboardScreen.classList.remove("hidden");
    renderLeaderboard();
    renderRecentGames();
  }
}


// ------------------------------------------------------------
// HOME SCREEN — BUILD GAME BUTTONS
// ------------------------------------------------------------
function buildHomeButtons() {
  gameButtonsContainer.innerHTML = "";

  getAllGames().forEach(game => {
    const btn = document.createElement("button");
    btn.textContent = game.name;
    btn.style.display = "block";
    btn.style.marginBottom = "8px";
    btn.onclick = () => startSetup(game.id);
    gameButtonsContainer.appendChild(btn);
  });
}

buildHomeButtons();


// ------------------------------------------------------------
// SETUP SCREEN
// ------------------------------------------------------------
let setupPlayers = [];
let selectedGameDef = null;

function startSetup(gameId) {
  selectedGameDef = DartGames[gameId];
  setupGameName.textContent = selectedGameDef.name;
  setupPlayers = [];
  playersListEl.innerHTML = "";
  playerNameInput.value = "";
  showScreen("setup");
}

addPlayerBtn.onclick = () => {
  const name = playerNameInput.value.trim();
  if (!name) return;
  if (!setupPlayers.includes(name)) {
    setupPlayers.push(name);
    renderSetupPlayers();
  }
  playerNameInput.value = "";
  playerNameInput.focus();
};

function renderSetupPlayers() {
  playersListEl.innerHTML = "";
  setupPlayers.forEach(name => {
    const span = document.createElement("span");
    span.textContent = name;
    playersListEl.appendChild(span);
  });
}

startGameBtn.onclick = () => {
  if (setupPlayers.length === 0) {
    alert("Add at least one player.");
    return;
  }
  beginGame();
};


// ------------------------------------------------------------
// GAME SCREEN
// ------------------------------------------------------------
let state = null;

function beginGame() {
  state = createGameState(selectedGameDef, setupPlayers);

  gameTitle.textContent = selectedGameDef.name;
  winnerBanner.classList.add("hidden");

  buildScoreboard();
  updateScoreboard();
  updateRoundInfo();
  updateCurrentPlayerLabel();
  buildDartboard();

  showScreen("game");
}


// ------------------------------------------------------------
// SCOREBOARD RENDERING
// ------------------------------------------------------------
function buildScoreboard() {
  scoreboardEl.innerHTML = "";

  const game = selectedGameDef;

  // Header row
  const header = document.createElement("div");
  header.className = "scoreboard scoreboard-header";

  const nameCell = document.createElement("div");
  nameCell.className = "scoreboard-cell";
  nameCell.textContent = "Player";
  header.appendChild(nameCell);

  if (game.kind === "rounds") {
    for (let r = 1; r <= game.rounds; r++) {
      const c = document.createElement("div");
      c.className = "scoreboard-cell";
      c.textContent = "R" + r;
      header.appendChild(c);
    }
  } else if (game.kind === "x01") {
    const c = document.createElement("div");
    c.className = "scoreboard-cell";
    c.textContent = "Score";
    header.appendChild(c);
  } else if (game.kind === "cricket") {
    game.targets.forEach(t => {
      const c = document.createElement("div");
      c.className = "scoreboard-cell";
      c.textContent = t;
      header.appendChild(c);
    });
    const total = document.createElement("div");
    total.className = "scoreboard-cell";
    total.textContent = "Pts";
    header.appendChild(total);
  } else if (game.kind === "around") {
    const c = document.createElement("div");
    c.className = "scoreboard-cell";
    c.textContent = "Progress";
    header.appendChild(c);
  }

  scoreboardEl.appendChild(header);

  // Player rows
  state.players.forEach((p, idx) => {
    const row = document.createElement("div");
    row.className = "scoreboard";

    const name = document.createElement("div");
    name.className = "scoreboard-cell scoreboard-player";
    name.dataset.playerIndex = idx;
    row.appendChild(name);

    if (game.kind === "rounds") {
      for (let r = 0; r < game.rounds; r++) {
        const c = document.createElement("div");
        c.className = "scoreboard-cell";
        c.dataset.playerIndex = idx;
        c.dataset.round = r;
        row.appendChild(c);
      }
      const total = document.createElement("div");
      total.className = "scoreboard-cell";
      total.dataset.playerIndex = idx;
      total.dataset.total = "true";
      row.appendChild(total);

    } else if (game.kind === "x01") {
      const c = document.createElement("div");
      c.className = "scoreboard-cell";
      c.dataset.playerIndex = idx;
      c.dataset.x01 = "true";
      row.appendChild(c);

    } else if (game.kind === "cricket") {
      game.targets.forEach(t => {
        const c = document.createElement("div");
        c.className = "scoreboard-cell";
        c.dataset.playerIndex = idx;
        c.dataset.target = t;
        row.appendChild(c);
      });
      const total = document.createElement("div");
      total.className = "scoreboard-cell";
      total.dataset.playerIndex = idx;
      total.dataset.total = "true";
      row.appendChild(total);

    } else if (game.kind === "around") {
      const c = document.createElement("div");
      c.className = "scoreboard-cell";
      c.dataset.playerIndex = idx;
      c.dataset.progress = "true";
      row.appendChild(c);
    }

    scoreboardEl.appendChild(row);
  });
}

function updateScoreboard() {
  const game = selectedGameDef;

  state.players.forEach((p, idx) => {
    const row = scoreboardEl.querySelectorAll(".scoreboard")[idx + 1];
    const cells = row.querySelectorAll(".scoreboard-cell");

    // Name cell
    cells[0].textContent = p.name;
    if (idx === state.currentPlayerIndex && !state.gameOver) {
      cells[0].classList.add("current-player");
    } else {
      cells[0].classList.remove("current-player");
    }

    if (game.kind === "rounds") {
      let total = 0;
      for (let r = 0; r < game.rounds; r++) {
        const score = p.scores[r] || 0;
        cells[r + 1].textContent = score || "";
        total += score;
      }
      cells[cells.length - 1].textContent = total;

    } else if (game.kind === "x01") {
      cells[1].textContent = p.total;

    } else if (game.kind === "cricket") {
      game.targets.forEach((t, i) => {
        const hits = p.cricket[t];
        cells[i + 1].textContent = hits >= 3 ? "X" : hits;
      });
      cells[cells.length - 1].textContent = p.total;

    } else if (game.kind === "around") {
      const needed = game.targets[p.progress] || "DONE";
      cells[1].textContent = needed;
    }
  });
}

function updateRoundInfo() {
  const game = selectedGameDef;

  if (state.gameOver) {
    roundInfo.textContent = "Game complete.";
    return;
  }

  if (game.kind === "rounds") {
    roundInfo.textContent = `Round ${state.currentRound} of ${game.rounds}`;
  } else {
    roundInfo.textContent = "";
  }
}

function updateCurrentPlayerLabel() {
  if (state.gameOver) {
    currentPlayerLabel.textContent = "-";
  } else {
    currentPlayerLabel.textContent = state.players[state.currentPlayerIndex].name;
  }
}


// ------------------------------------------------------------
// DARTBOARD INPUT
// ------------------------------------------------------------
function buildDartboard() {
  dartboardNumbers.innerHTML = "";

  // Numbers 1–20 in a 5×4 grid
  for (let n = 1; n <= 20; n++) {
    const btn = document.createElement("button");
    btn.textContent = n;
    btn.onclick = () => handleHit(n, 1);
    dartboardNumbers.appendChild(btn);
  }

  // Multiplier buttons
  document.querySelectorAll(".multiplier-row button").forEach(btn => {
    btn.onclick = () => {
      const m = parseInt(btn.dataset.m, 10);
      lastMultiplier = m;
    };
  });

  // Bull buttons
  document.querySelectorAll(".bull-row button").forEach(btn => {
    btn.onclick = () => {
      const val = parseInt(btn.dataset.bull, 10);
      handleHit(val, val === 50 ? 2 : 1);
    };
  });

  // Default multiplier
  lastMultiplier = 1;
}

let lastMultiplier = 1;

function handleHit(value, forcedMultiplier = null) {
  const m = forcedMultiplier || lastMultiplier;

  applyDartHit(state, value, m);
  updateScoreboard();

  if (state.gameOver) {
    finalizeGame();
    return;
  }
}


// ------------------------------------------------------------
// TURN FLOW
// ------------------------------------------------------------
nextPlayerBtn.onclick = () => {
  if (state.gameOver) return;
  nextPlayer(state);
  updateScoreboard();
  updateRoundInfo();
  updateCurrentPlayerLabel();
};

undoBtn.onclick = () => {
  undoLast(state);
  updateScoreboard();
  updateRoundInfo();
  updateCurrentPlayerLabel();
};


// ------------------------------------------------------------
// GAME END
// ------------------------------------------------------------
function finalizeGame() {
  updateScoreboard();
  updateRoundInfo();
  updateCurrentPlayerLabel();

  winnerBanner.textContent = `Winner: ${state.winner}`;
  winnerBanner.classList.remove("hidden");

  const gameRecord = {
    id: Date.now(),
    type: selectedGameDef.name,
    players: state.players.map(p => ({
      name: p.name,
      totalScore: p.total
    })),
    winnerName: state.winner,
    createdAt: new Date().toISOString()
  };

  saveGameRecord(gameRecord);
  updateEloForGame(gameRecord);
}


// ------------------------------------------------------------
// LEADERBOARD
// ------------------------------------------------------------
function renderLeaderboard() {
  const data = getLeaderboardData();
  leaderboardTable.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No games played yet.";
    tr.appendChild(td);
    leaderboardTable.appendChild(tr);
    return;
  }

  data.forEach((p, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.rating}</td>
      <td>${p.games}</td>
    `;

    leaderboardTable.appendChild(tr);
  });
}

function renderRecentGames() {
  const games = getRecentGames();
  gamesTable.innerHTML = "";

  if (games.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No games stored yet.";
    tr.appendChild(td);
    gamesTable.appendChild(tr);
    return;
  }

  games.forEach(g => {
    const tr = document.createElement("tr");

    const players = g.players
      .map(p => `${p.name} (${p.totalScore})`)
      .join(", ");

    tr.innerHTML = `
      <td>${g.type}</td>
      <td>${players}</td>
      <td>${g.winnerName}</td>
      <td>${new Date(g.createdAt).toLocaleString()}</td>
    `;

    gamesTable.appendChild(tr);
  });
}


// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
showScreen("home");
