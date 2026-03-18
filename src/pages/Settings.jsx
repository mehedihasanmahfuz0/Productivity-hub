import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useSettings } from '../context/SettingsContext';
import { useBookmarks } from '../context/BookmarkContext';
import styles from './Settings.module.css';

const TABS = [
  { id: 'appearance',    label: '🎨 Appearance'    },
  { id: 'notifications', label: '🔔 Notifications'  },
  { id: 'profile',       label: '👤 Profile'        },
  { id: 'about',         label: 'ℹ️ About'          },
];

const ACCENTS = [
  { color: '#d4622a', name: 'Terracotta' },
  { color: '#2a6dd4', name: 'Ocean'      },
  { color: '#8b2ad4', name: 'Violet'     },
  { color: '#2a8c5a', name: 'Forest'     },
  { color: '#c8932a', name: 'Amber'      },
];

export default function Settings() {
  const { isDark, toggleTheme, accentColor, changeAccent } = useTheme();
  const { notifications, showNotification, enabled: notifEnabled, setEnabled } = useNotifications();
  const { settings, updateSetting, FONT_SIZES } = useSettings();
  const { totalCount } = useBookmarks();

  const [activeTab, setActiveTab] = useState('appearance');

  function handleNameSave(e) {
    const val = e.target.value;
    updateSetting('userName', val);
  }

  function handleFontSize(size) {
    updateSetting('fontSize', size);
    showNotification('Font Updated', `Base size set to ${FONT_SIZES[size]}.`, 'info');
  }

  function handleAccent(color) {
    changeAccent(color);
    showNotification('Accent Changed 🎨', 'New color applied across the app.', 'success');
  }

  function handleNotifToggle(val) {
    setEnabled(val);
    updateSetting('notificationsEnabled', val);
    if (val) showNotification('Notifications On 🔔', 'You will receive notifications.', 'success');
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings <span className={styles.accent}>⚙️</span></h1>
        <p className={styles.sub}>Customize your Productivity Hub experience</p>
      </div>

      <div className={styles.layout}>

        {/* Sidebar nav */}
        <nav className={styles.sideNav}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className={styles.content}>

          {/* ── APPEARANCE ─────────────────────────────── */}
          {activeTab === 'appearance' && (
            <>
              <Section title="THEME — ThemeContext">
                <Row
                  label="Dark Mode"
                  desc="Toggle between light and dark interface globally."
                >
                  <Toggle checked={isDark} onChange={toggleTheme} />
                </Row>
                <Row
                  label="Accent Color"
                  desc="Changes the primary color across the entire app via CSS variables."
                >
                  <div className={styles.swatches}>
                    {ACCENTS.map(a => (
                      <button
                        key={a.color}
                        className={`${styles.swatch} ${accentColor === a.color ? styles.swatchActive : ''}`}
                        style={{ background: a.color }}
                        title={a.name}
                        onClick={() => handleAccent(a.color)}
                      />
                    ))}
                  </div>
                </Row>
              </Section>

              <Section title="TYPOGRAPHY — SettingsContext">
                <Row
                  label="Font Size"
                  desc="Adjust the base font size. SettingsContext stores and applies it globally."
                >
                  <div className={styles.fontRow}>
                    {Object.keys(FONT_SIZES).map(sz => (
                      <button
                        key={sz}
                        className={`${styles.fontBtn} ${settings.fontSize === sz ? styles.fontBtnActive : ''}`}
                        onClick={() => handleFontSize(sz)}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </Row>
              </Section>
            </>
          )}

          {/* ── NOTIFICATIONS ──────────────────────────── */}
          {activeTab === 'notifications' && (
            <>
              <Section title="NOTIFICATIONS — NotificationContext">
                <Row
                  label="Enable Notifications"
                  desc="Show toast alerts when actions are performed anywhere in the app."
                >
                  <Toggle checked={notifEnabled} onChange={handleNotifToggle} />
                </Row>
                <Row
                  label="Auto-dismiss"
                  desc="Automatically hide toasts after 4 seconds."
                >
                  <Toggle
                    checked={settings.autoDismiss ?? true}
                    onChange={v => updateSetting('autoDismiss', v)}
                  />
                </Row>
              </Section>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['success','info','warning','error'].map(type => (
                  <button
                    key={type}
                    className={styles.testBtn}
                    onClick={() => showNotification(
                      `Test ${type}`,
                      `This is a ${type} notification.`,
                      type
                    )}
                  >
                    Test {type}
                  </button>
                ))}
              </div>

              {notifications.length > 0 && (
                <Section title="CURRENT QUEUE" style={{ marginTop: '1.2rem' }}>
                  {notifications.map(n => (
                    <Row key={n.id} label={n.title} desc={n.message}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </Row>
                  ))}
                </Section>
              )}
            </>
          )}

          {/* ── PROFILE ────────────────────────────────── */}
          {activeTab === 'profile' && (
            <Section title="PROFILE — SettingsContext">
              <Row
                label="Display Name"
                desc="Shown in the Dashboard greeting. SettingsContext stores this."
              >
                <input
                  className={styles.textInput}
                  defaultValue={settings.userName}
                  onBlur={handleNameSave}
                  onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                  placeholder="Your name"
                />
              </Row>
              <Row label="Language" desc="Interface language preference.">
                <select
                  className={styles.textInput}
                  defaultValue={settings.language}
                  onChange={e => updateSetting('language', e.target.value)}
                >
                  {['English','Bengali','Spanish','French','German','Japanese'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Row>
            </Section>
          )}

          {/* ── ABOUT ──────────────────────────────────── */}
          {activeTab === 'about' && (
            <Section title="ABOUT THIS APP">
              <div className={styles.aboutContent}>
                <p>
                  <strong>Productivity Hub</strong> demonstrates React's Context API pattern using 4 independent but interconnected contexts.
                </p>
                <div className={styles.contextCards}>
                  {[
                    { name: 'ThemeContext',        color: 'var(--accent)',  desc: 'Controls dark/light mode globally. Persists to localStorage via useEffect.' },
                    { name: 'NotificationContext', color: 'var(--accent2)', desc: 'Manages toast queue. Any context or component can call showNotification().' },
                    { name: 'BookmarkContext',     color: 'var(--success)', desc: 'Stores bookmarks array. CRUD operations re-render every subscribed component.' },
                    { name: 'SettingsContext',     color: 'var(--warning)', desc: 'User preferences: name, font, language. Applied globally via useEffect.' },
                  ].map(c => (
                    <div key={c.name} className={styles.contextCard}>
                      <div className={styles.contextDot} style={{ background: c.color }} />
                      <div>
                        <strong>{c.name}</strong>
                        <p>{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.statsGrid}>
                  <div className={styles.statPill}>🔖 {totalCount} bookmarks</div>
                  <div className={styles.statPill}>🔔 {notifications.length} queued</div>
                  <div className={styles.statPill}>🎨 {isDark ? 'Dark' : 'Light'} mode</div>
                  <div className={styles.statPill}>👤 {settings.userName}</div>
                </div>
                <p className={styles.version}>Version 1.0.0 — Built with React 18 + Vite 5</p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Reusable sub-components (Settings-specific) ─────────── */

function Section({ title, children, style }) {
  return (
    <div className={styles.section} style={style}>
      <div className={styles.sectionHeader}>{title}</div>
      {children}
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowInfo}>
        <div className={styles.rowLabel}>{label}</div>
        {desc && <div className={styles.rowDesc}>{desc}</div>}
      </div>
      <div className={styles.rowControl}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className={styles.toggleSlider} />
    </label>
  );
}
