import 'package:flutter/material.dart';
import '../widgets/responsive_center.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('DartKeep')),
      body: ResponsiveCenter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Text('Welcome to DartKeep', style: Theme.of(context).textTheme.headline5),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // navigate to games
                Navigator.of(context).pushNamed('/games');
              },
              child: const Text('Play Games'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/leaderboard');
              },
              child: const Text('Leaderboard'),
            ),
          ],
        ),
      ),
    );
  }
}
