import { useBookmarks } from '../context/BookmarkContext';
import styles from './BookmarkCard.module.css';

export default function BookmarkCard({ bookmark }) {
  const { deleteBookmark } = useBookmarks();
  const { id, title, url, desc, tag, emoji, color } = bookmark;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.favicon} style={{ background: color + '22' }}>
          {emoji}
        </div>
        <div className={styles.titleWrap}>
          <div className={styles.title}>{title}</div>
          <a href={url} target="_blank" rel="noopener noreferrer" className={styles.url}>
            {url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </div>

      {desc && <p className={styles.desc}>{desc}</p>}

      <div className={styles.footer}>
        <span className={styles.tag} style={{ background: color + '22', color }}>
          {emoji} {tag}
        </span>
        <div className={styles.actions}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.actionBtn}
            title="Open link"
          >
            🔗
          </a>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => deleteBookmark(id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
