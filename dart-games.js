// dart-games.js

// Central registry of all DartKeep games.
// Each game definition describes how the engine should behave.

const DartGames = {
  countup: {
    id: "countup",
    name: "Count Up",
    kind: "rounds",
    rounds: 8,
    dartsPerTurn: 3,
    scoringType: "sum",        // simple add
    winnerType: "highest",     // highest total wins
  },

  highscore: {
    id: "highscore",
    name: "High Score (10 Rounds)",
    kind: "rounds",
    rounds: 10,
    dartsPerTurn: 3,
    scoringType: "sum",
    winnerType: "highest",
  },

  x01_301: {
    id: "x01_301",
    name: "301",
    kind: "x01",
    startingScore: 301,
    dartsPerTurn: 3,
    scoringType: "subtract",   // subtract from starting score
    winnerType: "firstToZero", // first to exactly 0 wins
  },

  x01_501: {
    id: "x01_501",
    name: "501",
    kind: "x01",
    startingScore: 501,
    dartsPerTurn: 3,
    scoringType: "subtract",
    winnerType: "firstToZero",
  },

  cricket: {
    id: "cricket",
    name: "Cricket",
    kind: "cricket",
    targets: [15, 16, 17, 18, 19, 20, 25], // 25 = bull
    dartsPerTurn: 3,
    scoringType: "cricket",
    winnerType: "closedAndHigh",
  },

  around: {
    id: "around",
    name: "Around the World",
    kind: "around",
    targets: [
      1, 2, 3, 4, 5,
      6, 7, 8, 9, 10,
      11, 12, 13, 14, 15,
      16, 17, 18, 19, 20
    ],
    dartsPerTurn: 3,
    scoringType: "hitTarget",
    winnerType: "firstToFinish",
  },
};

// Helper to get all games as an array (for home screen buttons)
function getAllGames() {
  return Object.values(DartGames);
}
