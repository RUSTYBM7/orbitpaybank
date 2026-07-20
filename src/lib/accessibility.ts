// Accessibility utilities — WCAG 2.2 AA targeted.
// Centralized so every component uses consistent patterns.
//
// Pattern:
//   <Pressable {...a11y.button('Send money', { hint: 'Opens send screen' })} />

import type { AccessibilityProps, AccessibilityRole, AccessibilityState } from 'react-native';

export const a11y = {
  // ─── Interactive elements ──────────────────────────────────────────
  button: (
    label: string,
    opts: { hint?: string; disabled?: boolean; selected?: boolean } = {},
  ): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'button' as AccessibilityRole,
    accessibilityLabel: label,
    accessibilityHint: opts.hint,
    accessibilityState: { disabled: !!opts.disabled, selected: !!opts.selected } as AccessibilityState,
    hitSlop: 12, // expand 44pt target on small buttons
  }),

  link: (label: string, opts: { hint?: string } = {}): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'link' as AccessibilityRole,
    accessibilityLabel: label,
    accessibilityHint: opts.hint,
  }),

  tab: (label: string, isSelected: boolean): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'tab' as AccessibilityRole,
    accessibilityLabel: label,
    accessibilityState: { selected: isSelected } as AccessibilityState,
  }),

  // ─── Semantic structure ───────────────────────────────────────────
  header: (level: 1 | 2 | 3 = 2, label?: string): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'header' as AccessibilityRole,
    accessibilityLabel: label,
    // RN doesn't have h1/h2/h3; use traits on iOS via the role
  }),

  text: (label: string): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'text' as AccessibilityRole,
    accessibilityLabel: label,
  }),

  image: (altText: string, decorative = false): AccessibilityProps =>
    decorative
      ? { accessible: false, importantForAccessibility: 'no' }
      : { accessible: true, accessibilityRole: 'image' as AccessibilityRole, accessibilityLabel: altText },

  // ─── Dynamic content ──────────────────────────────────────────────
  liveRegion: (label: string, politeness: 'polite' | 'assertive' = 'polite'): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'text' as AccessibilityRole,
    accessibilityLabel: label,
    accessibilityLiveRegion: politeness,
  }),

  // ─── Containers ───────────────────────────────────────────────────
  group: (label: string): AccessibilityProps => ({
    accessible: true,
    accessibilityRole: 'summary' as AccessibilityRole,
    accessibilityLabel: label,
  }),

  // ─── Hidden from a11y (decorative) ─────────────────────────────────
  hidden: { importantForAccessibility: 'no-hide-descendants' as const, accessible: false },
};

// ─── Screen reader / motion detection hook ──────────────────────────
import { AccessibilityInfo, useColorScheme, useReducedMotion } from 'react-native';
import { useEffect, useState } from 'react';

export function useScreenReader(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setEnabled);
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);
    return () => sub.remove();
  }, []);
  return enabled;
}

export function useReduceMotion(): boolean {
  return useReducedMotion() ?? false;
}

export function useHighContrast(): boolean {
  // iOS only — when Increase Contrast is on
  const [hc, setHc] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isHighTextContrastEnabled?.().then?.((v: boolean) => setHc(!!v));
  }, []);
  return hc;
}

// ─── Focus helpers ──────────────────────────────────────────────────
export function focusOnMount(ref: React.RefObject<any>, label?: string) {
  useEffect(() => {
    if (ref.current) {
      ref.current.setNativeProps?.({
        accessibilityLabel: label,
        // RN doesn't have a direct focus API; AccessibilityInfo.setAccessibilityFocus is iOS-only
      });
    }
    // iOS-only announcement when screen mounts
    if (label) AccessibilityInfo.announceForAccessibility(label);
  }, []);
}
