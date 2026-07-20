import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { a11y } from '@/lib/accessibility';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton label="Home">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton label="Explore">Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, label, ...props }: TabTriggerSlotProps & { label?: string }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => pressed && styles.pressed}
      // Accessibility: announce as a tab + selected state
      {...(a11y.tab(label ?? String(children), !!isFocused) as any)}
    >
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}
      >
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  return (
    <View
      // Tab list is a single accessibility group with role "tablist"
      accessible
      accessibilityRole="tablist"
      style={[styles.tabList, { backgroundColor: colors.backgroundElement }]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    minHeight: 44, // WCAG 2.5.5 target size
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabList: {
    flexDirection: 'row',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    padding: Spacing.one,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
});
