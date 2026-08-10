import { useState, useEffect } from 'react';

/**
 * Returns the current window inner width and updates on resize.
 * Use this for inline-style responsive branching.
 *
 * Breakpoints:
 *   mobile  < 768px
 *   tablet  768px – 1279px
 *   desktop ≥ 1280px
 */
export default function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return width;
}

// Convenience helpers
export const isMobile  = (w) => w < 768;
export const isTablet  = (w) => w >= 768 && w < 1280;
export const isDesktop = (w) => w >= 1280;
