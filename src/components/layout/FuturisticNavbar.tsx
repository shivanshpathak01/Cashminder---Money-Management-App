'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import FuturisticThemeToggle from '../ui/FuturisticThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import {
  FiHome, FiPieChart, FiDollarSign, FiTarget,
  FiSettings, FiUser, FiMenu, FiX, FiLogOut
} from 'react-icons/fi';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function FuturisticNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('cashminder_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Transactions', href: '/transactions', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Goals', href: '/goals', icon: <FiTarget className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('cashminder_user');
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled
            ? `${isDark ? 'bg-gray-900/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md shadow-sm'}`
            : 'bg-transparent'
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-lg ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center mr-2`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-white font-bold text-xl"
                    animate={{
                      textShadow: [
                        '0 0 5px rgba(255,255,255,0.5)',
                        '0 0 10px rgba(255,255,255,0.8)',
                        '0 0 5px rgba(255,255,255,0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    C
                  </motion.span>
                </motion.div>
                <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Cashminder
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-all duration-200 ${
                        isActive
                          ? `${isDark ? 'text-white bg-indigo-900/40' : 'text-indigo-700 bg-indigo-50'}`
                          : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                          layoutId="navbar-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <FuturisticThemeToggle />

              {/* User Menu or Login Button */}
              {user ? (
                <div className="relative">
                  <motion.button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                      isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <Link href="/auth">
                  <motion.button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                      isDark
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    } transition-colors duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="text-sm font-medium">Login</span>
                  </motion.button>
                </Link>
              )}

              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <motion.button
                  className={`inline-flex items-center justify-center p-2 rounded-md ${
                    isDark
                      ? 'text-gray-200 hover:text-white hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <FiX className="block h-6 w-6" />
                  ) : (
                    <FiMenu className="block h-6 w-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                        isActive
                          ? `${isDark ? 'text-white bg-indigo-900' : 'text-indigo-700 bg-indigo-50'}`
                          : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-16"></div>
    </>
  );
}
