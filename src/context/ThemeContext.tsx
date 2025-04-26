'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // This effect runs on client-side only
    try {
      // Check local storage first
      const savedTheme = localStorage.getItem('theme') as Theme;
      let themeToApply: Theme;

      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        themeToApply = savedTheme;
      } else {
        // If no saved theme, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToApply = prefersDark ? 'dark' : 'light';
        // Save the initial theme preference
        localStorage.setItem('theme', themeToApply);
      }

      // Update state
      setTheme(themeToApply);

      // Apply theme to DOM
      if (themeToApply === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        console.log('Dark mode initialized');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        console.log('Light mode initialized');
      }

      console.log('Theme initialized to:', themeToApply);
      console.log('Dark class present:', document.documentElement.classList.contains('dark'));
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);

      // Force toggle the dark class on the html element
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        console.log('Dark mode enabled');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        console.log('Light mode enabled');
      }

      // Save to localStorage
      localStorage.setItem('theme', newTheme);

      // Log the current state for debugging
      console.log('Theme toggled to:', newTheme);
      console.log('Dark class present:', document.documentElement.classList.contains('dark'));
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
