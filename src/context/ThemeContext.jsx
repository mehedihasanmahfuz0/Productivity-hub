import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('ph-theme') === 'dark';
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('ph-accent') || '#d4622a';
  });

  const toggleTheme = () => setIsDark(prev => !prev);

  const changeAccent = (color) => {
    setAccentColor(color);
    localStorage.setItem('ph-accent', color);
    document.documentElement.style.setProperty('--accent', color);
    // Derive a soft version by appending opacity
    document.documentElement.style.setProperty('--accent-soft', color + '1e');
  };

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('ph-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Apply saved accent on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-soft', accentColor + '1e');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, accentColor, changeAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
