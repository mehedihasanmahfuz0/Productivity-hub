import { useNotifications } from '../context/NotificationContext';
import styles from './NotificationToast.module.css';

const TYPE_ICON  = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function NotificationToast() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className={styles.container}>
      {notifications.map(n => (
        <div key={n.id} className={`${styles.toast} ${styles[n.type]}`}>
          <span className={styles.icon}>{TYPE_ICON[n.type] || 'ℹ️'}</span>
          <div className={styles.body}>
            <div className={styles.title}>{n.title}</div>
            <div className={styles.message}>{n.message}</div>
          </div>
          <button className={styles.close} onClick={() => dismiss(n.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
