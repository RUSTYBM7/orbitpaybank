import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { a11y } from '@/lib/accessibility';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView
      style={styles.container}
      // The whole badge is decorative for screen readers — version info
      // is already announced elsewhere
      {...(a11y.hidden as any)}
    >
      <ThemedText
        type="code"
        themeColor="textSecondary"
        style={styles.versionText}
        accessibilityLabel={`Expo version ${version}`}
      >
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
        // Decorative — the link context already exists
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});
