'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Ambil preferensi dari localStorage
    const savedTheme = localStorage.getItem('theme');
    // 2. Cek preferensi sistem
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 3. Tentukan tema awal
    const initialTheme = savedTheme ? savedTheme === 'dark' : systemDark;
    
    setIsDark(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    // 4. Simpan ke localStorage sebagai string 'dark'/'light'
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className="hidden md:block">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {isDark ? '🌞' : '🌙'}
      </button>
    </div>
  );
}