'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FuturisticThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle the toggle click
  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    toggleTheme();

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return <div className="w-12 h-12" />;
  }

  const isDark = theme === 'dark';

  return (
    <motion.div
      className="relative w-12 h-12 flex items-center justify-center"
      initial={false}
      animate={{ scale: isAnimating ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={handleToggle}
        className={`w-12 h-12 rounded-full relative overflow-hidden flex items-center justify-center ${
          isDark
            ? 'bg-dark-card border border-dark-border shadow-inner'
            : 'bg-light-card border border-light-border shadow-md'
        } transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="dark-icon"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Moon with stars */}
              <div className="relative">
                <motion.div
                  className="w-6 h-6 rounded-full bg-gray-100"
                  animate={{
                    boxShadow: ["0 0 0px 0px rgba(255,255,255,0.5)", "0 0 10px 2px rgba(255,255,255,0.3)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-blue-200 top-0 right-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-blue-200 bottom-1 left-0"
                  animate={{ opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="light-icon"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Sun with rays */}
              <div className="relative">
                <motion.div
                  className="w-6 h-6 rounded-full bg-yellow-400"
                  animate={{
                    boxShadow: ["0 0 0px 0px rgba(250,204,21,0.5)", "0 0 10px 2px rgba(250,204,21,0.3)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                {/* Sun rays */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-2 bg-yellow-400"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-0.5px',
                      marginTop: '-1px',
                      transformOrigin: '50% 0',
                      transform: `rotate(${i * 45}deg) translateY(-5px)`
                    }}
                    animate={{
                      height: [2, 3, 2],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Animated background effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 rounded-full ${
              isDark ? 'bg-primary' : 'bg-primary'
            }`}
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
