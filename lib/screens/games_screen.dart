import 'package:flutter/material.dart';
import '../widgets/responsive_center.dart';

class GamesScreen extends StatelessWidget {
  const GamesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Games')),
      body: ResponsiveCenter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 12),
            Center(child: Text('Available Games', style: Theme.of(context).textTheme.headline6)),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/game-selection');
              },
              child: const Text('Cricket'),
            ),
            // add more game buttons here
          ],
        ),
      ),
    );
  }
}
