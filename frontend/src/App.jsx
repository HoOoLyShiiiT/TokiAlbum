import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import EventGuestView from './pages/EventGuestView';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('knipsen_lang') || 'de');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('knipsen_dark_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('knipsen_dark_mode', darkMode.toString());
  }, [darkMode]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('knipsen_lang', newLang);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Route parser
  const eventGuestMatch = currentPath.match(/^\/event\/([a-zA-Z0-9]+)/);
  const adminMatch = currentPath.match(/^\/admin\/([a-zA-Z0-9]+)/);

  let pageContent;

  if (adminMatch) {
    const eventId = adminMatch[1];
    const params = new URLSearchParams(searchParams);
    const token = params.get('token') || '';
    pageContent = (
      <AdminDashboard
        eventId={eventId}
        token={token}
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLanguageChange={handleLanguageChange}
      />
    );
  } else if (eventGuestMatch) {
    const eventId = eventGuestMatch[1];
    pageContent = (
      <EventGuestView
        eventId={eventId}
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLanguageChange={handleLanguageChange}
      />
    );
  } else {
    pageContent = (
      <Home
        lang={lang}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1">
        {pageContent}
      </div>
      <Footer />
    </div>
  );
}
