import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { notifications, dismiss, clearAll } = useNotifications();
  const { settings } = useSettings();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const initials = (settings.userName || 'U').slice(0, 2).toUpperCase();

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const TYPE_ICON = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <nav className={styles.navbar}>
      {/* Brand */}
      <div className={styles.brand} onClick={() => navigate('/')}>
        <div className={styles.brandIcon}>⚡</div>
        <span className={styles.brandName}>Productivity Hub</span>
      </div>

      {/* Desktop nav tabs */}
      <div className={styles.navTabs}>
        <NavLink to="/"          className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}>Dashboard</NavLink>
        <NavLink to="/bookmarks" className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}>Bookmarks</NavLink>
        <NavLink to="/settings"  className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}>Settings</NavLink>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Notification bell */}
        <div className={styles.notifWrap} ref={panelRef}>
          <button
            className={styles.iconBtn}
            onClick={() => setPanelOpen(o => !o)}
            title="Notifications"
          >
            🔔
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>

          {panelOpen && (
            <div className={styles.notifPanel}>
              <div className={styles.notifHeader}>
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <button className={styles.clearBtn} onClick={() => { clearAll(); setPanelOpen(false); }}>
                    Clear all
                  </button>
                )}
              </div>
              <div className={styles.notifList}>
                {notifications.length === 0 ? (
                  <div className={styles.notifEmpty}>No notifications</div>
                ) : (
                  [...notifications].reverse().map(n => (
                    <div key={n.id} className={styles.notifItem} onClick={() => dismiss(n.id)}>
                      <span className={styles.notifIcon}>{TYPE_ICON[n.type] || 'ℹ️'}</span>
                      <div className={styles.notifBody}>
                        <div className={styles.notifTitle}>{n.title}</div>
                        <div className={styles.notifMsg}>{n.message}</div>
                      </div>
                      <span className={styles.notifTime}>{formatTime(n.time)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User avatar */}
        <div className={styles.avatar} title={settings.userName}>
          {initials}
        </div>
      </div>
    </nav>
  );
}
