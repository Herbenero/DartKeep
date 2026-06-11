import 'dart:math' show min, max;

class Player {
  final String id;
  final String name;
  final Map<int, int> marks = {}; // key: number (15-20 and bull key), value: marks (0..3+)
  int points = 0;

  Player({required this.id, required this.name});

  bool closedNumber(int target) => (marks[target] ?? 0) >= 3;
  bool closedAll(List<int> targets) => targets.every((t) => closedNumber(t));
}

class CricketGame {
  final List<Player> players;
  final List<int> targets = [15, 16, 17, 18, 19, 20, 25]; // using 25 for bull
  Player? winner;
  bool gameOver = false;

  CricketGame({required this.players});

  /// Apply a hit.
  /// target: number hit (use 25 for bull).
  /// multiplier: 1 (single), 2 (double), 3 (triple).
  void applyHit(Player player, int target, int multiplier) {
    if (gameOver) return;

    // For bull: single bull counts as 1 mark, double bull counts as 2 marks
    int markIncrement = 0;
    int pointsFromHit = 0;

    if (target == 25) {
      // bull handling: single = 1 mark, double = 2 marks
      markIncrement = (multiplier == 2) ? 2 : 1;
    } else {
      markIncrement = multiplier; // triple adds 3 marks for normal numbers
    }

    // Update marks
    final currentMarks = player.marks[target] ?? 0;
    final newMarks = currentMarks + markIncrement;
    player.marks[target] = newMarks;

    // if player closed beyond 3 and opponents haven't closed, those extra marks turn into points
    final extraMarks = max(0, newMarks - 3);
    if (extraMarks > 0) {
      // Check whether any opponent still has the number open
      final opponentHasOpen = players.any((p) => p != player && !(p.marks[target] ?? 0 >= 3));
      if (opponentHasOpen) {
        final valuePerMark = (target == 25) ? 25 : target;
        pointsFromHit += extraMarks * valuePerMark;
        player.points += pointsFromHit;
      }
    }

    // After applying hit, check end conditions
    _checkEndCondition(player);
  }

  void _checkEndCondition(Player candidate) {
    // If the player has closed all targets and has strictly more points than every other player -> winner
    final closedAll = candidate.closedAll(targets);
    if (!closedAll) return;

    final maxOtherPoints = players.where((p) => p != candidate).map((p) => p.points).fold<int>(0, max);
    if (candidate.points > maxOtherPoints) {
      gameOver = true;
      winner = candidate;
      // UI should react to gameOver/winner (e.g., show banner)
    }
  }
}
