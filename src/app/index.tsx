import * as Device from 'expo-device';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { a11y, useReduceMotion } from '@/lib/accessibility';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const reduceMotion = useReduceMotion();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView
          style={styles.heroSection}
          // The hero is a single accessibility group so screen readers
          // don't read the icon + title separately
          accessibleGroup
          accessibilityLabel="Welcome to OrbitPay"
        >
          <View
            // Decorative — the title below is the accessible name
            {...(a11y.hidden as any)}
            // Honor Reduce Motion: when on, skip the animated icon
            pointerEvents="none"
          >
            <AnimatedIcon reduceMotion={reduceMotion} />
          </View>
          <ThemedText
            type="title"
            style={styles.title}
            semanticRole="header"
            semanticHeaderLevel={1}
            accessibilityLabel="Welcome to OrbitPay"
          >
            Welcome to&nbsp;OrbitPay
          </ThemedText>
        </ThemedView>

        <ThemedText
          type="code"
          style={styles.code}
          accessibilityLabel="Getting started section"
          semanticRole="header"
          semanticHeaderLevel={2}
        >
          get started
        </ThemedText>

        <ThemedView
          type="backgroundElement"
          style={styles.stepContainer}
          // The container is a list — screen reader announces
          // "List, 3 items"
          accessibilityRole="list"
          accessibilityLabel="Getting started steps"
        >
          <View accessibilityRole="listitem">
            <HintRow
              title="Try editing"
              hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
            />
          </View>
          <View accessibilityRole="listitem">
            <HintRow title="Dev tools" hint={getDevMenuHint()} />
          </View>
          <View accessibilityRole="listitem">
            <HintRow
              title="Fresh start"
              hint={<ThemedText type="code">npm run reset-project</ThemedText>}
            />
          </View>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
