import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Pressable, Platform } from 'react-native';
import { useEffect, useRef } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemedText } from '@/components/themed-text';
import { a11y, useScreenReader, useReduceMotion } from '@/lib/accessibility';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const screenReaderOn = useScreenReader();
  const reduceMotion = useReduceMotion();
  const skipLinkRef = useRef<any>(null);

  // Announce the app name when the screen reader is on (iOS only)
  useEffect(() => {
    if (Platform.OS === 'ios' && screenReaderOn) {
      // small delay so the first screen mounts first
      const t = setTimeout(() => {
        // no-op; live region used below
      }, 500);
      return () => clearTimeout(t);
    }
  }, [screenReaderOn]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />

      {/* Skip link — only visible to screen readers, first focusable element */}
      {Platform.OS === 'web' && (
        <Pressable
          ref={skipLinkRef}
          href="#main-content"
          // Visually hidden but available to screen readers
          style={{
            position: 'absolute',
            left: -9999,
            top: 8,
            zIndex: 1000,
          }}
          onFocus={(e) => {
            // Bring back into view when focused
            e.currentTarget.setNativeProps?.({ style: { left: 8 } });
          }}
          onBlur={(e) => {
            e.currentTarget.setNativeProps?.({ style: { left: -9999 } });
          }}
          {...(a11y.link('Skip to main content', { hint: 'Jumps past the navigation' }) as any)}
        >
          <ThemedText type="link">Skip to main content</ThemedText>
        </Pressable>
      )}

      <AppTabs />

      {/* Live region for app-wide announcements (e.g. transaction success) */}
      <ThemedText
        // Visually hidden, available to screen readers
        style={{ position: 'absolute', left: -9999, top: -9999 }}
        {...(a11y.liveRegion('OrbitPay ready', 'polite') as any)}
      >
        {''}
      </ThemedText>
    </ThemeProvider>
  );
}
