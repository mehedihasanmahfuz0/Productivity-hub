import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showNotification = useCallback((title, message, type = 'info') => {
    if (!enabled) return;
    const id = Date.now() + Math.random();
    const newNotif = { id, title, message, type, time: new Date() };

    setNotifications(prev => [...prev, newNotif]);

    // Auto-dismiss after 4 s
    timersRef.current[id] = setTimeout(() => dismiss(id), 4000);
  }, [enabled, dismiss]);

  const clearAll = useCallback(() => {
    // Clear all timers
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      dismiss,
      clearAll,
      enabled,
      setEnabled,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};
