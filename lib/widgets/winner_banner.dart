import 'package:flutter/material.dart';
import 'dart:math' show min;

class WinnerBanner extends StatelessWidget {
  final String winnerName;
  final int points;

  const WinnerBanner({Key? key, required this.winnerName, required this.points}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black54,
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
          ),
          width: min(500, MediaQuery.of(context).size.width * 0.9),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Winner!', style: Theme.of(context).textTheme.headline4?.copyWith(color: Colors.green)),
              const SizedBox(height: 12),
              Text(winnerName, style: Theme.of(context).textTheme.headline6),
              const SizedBox(height: 8),
              Text('Points: $points'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(), // close banner
                child: const Text('OK'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
