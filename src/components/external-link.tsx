import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

import { a11y } from '@/lib/accessibility';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Href & string;
  // Override the default "Opens in browser" hint
  hint?: string;
  // Accessible label for screen readers
  label?: string;
};

export function ExternalLink({ href, hint, label, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      // Accessibility: announce as a link + tell user it opens in browser
      {...(a11y.link(label ?? String(href), {
        hint: hint ?? 'Opens in a new browser window',
      } as any) as any)}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
