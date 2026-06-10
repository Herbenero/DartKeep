// storage-elo.js
//
// LocalStorage-based database + Elo rating system for DartKeep v2.
// Stores:
//   - Completed games
//   - Player Elo ratings
//
// Exposes:
//   loadGames(), saveGameRecord()
//   loadElo(), updateEloForGame()
//   getLeaderboardData(), getRecentGames()


// ------------------------------------------------------------
// LocalStorage keys
// ------------------------------------------------------------
const DB_KEY = "dartkeep_games_v2";
const ELO_KEY = "dartkeep_elo_v2";


// ------------------------------------------------------------
// GAME STORAGE
// ------------------------------------------------------------
function loadGames() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveGameRecord(gameRecord) {
  const games = loadGames();
  games.push(gameRecord);
  localStorage.setItem(DB_KEY, JSON.stringify(games));
}


// ------------------------------------------------------------
// ELO SYSTEM
// ------------------------------------------------------------
const DEFAULT_ELO = 1200;
const K_FACTOR = 32;

function loadElo() {
  const raw = localStorage.getItem(ELO_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveElo(elo) {
  localStorage.setItem(ELO_KEY, JSON.stringify(elo));
}

function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}


// ------------------------------------------------------------
// Update Elo after a completed game
// gameRecord = {
//   id,
//   type,
//   players: [{ name, totalScore }],
//   winnerName,
//   createdAt
// }
// ------------------------------------------------------------
function updateEloForGame(gameRecord) {
  const elo = loadElo();
  const players = gameRecord.players;

  // Ensure all players have ratings
  players.forEach(p => {
    if (!elo[p.name]) {
      elo[p.name] = { rating: DEFAULT_ELO, games: 0 };
    }
  });

  // Multi-player Elo: treat as round-robin pairwise matches
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const A = players[i];
      const B = players[j];

      const rA = elo[A.name].rating;
      const rB = elo[B.name].rating;

      let SA, SB;

      if (A.totalScore > B.totalScore) {
        SA = 1; SB = 0;
      } else if (A.totalScore < B.totalScore) {
        SA = 0; SB = 1;
      } else {
        SA = 0.5; SB = 0.5;
      }

      const EA = expectedScore(rA, rB);
      const EB = expectedScore(rB, rA);

      elo[A.name].rating = rA + K_FACTOR * (SA - EA);
      elo[B.name].rating = rB + K_FACTOR * (SB - EB);
    }
  }

  // Increment games played
  players.forEach(p => {
    elo[p.name].games = (elo[p.name].games || 0) + 1;
  });

  saveElo(elo);
}


// ------------------------------------------------------------
// Leaderboard data
// ------------------------------------------------------------
function getLeaderboardData() {
  const elo = loadElo();
  const entries = Object.entries(elo).map(([name, data]) => ({
    name,
    rating: Math.round(data.rating),
    games: data.games || 0
  }));

  entries.sort((a, b) => b.rating - a.rating);
  return entries;
}


// ------------------------------------------------------------
// Recent games
// ------------------------------------------------------------
function getRecentGames() {
  return loadGames().slice().sort((a, b) => b.id - a.id);
}


// ------------------------------------------------------------
// Export to global
// ------------------------------------------------------------
window.loadGames = loadGames;
window.saveGameRecord = saveGameRecord;
window.loadElo = loadElo;
window.updateEloForGame = updateEloForGame;
window.getLeaderboardData = getLeaderboardData;
window.getRecentGames = getRecentGames;
