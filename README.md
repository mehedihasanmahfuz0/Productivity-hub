# ⚡ Productivity Hub

A React app demonstrating **multiple Context API patterns**, **global state architecture**, and **scalable component design**.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
src/
├── context/
│   ├── ThemeContext.jsx        → dark/light mode, accent color
│   ├── NotificationContext.jsx → toast queue, auto-dismiss
│   ├── BookmarkContext.jsx     → bookmark CRUD, localStorage
│   └── SettingsContext.jsx     → user prefs (name, font, language)
│
├── components/
│   ├── Navbar.jsx              → sticky nav, notification panel
│   ├── Navbar.module.css
│   ├── NotificationToast.jsx   → floating toast renderer
│   ├── NotificationToast.module.css
│   ├── BookmarkCard.jsx        → single bookmark card
│   ├── BookmarkCard.module.css
│   ├── MobileNav.jsx           → bottom tab bar on mobile
│   └── MobileNav.module.css
│
├── pages/
│   ├── Dashboard.jsx           → home: stats, quick actions, clock
│   ├── Dashboard.module.css
│   ├── Bookmarks.jsx           → CRUD page: add/search/filter/delete
│   ├── Bookmarks.module.css
│   ├── Settings.jsx            → theme, notifications, profile
│   └── Settings.module.css
│
├── App.jsx                     → root: wraps all providers + router
├── main.jsx                    → ReactDOM entry point
└── index.css                   → design system (CSS variables)
```

---

## 🧠 Context Architecture

### How contexts talk to each other

```
BookmarkContext
  └── calls useNotifications()   ← cross-context communication
      └── showNotification() triggers a toast in any component

ThemeContext
  └── applies CSS class to <body>  ← affects entire app instantly

SettingsContext
  └── applies font-size to <html> via useEffect
```

### The Provider wrapping order in App.jsx

```jsx
<ThemeProvider>           // no deps — wraps everything
  <NotificationProvider>  // no deps
    <BookmarkProvider>    // uses NotificationContext inside
      <SettingsProvider>  // no deps
        <App />
      </SettingsProvider>
    </BookmarkProvider>
  </NotificationProvider>
</ThemeProvider>
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut      | Action              |
|---------------|---------------------|
| `Ctrl/⌘ + K`  | Open add bookmark   |
| `Escape`      | Close modal / panel |

---

## 🛠 Build for Production

```bash
npm run build
npm run preview
```
