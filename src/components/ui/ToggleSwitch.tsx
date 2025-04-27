'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function ToggleSwitch({
  isEnabled,
  onToggle,
  size = 'md'
}: ToggleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    onToggle();

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Size configurations - significantly reduced sizes
  const sizeConfig = {
    sm: {
      width: 'w-7',
      height: 'h-3.5',
      circle: 'w-2.5 h-2.5',
      translate: 'translate-x-3.5'
    },
    md: {
      width: 'w-9',
      height: 'h-5',
      circle: 'w-3.5 h-3.5',
      translate: 'translate-x-4.5'
    },
    lg: {
      width: 'w-12',
      height: 'h-6',
      circle: 'w-4.5 h-4.5',
      translate: 'translate-x-6.5'
    }
  };

  const config = sizeConfig[size];

  return (
    <motion.button
      onClick={handleToggle}
      className={`${config.width} ${config.height} rounded-full flex items-center ${
        isEnabled
          ? 'bg-primary justify-end'
          : 'bg-gray-300 dark:bg-gray-600 justify-start'
      } transition-all duration-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-checked={isEnabled}
      role="switch"
    >
      <motion.div
        className={`${config.circle} rounded-full bg-white shadow-md transform ${
          isEnabled ? config.translate : 'translate-x-0.5'
        } transition-transform duration-300`}
        layout
      />
    </motion.button>
  );
}
