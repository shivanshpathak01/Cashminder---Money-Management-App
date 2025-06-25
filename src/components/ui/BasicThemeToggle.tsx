'use client';

import { useTheme } from '@/context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function BasicThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle the toggle click
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      toggleTheme();
      // Force apply the theme change
      const newTheme = theme === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      console.log('Theme toggle clicked, new theme:', newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <motion.button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`p-2 rounded-full ${
        theme === 'light'
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
      } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </motion.button>
  );
}
