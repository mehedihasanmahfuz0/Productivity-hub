import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

const BookmarkContext = createContext(null);

const TAG_META = {
  work:     { emoji: '💼', color: '#2a6dd4' },
  learning: { emoji: '📚', color: '#8b2ad4' },
  design:   { emoji: '🎨', color: '#d4622a' },
  tools:    { emoji: '🛠️', color: '#2a8c5a' },
  other:    { emoji: '📌', color: '#c8932a' },
};

const SEED_BOOKMARKS = [
  { title: 'React Documentation',  url: 'https://react.dev',                  desc: 'Official React docs — your best friend', tag: 'learning' },
  { title: 'MDN Web Docs',         url: 'https://developer.mozilla.org',       desc: 'Complete web development reference',     tag: 'learning' },
  { title: 'Figma',                url: 'https://figma.com',                   desc: 'Collaborative design tool',              tag: 'design'   },
  { title: 'GitHub',               url: 'https://github.com',                  desc: 'Code hosting & version control',         tag: 'work'     },
  { title: 'Tailwind CSS',         url: 'https://tailwindcss.com',             desc: 'Utility-first CSS framework',            tag: 'tools'    },
  { title: 'Vite',                 url: 'https://vitejs.dev',                  desc: 'Next-gen frontend build tool',           tag: 'tools'    },
];

function buildBookmark(data) {
  const meta = TAG_META[data.tag] || TAG_META.other;
  return {
    ...data,
    id:        Date.now() + Math.random(),
    emoji:     meta.emoji,
    color:     meta.color,
    url:       data.url.startsWith('http') ? data.url : 'https://' + data.url,
    createdAt: new Date().toISOString(),
  };
}

export function BookmarkProvider({ children }) {
  const { showNotification } = useNotifications();

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('ph-bookmarks');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    // Seed on first visit
    return SEED_BOOKMARKS.map((b, i) => ({
      ...buildBookmark(b),
      id: i + 1, // stable IDs for seeds
    }));
  });

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('ph-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((data) => {
    const bm = buildBookmark(data);
    setBookmarks(prev => [bm, ...prev]);
    showNotification('Bookmark Added 🔖', `"${data.title}" saved successfully.`, 'success');
  }, [showNotification]);

  const deleteBookmark = useCallback((id) => {
    setBookmarks(prev => {
      const bm = prev.find(b => b.id === id);
      showNotification('Removed', `"${bm?.title}" was deleted.`, 'warning');
      return prev.filter(b => b.id !== id);
    });
  }, [showNotification]);

  const getByTag = useCallback((tag) =>
    tag === 'all' ? bookmarks : bookmarks.filter(b => b.tag === tag),
  [bookmarks]);

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      addBookmark,
      deleteBookmark,
      getByTag,
      tagMeta: TAG_META,
      totalCount: bookmarks.length,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used inside BookmarkProvider');
  return ctx;
};
