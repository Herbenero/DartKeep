import 'package:flutter/material.dart';
import '../models/game.dart';

class GameSelectionScreen extends StatefulWidget {
  const GameSelectionScreen({Key? key}) : super(key: key);

  @override
  _GameSelectionScreenState createState() => _GameSelectionScreenState();
}

class _GameSelectionScreenState extends State<GameSelectionScreen> {
  DateTime? _playedAt;

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _playedAt ?? now,
      firstDate: DateTime(2000),
      lastDate: now,
    );

    if (picked != null) {
      setState(() {
        _playedAt = picked;
      });
    }
  }

  void _startGame(GameType type) {
    final game = Game(type: type, playedAt: _playedAt ?? DateTime.now());
    // Navigate to game screen with the game object, or post/save it
    Navigator.of(context).pushNamed('/play-game', arguments: game);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select Game')),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: _pickDate,
                  icon: const Icon(Icons.calendar_today),
                  label: Text(_playedAt == null ? 'Select Date (default=Today)' : '${_playedAt!.toLocal()}'.split(' ')[0]),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: () => _startGame(GameType.cricket),
                  child: const Text('Start Cricket'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text('Or pick from recent games...'),
            // TODO: recent games list
          ],
        ),
      ),
    );
  }
}
