import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useSettings } from '../context/SettingsContext';
import styles from './Dashboard.module.css';

/* ── Clock hook ───────────────────────────────────────────── */
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* ── Greeting helper ──────────────────────────────────────── */
function greeting(h) {
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function Dashboard() {
  const { isDark, toggleTheme } = useTheme();
  const { notifications, showNotification } = useNotifications();
  const { bookmarks, totalCount } = useBookmarks();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const now = useClock();

  /* Welcome toast on first mount */
  useEffect(() => {
    const t = setTimeout(() =>
      showNotification('Welcome back! 👋', 'All 4 contexts are loaded and running.', 'success'),
    600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recent = bookmarks.slice(0, 4);

  const CONTEXTS = [
    { name: 'ThemeContext',       color: 'var(--accent)'  },
    { name: 'NotificationContext',color: 'var(--accent2)' },
    { name: 'BookmarkContext',    color: 'var(--success)' },
    { name: 'SettingsContext',    color: 'var(--warning)' },
  ];

  return (
    <div className={`${styles.page} page-enter`}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.greeting}>
          Good <span className={styles.accent}>{greeting(now.getHours())}</span>,<br />
          {settings.userName} 👋
        </h1>
        <p className={styles.subtitle}>Here's what's happening in your workspace today.</p>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard} style={{ '--dot': 'var(--accent)' }}>
          <span className={styles.statIcon}>🔖</span>
          <span className={styles.statLabel}>Bookmarks</span>
          <span className={styles.statValue}>{totalCount}</span>
          <span className={styles.statSub}>saved links</span>
        </div>
        <div className={styles.statCard} style={{ '--dot': 'var(--accent2)' }}>
          <span className={styles.statIcon}>🔔</span>
          <span className={styles.statLabel}>Notifications</span>
          <span className={styles.statValue}>{notifications.length}</span>
          <span className={styles.statSub}>in queue</span>
        </div>
        <div className={styles.statCard} style={{ '--dot': 'var(--success)' }}>
          <span className={styles.statIcon}>🧠</span>
          <span className={styles.statLabel}>Active Contexts</span>
          <span className={styles.statValue}>4</span>
          <span className={styles.statSub}>all running</span>
        </div>
        <div className={styles.statCard} style={{ '--dot': 'var(--warning)' }}>
          <span className={styles.statIcon}>🎨</span>
          <span className={styles.statLabel}>Theme</span>
          <span className={styles.statValue} style={{ fontSize: '1.3rem', marginTop: 6 }}>
            {isDark ? 'Dark 🌙' : 'Light ☀️'}
          </span>
          <span className={styles.statSub}>via ThemeContext</span>
        </div>
      </div>

      {/* Main grid */}
      <div className={styles.grid}>

        {/* LEFT */}
        <div className={styles.left}>

          {/* Quick actions */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>⚡</span> Quick Actions
            </div>
            <div className={styles.quickGrid}>
              {[
                { icon: '➕', label: 'Add Bookmark',      action: () => navigate('/bookmarks') },
                { icon: '🔔', label: 'Test Notification',  action: () => showNotification('Test 🔔', 'Notification system works!', 'info') },
                { icon: '🎨', label: 'Toggle Theme',       action: toggleTheme },
                { icon: '⚙️', label: 'Open Settings',      action: () => navigate('/settings') },
              ].map(btn => (
                <button key={btn.label} className={styles.actionBtn} onClick={btn.action}>
                  <span>{btn.icon}</span> {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context status */}
          <div className={styles.card}>
            <div className={styles.cardTitle}><span>🧠</span> Active Contexts</div>
            <div className={styles.contextList}>
              {CONTEXTS.map(ctx => (
                <div key={ctx.name} className={styles.contextRow}>
                  <div className={styles.contextDot} style={{ background: ctx.color }} />
                  <span className={styles.contextName}>{ctx.name}</span>
                  <span className={styles.contextBadge}>● Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className={styles.sidebar}>

          {/* Clock */}
          <div className={styles.clockCard}>
            <div className={styles.clockTime}>
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className={styles.clockDate}>
              {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Recent bookmarks */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>🔖</span> Recent Bookmarks
              <button className={styles.seeAll} onClick={() => navigate('/bookmarks')}>See all</button>
            </div>
            {recent.length === 0 ? (
              <p className={styles.empty}>No bookmarks yet. Add some!</p>
            ) : (
              <div className={styles.recentList}>
                {recent.map(bm => (
                  <a
                    key={bm.id}
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.recentItem}
                  >
                    <div className={styles.recentIcon} style={{ background: bm.color + '22' }}>
                      {bm.emoji}
                    </div>
                    <div className={styles.recentInfo}>
                      <div className={styles.recentTitle}>{bm.title}</div>
                      <div className={styles.recentTag}>{bm.tag}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
