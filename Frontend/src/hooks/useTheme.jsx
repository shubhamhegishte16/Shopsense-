import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ─── ThemeContext ─────────────────────────────────────────────────────────────

const ThemeContext = createContext({ theme: 'Light', setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

const LS_KEY = 'shopsense_theme';
const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('shopsense_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// Apply theme to the document root immediately (no render lag)
function applyTheme(theme) {
  const resolved = theme === 'System'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light')
    : theme;
  document.documentElement.setAttribute('data-theme', resolved === 'Dark' ? 'dark' : '');
}

// ─── ThemeProvider ────────────────────────────────────────────────────────────

export function ThemeProvider({ children }) {
  // Read from localStorage first so there's no flicker on page load
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(LS_KEY) || 'Light';
  });

  // Apply on first render & whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Also listen for OS-level dark/light preference changes when theme = 'System'
  useEffect(() => {
    if (theme !== 'System') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('System');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Fetch actual theme from backend on mount (to sync across devices)
  useEffect(() => {
    const token = localStorage.getItem('shopsense_token');
    if (!token) return;
    fetch(`${API_BASE}/settings`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        const serverTheme = data?.settings?.general?.theme;
        if (serverTheme && serverTheme !== theme) {
          setThemeState(serverTheme);
          localStorage.setItem(LS_KEY, serverTheme);
        }
      })
      .catch(() => {}); // silent fail — localStorage value is still used
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(LS_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
