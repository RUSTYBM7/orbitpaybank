import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { a11y } from '@/lib/accessibility';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <ThemedView
      type="backgroundSelected"
      style={styles.codeSnippet}
      // The row is a list item; screen reader announces "Try editing, app/index.tsx"
      accessibleGroup
      accessibilityLabel={`${title}, ${typeof hint === 'string' ? hint : 'code snippet'}`}
      accessibilityRole="text"
    >
      <View style={styles.stepRow}>
        <ThemedText
          type="small"
          semanticRole="header"
          semanticHeaderLevel={3}
          accessibilityLabel={title}
        >
          {title}
        </ThemedText>
      </View>
      <ThemedView type="backgroundSelected" style={styles.codeBox}>
        <ThemedText
          themeColor="textSecondary"
          accessibilityLabel={`Code: ${typeof hint === 'string' ? hint : ''}`}
        >
          {hint}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 44, // touch target for VoiceOver focus
  },
  codeBox: {
    borderRadius: Spacing.one,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});
