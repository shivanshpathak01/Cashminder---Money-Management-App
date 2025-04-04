'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start with light theme to match server rendering
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Only run once the component is mounted on the client
  useEffect(() => {
    // Mark as mounted first to prevent any flashes
    setMounted(true);

    // Use requestAnimationFrame to ensure this runs after hydration
    requestAnimationFrame(() => {
      try {
        // Check if dark mode is already applied to the document
        const isDarkModeApplied = document.documentElement.classList.contains('dark');

        // First check localStorage
        const storedTheme = localStorage.getItem('theme') as Theme | null;

        if (storedTheme === 'dark') {
          setTheme('dark');
        } else if (storedTheme === 'light') {
          setTheme('light');
        } else if (isDarkModeApplied) {
          // If dark mode is already applied but not in localStorage, keep it
          setTheme('dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        }
        // Otherwise keep the default light theme
      } catch (error) {
        console.error('Error initializing theme:', error);
      }
    });
  }, []);

  // Update document when theme changes, but only after mounting
  useEffect(() => {
    if (!mounted) return;

    try {
      // Use requestAnimationFrame to ensure DOM updates happen in the next frame
      requestAnimationFrame(() => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Save theme preference to localStorage
        localStorage.setItem('theme', theme);
      });
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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
