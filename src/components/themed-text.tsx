import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { a11y } from '@/lib/accessibility';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  // Accessibility overrides (semantic role for screen readers)
  semanticRole?: 'header' | 'text' | 'link';
  semanticHeaderLevel?: 1 | 2 | 3;
  accessibilityLabel?: string;
  // Allow font scaling to honor user Dynamic Type settings (default true)
  allowFontScaling?: boolean;
  // Set maxFontSizeMultiplier to clamp extreme sizes
  maxFontSizeMultiplier?: number;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  semanticRole,
  semanticHeaderLevel,
  accessibilityLabel,
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.8,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  // Pick the right role for the chosen type so screen readers announce
  // headings as headings, links as links, etc.
  const inferredRole: 'header' | 'text' | 'link' | undefined =
    semanticRole ??
    (type === 'title' || type === 'subtitle'
      ? 'header'
      : type === 'link' || type === 'linkPrimary'
        ? 'link'
        : undefined);

  const a11yProps: TextProps =
    inferredRole === 'header'
      ? (a11y.header(semanticHeaderLevel ?? (type === 'title' ? 1 : 2), accessibilityLabel) as TextProps)
      : inferredRole === 'link'
        ? (a11y.link(accessibilityLabel ?? '', { hint: 'Opens link' }) as TextProps)
        : {};

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      // iOS-only: prevent system from truncating at fixed width
      adjustsFontSizeToFit={type === 'title' || type === 'subtitle'}
      numberOfLines={type === 'title' ? 2 : undefined}
      {...a11yProps}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
  },
  smallBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: Platform.select({ ios: '#208AEF', default: '#208AEF' }),
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#208AEF',
  },
  code: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 14,
  },
});
