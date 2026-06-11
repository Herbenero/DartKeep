import 'package:flutter/material.dart';
import '../widgets/responsive_center.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Leaderboard')),
      body: ResponsiveCenter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 12),
            Center(child: Text('Top Players', style: Theme.of(context).textTheme.headline6)),
            const SizedBox(height: 12),
            // TODO: replace with your actual leaderboard list
            Card(
              child: ListTile(
                title: const Text('Player 1'),
                trailing: const Text('1234 pts'),
              ),
            ),
            Card(
              child: ListTile(
                title: const Text('Player 2'),
                trailing: const Text('1100 pts'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
