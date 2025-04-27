'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { 
  FiUser, FiLock, FiBell, FiCreditCard, FiSettings, 
  FiShield, FiGlobe, FiToggleRight, FiCheck, FiX 
} from 'react-icons/fi';
import FuturisticThemeToggle from '@/components/ui/FuturisticThemeToggle';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('cashminder_user');
    if (!userData) {
      router.push('/auth');
      return;
    }
    
    setIsLoggedIn(true);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Settings tabs
  const tabs = [
    { id: 'account', label: 'Account', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'payment', label: 'Payment Methods', icon: <FiCreditCard /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
    { id: 'privacy', label: 'Privacy', icon: <FiShield /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-xl ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-500 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="pb-5 border-b border-light-border dark:border-dark-border mb-8"
        variants={itemVariants}
      >
        <h1 className={`text-3xl font-bold leading-tight ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          Settings
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings navigation */}
        <motion.div 
          className="md:w-1/4"
          variants={itemVariants}
        >
          <nav className={`space-y-1 sticky top-20 ${
            isDark 
              ? 'bg-dark-surface border border-dark-border' 
              : 'bg-light-surface border border-light-border'
          } rounded-xl p-4`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${isDark 
                        ? 'bg-primary-900/40 border border-primary-800/50 text-dark-text-primary' 
                        : 'bg-primary-50 border border-primary-100 text-primary-700'}`
                    : `${isDark 
                        ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-border/50' 
                        : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-border/50'}`
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings content */}
        <motion.div 
          className="md:w-3/4"
          variants={itemVariants}
        >
          <div className={`rounded-xl border ${
            isDark 
              ? 'bg-dark-surface border-dark-border' 
              : 'bg-light-surface border-light-border shadow-sm'
          } p-6`}>
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                  Account Settings
                </h2>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Profile Picture
                    </label>
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                        isDark ? 'from-primary-600 to-secondary-700' : 'from-primary-500 to-secondary-600'
                      } flex items-center justify-center text-white text-2xl font-bold`}>
                        J
                      </div>
                      <div className="ml-5">
                        <button className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          isDark 
                            ? 'bg-dark-border hover:bg-dark-border/70 text-dark-text-primary' 
                            : 'bg-light-border hover:bg-light-border/70 text-light-text-primary'
                        }`}>
                          Change
                        </button>
                        <button className={`ml-3 px-3 py-2 rounded-lg text-sm font-medium ${
                          isDark 
                            ? 'bg-transparent hover:bg-dark-border/30 text-dark-text-secondary' 
                            : 'bg-transparent hover:bg-light-border/30 text-light-text-secondary'
                        }`}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Name
                    </label>
                    <input 
                      type="text" 
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-dark-background border-dark-border text-dark-text-primary' 
                          : 'bg-white border-light-border text-light-text-primary'
                      }`}
                      defaultValue="John Doe"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Email
                    </label>
                    <input 
                      type="email" 
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-dark-background border-dark-border text-dark-text-primary' 
                          : 'bg-white border-light-border text-light-text-primary'
                      }`}
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Currency
                    </label>
                    <select 
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-dark-background border-dark-border text-dark-text-primary' 
                          : 'bg-white border-light-border text-light-text-primary'
                      }`}
                    >
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>JPY - Japanese Yen</option>
                      <option>CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${
                      isDark
                        ? 'from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
                        : 'from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
                    } text-white shadow-md transition-all duration-200`}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                  Preferences
                </h2>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                          Theme
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                          Choose between light and dark mode
                        </p>
                      </div>
                      <FuturisticThemeToggle />
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                          Language
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                          Select your preferred language
                        </p>
                      </div>
                      <select 
                        className={`px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-dark-background border-dark-border text-dark-text-primary' 
                            : 'bg-white border-light-border text-light-text-primary'
                        }`}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                          Date Format
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                          Choose how dates are displayed
                        </p>
                      </div>
                      <select 
                        className={`px-3 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-dark-background border-dark-border text-dark-text-primary' 
                            : 'bg-white border-light-border text-light-text-primary'
                        }`}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                          Enable Animations
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                          Toggle UI animations on or off
                        </p>
                      </div>
                      <button className={`w-12 h-6 rounded-full flex items-center ${
                        true ? 'bg-primary-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      } transition-all duration-300`}>
                        <div className="w-5 h-5 rounded-full bg-white shadow-md transform translate-x-0.5"></div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${
                      isDark
                        ? 'from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
                        : 'from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
                    } text-white shadow-md transition-all duration-200`}>
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other tabs would be implemented similarly */}
            {activeTab !== 'account' && activeTab !== 'preferences' && (
              <div className="flex flex-col items-center justify-center py-12">
                <FiSettings className={`w-16 h-16 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'} mb-4`} />
                <h3 className={`text-xl font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h3>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} mt-2`}>
                  This section is under development
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
