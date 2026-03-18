import { NavLink } from 'react-router-dom';
import styles from './MobileNav.module.css';

const TABS = [
  { to: '/',          icon: '🏠', label: 'Home'      },
  { to: '/bookmarks', icon: '🔖', label: 'Bookmarks' },
  { to: '/settings',  icon: '⚙️', label: 'Settings'  },
];

export default function MobileNav() {
  return (
    <nav className={styles.nav}>
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
