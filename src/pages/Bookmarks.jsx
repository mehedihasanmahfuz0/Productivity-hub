import { useState, useMemo } from 'react';
import { useBookmarks } from '../context/BookmarkContext';
import { useNotifications } from '../context/NotificationContext';
import BookmarkCard from '../components/BookmarkCard';
import styles from './Bookmarks.module.css';

const TAGS = ['all', 'work', 'learning', 'design', 'tools', 'other'];
const TAG_LABEL = { all: 'All', work: '💼 Work', learning: '📚 Learning', design: '🎨 Design', tools: '🛠️ Tools', other: '📌 Other' };

export default function Bookmarks() {
  const { bookmarks, addBookmark, totalCount, tagMeta } = useBookmarks();
  const { showNotification } = useNotifications();

  const [activeTag, setActiveTag]   = useState('all');
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);

  // Form state
  const [form, setForm] = useState({ title: '', url: '', desc: '', tag: 'work' });
  const [errors, setErrors] = useState({});

  /* Filtered list — derived, no extra state */
  const filtered = useMemo(() => {
    let list = activeTag === 'all' ? bookmarks : bookmarks.filter(b => b.tag === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.desc?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookmarks, activeTag, search]);

  /* Tag counts */
  const tagCounts = useMemo(() => {
    const counts = { all: bookmarks.length };
    TAGS.slice(1).forEach(t => { counts[t] = bookmarks.filter(b => b.tag === t).length; });
    return counts;
  }, [bookmarks]);

  /* Form handlers */
  function handleFormChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.url.trim())   errs.url   = 'URL is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addBookmark(form);
    setForm({ title: '', url: '', desc: '', tag: 'work' });
    setErrors({});
    setModalOpen(false);
  }

  function openModal() {
    setForm({ title: '', url: '', desc: '', tag: 'work' });
    setErrors({});
    setModalOpen(true);
  }

  return (
    <div className={`${styles.page} page-enter`}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My <span className={styles.accent}>Bookmarks</span></h1>
          <p className={styles.sub}>{totalCount} saved link{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search bookmarks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <button className={styles.addBtn} onClick={openModal}>➕ Add Bookmark</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterRow}>
        {TAGS.map(t => (
          <button
            key={t}
            className={`${styles.filterTab} ${activeTag === t ? styles.filterTabActive : ''}`}
            onClick={() => setActiveTag(t)}
          >
            {TAG_LABEL[t]}
            <span className={styles.filterCount}>{tagCounts[t] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔖</div>
          <div className={styles.emptyTitle}>
            {search ? 'No results found' : 'No bookmarks here'}
          </div>
          <div className={styles.emptyDesc}>
            {search ? `No bookmarks match "${search}"` : 'Add your first bookmark using the button above!'}
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(bm => <BookmarkCard key={bm.id} bookmark={bm} />)}
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>➕ Add Bookmark</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. React Documentation"
                  autoFocus
                />
                {errors.title && <span className={styles.errorMsg}>{errors.title}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>URL *</label>
                <input
                  className={`${styles.input} ${errors.url ? styles.inputError : ''}`}
                  name="url"
                  value={form.url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
                {errors.url && <span className={styles.errorMsg}>{errors.url}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <input
                  className={styles.input}
                  name="desc"
                  value={form.desc}
                  onChange={handleFormChange}
                  placeholder="What is this link about?"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} name="tag" value={form.tag} onChange={handleFormChange}>
                  <option value="work">💼 Work</option>
                  <option value="learning">📚 Learning</option>
                  <option value="design">🎨 Design</option>
                  <option value="tools">🛠️ Tools</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Save Bookmark</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
