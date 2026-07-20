import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { a11y } from '@/lib/accessibility';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      // Announce the page heading when scroll view mounts
      accessibilityRole="main"
      accessibilityLabel="Explore page"
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="subtitle"
            semanticRole="header"
            semanticHeaderLevel={1}
            accessibilityLabel="Explore"
          >
            Explore
          </ThemedText>
          <ThemedText
            style={styles.centerText}
            themeColor="textSecondary"
            accessibilityLabel="This starter app includes example code to help you get started."
          >
            This starter app includes example{'\n'}code to help you get started.
          </ThemedText>

          <ExternalLink
            href="https://docs.expo.dev"
            label="Expo documentation, opens in browser"
          >
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              {...(a11y.button('Open Expo documentation', {
                hint: 'Opens the Expo docs in your browser',
              }) as any)}
            >
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                {Platform.OS === 'ios' && (
                  <SymbolView
                    name="arrow.up.right.square"
                    tintColor={theme.tint}
                    size={16}
                    {...(a11y.hidden as any)}
                  />
                )}
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    gap: Spacing.three,
  },
  titleContainer: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    minHeight: 44, // WCAG 2.5.5
  },
  pressed: {
    opacity: 0.7,
  },
});
