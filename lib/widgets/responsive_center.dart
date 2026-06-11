import 'package:flutter/material.dart';

/// A small helper widget to center and constrain content width
/// across phone, tablet and desktop. Wrap screen content in this.
class ResponsiveCenter extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;

  const ResponsiveCenter({
    Key? key,
    required this.child,
    this.padding = const EdgeInsets.symmetric(vertical: 16.0, horizontal: 12.0),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final maxWidth = constraints.maxWidth;
      // Choose a comfortable content width for desktop/tablet.
      final double contentWidth = maxWidth >= 1200
          ? 900
          : maxWidth >= 900
              ? 700
              : maxWidth >= 600
                  ? 600
                  : maxWidth * 0.95;

      return Align(
        alignment: Alignment.topCenter,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: contentWidth),
          child: Padding(
            padding: padding,
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: child,
            ),
          ),
        ),
      );
    });
  }
}
