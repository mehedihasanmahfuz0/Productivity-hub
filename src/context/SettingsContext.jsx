import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const DEFAULTS = {
  userName:              'User',
  fontSize:              'md',   // sm | md | lg
  notificationsEnabled:  true,
  autoDismiss:           true,
  language:              'English',
};

const FONT_SIZES = { sm: '14px', md: '16px', lg: '18px' };

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ph-settings');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Apply font size to root whenever it changes
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[settings.fontSize] || '16px';
  }, [settings.fontSize]);

  // Persist on change
  useEffect(() => {
    localStorage.setItem('ph-settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, FONT_SIZES }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
};
