'use client';

import FuturisticAuthForm from '@/components/auth/FuturisticAuthForm';
import { motion } from 'framer-motion';
import {
  FiDollarSign, FiPieChart, FiBarChart2, FiTrendingUp,
  FiCreditCard, FiTarget, FiActivity, FiShield
} from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

export default function AuthPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Financial icons with their positions and animations
  const floatingIcons = [
    { Icon: FiDollarSign, x: '10%', y: '20%', size: 24, delay: 0 },
    { Icon: FiPieChart, x: '85%', y: '15%', size: 28, delay: 0.5 },
    { Icon: FiBarChart2, x: '75%', y: '75%', size: 32, delay: 1 },
    { Icon: FiTrendingUp, x: '15%', y: '85%', size: 26, delay: 1.5 },
    { Icon: FiCreditCard, x: '80%', y: '40%', size: 22, delay: 2 },
    { Icon: FiTarget, x: '20%', y: '50%', size: 30, delay: 2.5 },
    { Icon: FiActivity, x: '40%', y: '10%', size: 20, delay: 3 },
    { Icon: FiShield, x: '60%', y: '90%', size: 24, delay: 3.5 }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20"></div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>

      {/* Floating financial icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute z-0"
          style={{
            left: item.x,
            top: item.y,
            opacity: 0
          }}
          animate={{
            y: [0, -15, 0, 15, 0],
            opacity: isDark ? 0.3 : 0.15,
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{
            y: {
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: {
              duration: 0.8,
              delay: item.delay
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <item.Icon
            size={item.size}
            className={isDark ? "text-indigo-400" : "text-indigo-500"}
          />
        </motion.div>
      ))}

      {/* Auth form */}
      <div className="w-full max-w-md relative z-10">
        <FuturisticAuthForm />
      </div>
    </div>
  );
}
