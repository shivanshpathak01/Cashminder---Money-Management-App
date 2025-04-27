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
    // Function to check user authentication status
    const checkAuth = () => {
      const userData = localStorage.getItem('cashminder_user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Check on initial load
    checkAuth();

    // Set up event listener for storage changes (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);

    // Set up custom event listener for auth changes within the same tab
    window.addEventListener('auth_state_changed', checkAuth);

    // Check auth status every 5 seconds to ensure UI is in sync
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth_state_changed', checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items based on authentication status
  const authenticatedNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Transactions', href: '/transactions', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Analytics', href: '/analytics', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Goals', href: '/goals', icon: <FiTarget className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const unauthenticatedNavItems: NavItem[] = [
    { name: 'Home', href: '/', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Features', href: '/#features', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Pricing', href: '/pricing', icon: <FiDollarSign className="w-5 h-5" /> },
  ];

  // Use the appropriate navigation items based on authentication status
  const navItems = user ? authenticatedNavItems : unauthenticatedNavItems;

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('cashminder_user');

    // Dispatch custom event to notify other components about auth state change
    window.dispatchEvent(new Event('auth_state_changed'));

    // Set user state to null
    setUser(null);

    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 ${
          isScrolled
            ? 'bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-light-border dark:border-dark-border shadow-sm'
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
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 shadow-md"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(0, 198, 255, 0.4)',
                      '0 0 15px rgba(0, 198, 255, 0.6)',
                      '0 0 0 rgba(0, 198, 255, 0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <motion.span
                    className="text-dark-bg font-bold text-xl"
                    animate={{
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    C
                  </motion.span>
                </motion.div>
                <span className="font-bold text-xl text-light-text-primary dark:text-dark-text-primary">
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
                          ? 'text-primary bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                          : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          layoutId="navbar-indicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          style={{
                            boxShadow: '0 0 8px rgba(0, 198, 255, 0.6)'
                          }}
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
                <div className="relative flex items-center space-x-3">
                  {/* User greeting - only visible on desktop */}
                  <span className="hidden md:block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                    Hello, {user.name || 'User'}
                  </span>

                  {/* Logout button */}
                  <motion.button
                    className="flex items-center space-x-2 px-3 py-2 rounded-full bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border transition-all duration-200"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "var(--card-shadow)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">Logout</span>
                  </motion.button>
                </div>
              ) : (
                <Link href="/auth">
                  <motion.button
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary hover:bg-primary-400 text-dark-bg transition-all duration-200 shadow-md"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "var(--glow-primary)"
                    }}
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
                      ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface'
                      : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-border'
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
              className="md:hidden bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border shadow-lg glass-card"
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
                      className={`px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                        isActive
                          ? 'text-primary bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30'
                          : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary hover:bg-light-accent dark:hover:bg-dark-accent'
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
