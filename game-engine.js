// game-engine.js
//
// Core scoring engine for DartKeep v2.
// Handles all game types defined in dart-games.js.
// The UI (main.js) calls these functions to mutate game state.

// ------------------------------------------------------------
// Create a new game state
// ------------------------------------------------------------
function createGameState(gameDef, players) {
  const state = {
    gameId: gameDef.id,
    gameDef,
    players: players.map(name => ({
      name,
      total: 0,
      scores: [],        // used for round-based games
      cricket: {},       // used for cricket
      progress: 0        // used for around-the-world
    })),
    currentPlayerIndex: 0,
    currentRound: 1,
    history: [],
    gameOver: false,
    winner: null
  };

  // X01 initialization
  if (gameDef.kind === "x01") {
    state.players.forEach(p => {
      p.total = gameDef.startingScore;
    });
  }

  // Cricket initialization
  if (gameDef.kind === "cricket") {
    state.players.forEach(p => {
      gameDef.targets.forEach(t => {
        p.cricket[t] = 0; // hits per target
      });
    });
  }

  return state;
}

// ------------------------------------------------------------
// Apply a dart hit (number + multiplier)
// UI calls this for every dart thrown
// ------------------------------------------------------------
function applyDartHit(state, hitValue, multiplier) {
  if (state.gameOver) return;

  const game = state.gameDef;

  switch (game.scoringType) {
    case "sum":
      applySum(state, hitValue * multiplier);
      break;

    case "subtract":
      applyX01(state, hitValue * multiplier);
      break;

    case "cricket":
      applyCricket(state, hitValue, multiplier);
      break;

    case "hitTarget":
      applyAround(state, hitValue);
      break;
  }

  checkGameEnd(state);
}

// ------------------------------------------------------------
// SUM scoring (Count Up, High Score)
// ------------------------------------------------------------
function applySum(state, score) {
  const p = state.players[state.currentPlayerIndex];
  const roundIndex = state.currentRound - 1;

  if (!p.scores[roundIndex]) p.scores[roundIndex] = 0;
  p.scores[roundIndex] += score;
  p.total += score;

  state.history.push({
    type: "sum",
    playerIndex: state.currentPlayerIndex,
    round: state.currentRound,
    score
  });
}

// ------------------------------------------------------------
// X01 scoring (301, 501)
// ------------------------------------------------------------
function applyX01(state, score) {
  const p = state.players[state.currentPlayerIndex];
  const before = p.total;
  const after = before - score;

  if (after < 0) {
    // bust
    state.history.push({
      type: "x01-bust",
      playerIndex: state.currentPlayerIndex,
      before,
      after: before
    });
    return;
  }

  p.total = after;

  state.history.push({
    type: "x01",
    playerIndex: state.currentPlayerIndex,
    before,
    after
  });

  if (after === 0) {
    state.gameOver = true;
    state.winner = p.name;
  }
}

// ------------------------------------------------------------
// Cricket scoring
// ------------------------------------------------------------
function applyCricket(state, hitValue, multiplier) {
  const game = state.gameDef;
  const p = state.players[state.currentPlayerIndex];

  if (!game.targets.includes(hitValue)) {
    // irrelevant hit
    state.history.push({
      type: "cricket-miss",
      playerIndex: state.currentPlayerIndex,
      hitValue,
      multiplier
    });
    return;
  }

  const before = p.cricket[hitValue];
  let newHits = before + multiplier;

  let scoringHits = 0;

  if (before >= 3) {
    // already closed → all hits score
    scoringHits = multiplier;
  } else if (newHits > 3) {
    // overflow hits score
    scoringHits = newHits - 3;
    newHits = 3;
  }

  p.cricket[hitValue] = newHits;

  if (scoringHits > 0) {
    p.total += scoringHits * hitValue;
  }

  state.history.push({
    type: "cricket",
    playerIndex: state.currentPlayerIndex,
    hitValue,
    multiplier,
    before,
    after: newHits,
    scoringHits
  });
}

// ------------------------------------------------------------
// Around the World scoring
// ------------------------------------------------------------
function applyAround(state, hitValue) {
  const game = state.gameDef;
  const p = state.players[state.currentPlayerIndex];

  const needed = game.targets[p.progress];

  if (hitValue === needed) {
    p.progress++;

    state.history.push({
      type: "around",
      playerIndex: state.currentPlayerIndex,
      hitValue,
      progress: p.progress
    });

    if (p.progress >= game.targets.length) {
      state.gameOver = true;
      state.winner = p.name;
    }
  } else {
    state.history.push({
      type: "around-miss",
      playerIndex: state.currentPlayerIndex,
      hitValue
    });
  }
}

// ------------------------------------------------------------
// Check if round-based games are complete
// ------------------------------------------------------------
function checkGameEnd(state) {
  if (state.gameOver) return;

  const game = state.gameDef;

  if (game.kind === "rounds") {
    const allFilled = state.players.every(p => {
      return p.scores.length >= game.rounds &&
             p.scores.every(s => s != null);
    });

    if (allFilled) {
      const best = Math.max(...state.players.map(p => p.total));
      const winner = state.players.find(p => p.total === best);
      state.gameOver = true;
      state.winner = winner.name;
    }
  }
}

// ------------------------------------------------------------
// Advance to next player
// ------------------------------------------------------------
function nextPlayer(state) {
  if (state.gameOver) return;

  const game = state.gameDef;

  state.currentPlayerIndex++;

  if (state.currentPlayerIndex >= state.players.length) {
    state.currentPlayerIndex = 0;

    if (game.kind === "rounds") {
      state.currentRound++;
    }
  }
}

// ------------------------------------------------------------
// Undo last action
// ------------------------------------------------------------
function undoLast(state) {
  if (state.history.length === 0) return;

  const last = state.history.pop();
  const p = state.players[last.playerIndex];

  switch (last.type) {
    case "sum":
      p.scores[last.round - 1] -= last.score;
      p.total -= last.score;
      break;

    case "x01":
      p.total = last.before;
      break;

    case "x01-bust":
      // nothing to undo (score never changed)
      break;

    case "cricket":
      p.cricket[last.hitValue] = last.before;
