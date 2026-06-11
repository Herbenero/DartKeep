enum GameType { cricket, x01, darts501 }

extension GameTypeExtension on GameType {
  static GameType fromString(String? s) {
    if (s == null) return GameType.cricket;
    switch (s.toLowerCase()) {
      case 'gametype.cricket':
      case 'cricket':
        return GameType.cricket;
      case 'gametype.x01':
      case 'x01':
        return GameType.x01;
      case 'gametype.darts501':
      case 'darts501':
        return GameType.darts501;
      default:
        return GameType.cricket;
    }
  }
}

class Game {
  final GameType type;
  DateTime playedAt;

  Game({required this.type, DateTime? playedAt}) : playedAt = playedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'type': type.toString(),
      'playedAt': playedAt.toIso8601String(),
    };
  }

  factory Game.fromJson(Map<String, dynamic> json) {
    return Game(
      type: GameTypeExtension.fromString(json['type'] as String?),
      playedAt: DateTime.tryParse(json['playedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }
}
