'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiDollarSign, FiPieChart, FiTarget, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in using localStorage
    const user = localStorage.getItem('cashminder_user');
    setIsLoggedIn(!!user);
  }, []);

  const handleSignOut = () => {
    // Remove user from localStorage
    localStorage.removeItem('cashminder_user');
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Budgets', path: '/budgets', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Goals', path: '/goals', icon: <FiTarget className="w-5 h-5" /> },
  ];

  // Don't show navbar on auth pages or if not logged in
  if (pathname === '/' || pathname === '/auth/login' || pathname === '/auth/signup' || !isLoggedIn) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Cashminder</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive(item.path)
                      ? 'border-indigo-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
            >
              <FiLogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
          <div className="flex items-center -mr-2 sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 dark:text-gray-300 rounded-md hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block w-6 h-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 transition-colors duration-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 pl-3 pr-4 text-base font-medium border-l-4 ${
                  isActive(item.path)
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                    : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            ))}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <button
                onClick={handleSignOut}
                className="flex items-center py-2 pl-3 pr-4 text-base font-medium text-gray-600 dark:text-gray-300 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
