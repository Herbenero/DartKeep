// dart-games.js
const DartGames = {
  // Original Games
  countup: { id: "countup", name: "Count Up", kind: "rounds", rounds: 8, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  countup15: { id: "countup15", name: "Count Up (15 Rounds)", kind: "rounds", rounds: 15, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  x01_301: { id: "x01_301", name: "301", kind: "x01", startingScore: 301, dartsPerTurn: 3, scoringType: "subtract", winnerType: "firstToZero" },
  x01_501: { id: "x01_501", name: "501", kind: "x01", startingScore: 501, dartsPerTurn: 3, scoringType: "subtract", winnerType: "firstToZero" },
  cricket: { id: "cricket", name: "Cricket", kind: "cricket", targets: [15, 16, 17, 18, 19, 20, 25], dartsPerTurn: 3, scoringType: "cricket", winnerType: "closedAndHigh" },
 
  // New Games
  dart9_century: { id: "dart9_century", name: "9 Dart Century", kind: "rounds", rounds: 3, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  all_5s: { id: "all_5s", name: "All 5's", kind: "rounds", rounds: 10, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  baseball: { id: "baseball", name: "Baseball Darts", kind: "rounds", rounds: 9, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  bermuda: { id: "bermuda", name: "Bermuda Triangle", kind: "rounds", rounds: 13, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  bowling: { id: "bowling", name: "Bowling Darts", kind: "rounds", rounds: 10, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  cricket_rand: { id: "cricket_rand", name: "Cricket- Random", kind: "cricket", targets: [20, 19, 18, 17, 16, 15, 25], dartsPerTurn: 3, scoringType: "cricket", winnerType: "closedAndHigh" },
  cricket_low: { id: "cricket_low", name: "Cricket- Lowball", kind: "cricket", targets: [1, 2, 3, 4, 5, 6, 25], dartsPerTurn: 3, scoringType: "cricket", winnerType: "closedAndHigh" },
  elimination: { id: "elimination", name: "Elimination Darts", kind: "rounds", rounds: 10, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  football: { id: "football", name: "Football Darts", kind: "rounds", rounds: 4, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  golf: { id: "golf", name: "Golf Darts", kind: "rounds", rounds: 9, dartsPerTurn: 3, scoringType: "sum", winnerType: "lowest" },
  jdc_challenge: { id: "jdc_challenge", name: "JDC Challenge", kind: "rounds", rounds: 15, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  killer: { id: "killer", name: "Killer", kind: "rounds", rounds: 10, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  prisoner: { id: "prisoner", name: "Prisoner", kind: "rounds", rounds: 10, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  quick_draw: { id: "quick_draw", name: "Quick Draw", kind: "rounds", rounds: 3, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  shanghai: { id: "shanghai", name: "Shanghai", kind: "rounds", rounds: 20, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  shanghai_7: { id: "shanghai_7", name: "Shanghai 7", kind: "rounds", rounds: 7, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  shove_penny: { id: "shove_penny", name: "Shove a Penny", kind: "cricket", targets: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 25], dartsPerTurn: 3, scoringType: "cricket", winnerType: "closedAndHigh" },
  tactics: { id: "tactics", name: "Tactics", kind: "cricket", targets: [20, 19, 18, 17, 16, 15, 25], dartsPerTurn: 3, scoringType: "cricket", winnerType: "closedAndHigh" },
  tennis: { id: "tennis", name: "Tennis Darts", kind: "rounds", rounds: 6, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" },
  tictactoe: { id: "tictactoe", name: "Tic-Tac-Toe", kind: "rounds", rounds: 9, dartsPerTurn: 3, scoringType: "sum", winnerType: "highest" }
};

function getAllGames() {
  return Object.values(DartGames);
}
