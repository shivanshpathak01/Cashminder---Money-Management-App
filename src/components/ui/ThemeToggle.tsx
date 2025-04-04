'use client';

import { useTheme } from '@/context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Add client-side only state to track if component is mounted
  const [mounted, setMounted] = useState(false);

  // Only show the toggle after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    toggleTheme();
  };

  // Don't render anything until after hydration to avoid mismatch
  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder with same size
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
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
