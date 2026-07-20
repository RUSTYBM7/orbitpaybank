import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
  // When true, the view is announced as a single unit by screen readers
  // (children's individual labels are merged into one announcement)
  accessibleGroup?: boolean;
  accessibilityLabel?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  accessibleGroup,
  accessibilityLabel,
  accessible,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      accessible={accessibleGroup ? true : accessible}
      accessibilityLabel={accessibleGroup ? accessibilityLabel : undefined}
      style={[{ backgroundColor: theme[type ?? 'background'] }, style]}
      {...otherProps}
    />
  );
}
