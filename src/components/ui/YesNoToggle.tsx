'use client';

import { motion } from 'framer-motion';

interface YesNoToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function YesNoToggle({
  isEnabled,
  onToggle,
  size = 'md'
}: YesNoToggleProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      text: 'text-xs',
      padding: 'px-2 py-0.5',
      width: 'w-16'
    },
    md: {
      text: 'text-sm',
      padding: 'px-3 py-1',
      width: 'w-20'
    },
    lg: {
      text: 'text-base',
      padding: 'px-4 py-1.5',
      width: 'w-24'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex ${config.width} rounded-md overflow-hidden`}>
      <motion.button
        onClick={isEnabled ? onToggle : undefined}
        className={`flex-1 ${config.padding} ${config.text} font-medium transition-colors ${
          isEnabled 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
            : 'bg-error-light dark:bg-error-dark text-white'
        }`}
        whileHover={isEnabled ? { backgroundColor: '#e5e7eb' } : {}}
        whileTap={isEnabled ? { scale: 0.95 } : {}}
      >
        No
      </motion.button>
      <motion.button
        onClick={!isEnabled ? onToggle : undefined}
        className={`flex-1 ${config.padding} ${config.text} font-medium transition-colors ${
          !isEnabled 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
            : 'bg-success-light dark:bg-success-dark text-white'
        }`}
        whileHover={!isEnabled ? { backgroundColor: '#e5e7eb' } : {}}
        whileTap={!isEnabled ? { scale: 0.95 } : {}}
      >
        Yes
      </motion.button>
    </div>
  );
}
