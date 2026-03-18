import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider }        from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { BookmarkProvider }     from './context/BookmarkContext';
import { SettingsProvider }     from './context/SettingsContext';
import Navbar            from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import MobileNav         from './components/MobileNav';
import Dashboard         from './pages/Dashboard';
import Bookmarks         from './pages/Bookmarks';
import Settings          from './pages/Settings';

/*
  Provider order matters:
  - ThemeProvider        → outermost, no dependencies
  - NotificationProvider → depends on nothing
  - BookmarkProvider     → calls useNotifications() inside
  - SettingsProvider     → reads nothing from the others
*/
export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BookmarkProvider>
          <SettingsProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/"          element={<Dashboard />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/settings"  element={<Settings />}  />
              </Routes>
              <NotificationToast />
              <MobileNav />
            </BrowserRouter>
          </SettingsProvider>
        </BookmarkProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
