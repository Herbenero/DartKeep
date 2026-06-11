// storage-elo.js (Online Version)

const BIN_ID = '6a2ad0e3f5f4af5e29dfe321';
const API_KEY = '$2a$10$FahBJGmWqnfEa/M6NF2s8eQbttylJcYUn5l3vAbWI.Px8cwh02hm2';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Helper to fetch data from the online bin
async function fetchOnlineData() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await response.json();
    return data.record; // JSONbin wraps records in a .record object
  } catch (err) {
    console.error("Failed to fetch online data", err);
    return { games: [], elo: {} };
  }
}

// Helper to save data back to the online bin
async function saveOnlineData(newData) {
  try {
    await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(newData)
    });
  } catch (err) {
    console.error("Failed to save online data", err);
  }
}

// Rewritten storage functions
async function loadGames() {
  const data = await fetchOnlineData();
  return data.games || [];
}

async function saveGameRecord(gameRecord) {
  const data = await fetchOnlineData();
  data.games = data.games || [];
  data.games.push(gameRecord);
  await saveOnlineData(data);
}

async function loadElo() {
  const data = await fetchOnlineData();
  return data.elo || {};
}

// Updated Elo logic for Async
async function updateEloForGame(gameRecord) {
  const data = await fetchOnlineData();
  const elo = data.elo || {};
  const players = gameRecord.players;
  const K_FACTOR = 32;

  players.forEach(p => {
    if (!elo[p.name]) elo[p.name] = { rating: 1200, games: 0 };
  });

  // Simplified pairwise Elo update (reusing your existing logic)
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const A = players[i]; const B = players[j];
      const rA = elo[A.name].rating; const rB = elo[B.name].rating;
      let SA = 0.5, SB = 0.5;
      if (A.totalScore > B.totalScore) { SA = 1; SB = 0; }
      else if (A.totalScore < B.totalScore) { SA = 0; SB = 1; }
      const EA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
      const EB = 1 / (1 + Math.pow(10, (rA - rB) / 400));
      elo[A.name].rating = rA + K_FACTOR * (SA - EA);
      elo[B.name].rating = rB + K_FACTOR * (SB - EB);
    }
  }

  players.forEach(p => elo[p.name].games++);
  data.elo = elo;
  await saveOnlineData(data);
}
