'use client';

import NProgress from 'nprogress';
import { useRef, useEffect } from 'react';
import { isEqualPath } from 'minimal-shared/utils';

import { usePathname } from '../../../hooks/router';

// ----------------------------------------------------------------------

export interface ProgressBarProps {
  showSpinner?: boolean;
  color?: string;
  height?: number;
  speed?: number;
  minimum?: number;
  easing?: string;
  positionUsing?: string;
  template?: string;
  logger?: {
    error: (message: string, error?: any) => void;
  };
}

//  Checks if an anchor element is valid for triggering the progress bar.
function isValidAnchor(element: HTMLAnchorElement): boolean {
  if (!element) return false;

  const href = element.getAttribute('href')?.trim() ?? '';
  const target = element.getAttribute('target');
  const rel = element.getAttribute('rel');

  return (
    href.startsWith('/') &&
    target !== '_blank' &&
    (!rel || !['noopener', 'noreferrer'].some((v) => rel.includes(v)))
  );
}

// ----------------------------------------------------------------------

function useProgressBar(logger?: ProgressBarProps['logger']) {
  const pathname = usePathname();
  const currentUrlRef = useRef<string>('');

  // Initialize currentUrlRef in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      currentUrlRef.current = window.location.href;
    }
  }, []);

  useEffect(() => {
    // Starts the progress bar if navigating to a different URL.
    const handleNavigation = (newUrl: string) => {
      try {
        if (newUrl && !isEqualPath(newUrl, currentUrlRef.current, { deep: false })) {
          currentUrlRef.current = newUrl;
          NProgress.start();
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development' && logger) {
          logger.error('Navigation progress error:', error);
        }
        NProgress.done();
      }
    };

    // Handles anchor tag clicks via event delegation.
    const handleClickAnchor = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;

      if (anchor && isValidAnchor(anchor)) {
        handleNavigation(anchor.href);
      }
    };

    // Handles `popstate` events for browser back/forward navigation.
    const handlePopState = () => {
      handleNavigation(window.location.href);
    };

    // Patches a history method to intercept client-side navigations.
    const patchHistoryMethod = (method: 'pushState' | 'replaceState') => {
      const originalMethod = window.history[method];

      window.history[method] = new Proxy(originalMethod, {
        apply: (target, thisArg, args: [data: any, unused: string, url?: string | URL | null]) => {
          const newUrl = args[2];
          if (typeof newUrl === 'string') {
            handleNavigation(new URL(newUrl, window.location.origin).href);
          }
          return target.apply(thisArg, args);
        },
      });
    };

    patchHistoryMethod('pushState');
    patchHistoryMethod('replaceState');

    document.addEventListener('click', handleClickAnchor);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClickAnchor);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logger]);

  // Completes the progress bar when pathname changes
  useEffect(() => {
    const timeout = setTimeout(() => NProgress.done(), 100);
    return () => clearTimeout(timeout);
  }, [pathname]);
}

// ----------------------------------------------------------------------

export function ProgressBar({
  showSpinner = false,
  color,
  height,
  speed,
  minimum,
  easing,
  positionUsing,
  template,
  logger,
}: ProgressBarProps) {
  useEffect(() => {
    NProgress.configure({
      showSpinner,
      ...(speed && { speed }),
      ...(minimum && { minimum }),
      ...(easing && { easing }),
      ...(positionUsing && { positionUsing }),
      ...(template && { template }),
    });

    // Apply custom color and height via CSS
    if (color || height) {
      const style = document.createElement('style');
      style.textContent = `
        ${color ? `#nprogress .bar { background: ${color} !important; }` : ''}
        ${height ? `#nprogress .bar { height: ${height}px !important; }` : ''}
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
        NProgress.done();
      };
    }

    return () => {
      NProgress.done();
    };
  }, [showSpinner, color, height, speed, minimum, easing, positionUsing, template]);

  useProgressBar(logger);

  return null;
}
