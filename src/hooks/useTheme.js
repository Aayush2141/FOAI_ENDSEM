import { useState, useEffect } from 'react';
import { setItem, getItem } from '../utils/localStorage';

const THEME_KEY = 'theme';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = getItem(THEME_KEY, null);
    if (saved !== null) return saved === 'dark';
    // Default to dark (matches our space aesthetic)
    return true;
  });

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
    setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle };
}
