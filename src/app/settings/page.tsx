'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import {
  FiUser, FiLock, FiBell, FiCreditCard, FiSettings,
  FiShield, FiGlobe, FiToggleRight, FiCheck, FiX,
  FiAlertTriangle, FiMail, FiSmartphone, FiDollarSign,
  FiChevronDown
} from 'react-icons/fi';
import FuturisticThemeToggle from '@/components/ui/FuturisticThemeToggle';
import YesNoToggle from '@/components/ui/YesNoToggle';
import {
  UserSettings,
  defaultUserSettings,
  getUserSettings,
  updateUserSettings,
  getInitials,
  getCurrentUser
} from '@/lib/userSettings';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [enableAnimations, setEnableAnimations] = useState(true);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState<'immediate' | 'daily' | 'weekly'>('immediate');

  // Notification types
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [billReminders, setBillReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    setUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);

    // Load user settings
    const settings = getUserSettings(user.id);
    setUserSettings(settings);

    // Initialize form state
    setName(settings.name);
    setEmail(settings.email);
    setCurrency(settings.currency);
    setLanguage(settings.language);
    setDateFormat(settings.dateFormat);
    setEnableAnimations(settings.enableAnimations);

    // Initialize notification preferences with safety checks
    try {
      // Notification channels
      setEmailNotifications(settings.notificationPreferences?.email ?? true);
      setPushNotifications(settings.notificationPreferences?.push ?? true);
      setSmsNotifications(settings.notificationPreferences?.sms ?? false);
      setNotificationFrequency(settings.notificationPreferences?.frequency ?? 'immediate');

      // Notification types
      const types = settings.notificationPreferences?.types ?? {};
      setTransactionAlerts(types.transactionAlerts ?? true);
      setBudgetAlerts(types.budgetAlerts ?? true);
      setGoalReminders(types.goalReminders ?? true);
      setBillReminders(types.billReminders ?? true);
      setSecurityAlerts(types.securityAlerts ?? true);
      setWeeklyReports(types.weeklyReports ?? false);
    } catch (error) {
      console.error('Error initializing notification settings:', error);
      // Set default values if there's an error
      setEmailNotifications(true);
      setPushNotifications(true);
      setSmsNotifications(false);
      setNotificationFrequency('immediate');
      setTransactionAlerts(true);
      setBudgetAlerts(true);
      setGoalReminders(true);
      setBillReminders(true);
      setSecurityAlerts(true);
      setWeeklyReports(false);
    }

    // Finish loading
    setIsLoading(false);
  }, [router]);

  // Save account settings
  const saveAccountSettings = () => {
    try {
      // Only save name and currency, email is read-only
      const updatedSettings = updateUserSettings(userId, {
        name,
        currency
      });

      setUserSettings(updatedSettings);
      setSuccessMessage('Account settings saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save account settings');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Save preferences
  const savePreferences = () => {
    try {
      const updatedSettings = updateUserSettings(userId, {
        language,
        dateFormat,
        enableAnimations
      });

      setUserSettings(updatedSettings);
      setSuccessMessage('Preferences saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save preferences');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    try {
      const updatedSettings = updateUserSettings(userId, {
        notificationPreferences: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications,
          frequency: notificationFrequency,
          types: {
            transactionAlerts,
            budgetAlerts,
            goalReminders,
            billReminders,
            securityAlerts,
            weeklyReports
          }
        }
      });

      setUserSettings(updatedSettings);
      setSuccessMessage('Notification settings saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save notification settings');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

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
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      {/* Success message */}
      {successMessage && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-success-light dark:bg-success-dark text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiCheck className="mr-2" />
          {successMessage}
        </motion.div>
      )}

      {/* Error message */}
      {errorMessage && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-error-light dark:bg-error-dark text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FiX className="mr-2" />
          {errorMessage}
        </motion.div>
      )}

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
                        ? 'bg-primary/30 border border-primary/50 text-dark-text-primary'
                        : 'bg-primary/10 border border-primary/20 text-primary'}`
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
                        isDark ? 'from-primary to-secondary' : 'from-primary to-secondary'
                      } flex items-center justify-center text-white text-2xl font-bold`}>
                        {getInitials(name)}
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
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-dark-accent border-dark-border text-dark-text-primary'
                            : 'bg-light-accent border-light-border text-light-text-primary'
                        } focus:ring-primary focus:border-primary`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiUser className={`h-4 w-4 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`} />
                      </div>
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      This name will be displayed throughout the app
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark
                            ? 'bg-dark-bg border-dark-border text-dark-text-secondary'
                            : 'bg-light-bg border-light-border text-light-text-secondary'
                        } cursor-not-allowed`}
                        value={email}
                        readOnly
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiLock className={`h-4 w-4 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`} />
                      </div>
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isDark ? 'border-dark-border' : 'border-light-border'
                  }`}>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Currency
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-3 py-2 pl-10 rounded-lg border appearance-none ${
                          isDark
                            ? 'bg-dark-accent border-dark-border text-dark-text-primary'
                            : 'bg-light-accent border-light-border text-light-text-primary'
                        } focus:ring-primary focus:border-primary`}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{
                          colorScheme: isDark ? 'dark' : 'light'
                        }}
                      >
                        <option value="USD" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>USD - US Dollar</option>
                        <option value="EUR" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>EUR - Euro</option>
                        <option value="GBP" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>GBP - British Pound</option>
                        <option value="JPY" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>JPY - Japanese Yen</option>
                        <option value="CAD" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>CAD - Canadian Dollar</option>
                        <option value="AUD" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>AUD - Australian Dollar</option>
                        <option value="INR" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>INR - Indian Rupee</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className={`h-4 w-4 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`} />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiChevronDown className={`h-4 w-4 ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`} />
                      </div>
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                      All amounts will be displayed in this currency
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveAccountSettings}
                      className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${
                        isDark
                          ? 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                          : 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                      } text-white shadow-md transition-all duration-200`}
                    >
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
                            ? 'bg-dark-accent border-dark-border text-dark-text-primary'
                            : 'bg-light-accent border-light-border text-light-text-primary'
                        }`}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                          colorScheme: isDark ? 'dark' : 'light'
                        }}
                      >
                        <option value="English" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>English</option>
                        <option value="Spanish" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>Spanish</option>
                        <option value="French" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>French</option>
                        <option value="German" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>German</option>
                        <option value="Japanese" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>Japanese</option>
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
                            ? 'bg-dark-accent border-dark-border text-dark-text-primary'
                            : 'bg-light-accent border-light-border text-light-text-primary'
                        }`}
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        style={{
                          colorScheme: isDark ? 'dark' : 'light'
                        }}
                      >
                        <option value="MM/DD/YYYY" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>YYYY-MM-DD</option>
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
                      <YesNoToggle
                        isEnabled={enableAnimations}
                        onToggle={() => setEnableAnimations(!enableAnimations)}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={savePreferences}
                      className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${
                        isDark
                          ? 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                          : 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                      } text-white shadow-md transition-all duration-200`}
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                  Notification Settings
                </h2>

                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div>
                    <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      Notification Channels
                    </h3>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-start">
                            <FiMail className={`mt-1 mr-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
                            <div>
                              <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                                Email Notifications
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                                Receive notifications via email
                              </p>
                            </div>
                          </div>
                          <YesNoToggle
                            isEnabled={emailNotifications}
                            onToggle={() => setEmailNotifications(!emailNotifications)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-start">
                            <FiBell className={`mt-1 mr-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
                            <div>
                              <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                                Push Notifications
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                                Receive notifications in your browser
                              </p>
                            </div>
                          </div>
                          <YesNoToggle
                            isEnabled={pushNotifications}
                            onToggle={() => setPushNotifications(!pushNotifications)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-start">
                            <FiSmartphone className={`mt-1 mr-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
                            <div>
                              <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                                SMS Notifications
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                                Receive notifications via text message
                              </p>
                            </div>
                          </div>
                          <YesNoToggle
                            isEnabled={smsNotifications}
                            onToggle={() => setSmsNotifications(!smsNotifications)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Frequency */}
                  <div>
                    <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      Notification Frequency
                    </h3>
                    <div className={`p-4 rounded-lg border ${
                      isDark ? 'border-dark-border' : 'border-light-border'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                            How often would you like to receive notifications?
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                            Choose your preferred notification frequency
                          </p>
                        </div>
                        <select
                          value={notificationFrequency}
                          onChange={(e) => setNotificationFrequency(e.target.value as 'immediate' | 'daily' | 'weekly')}
                          className={`px-3 py-2 rounded-lg border ${
                            isDark
                              ? 'bg-dark-accent border-dark-border text-dark-text-primary'
                              : 'bg-light-accent border-light-border text-light-text-primary'
                          }`}
                          style={{
                            // Fix for dropdown options in dark mode
                            colorScheme: isDark ? 'dark' : 'light'
                          }}
                        >
                          <option value="immediate" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>Immediate</option>
                          <option value="daily" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>Daily Digest</option>
                          <option value="weekly" className={isDark ? 'bg-dark-bg text-dark-text-primary' : ''}>Weekly Summary</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div>
                    <h3 className={`text-lg font-medium mb-3 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      Notification Types
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Transaction Alerts
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Get notified about new transactions
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={transactionAlerts}
                            onToggle={() => setTransactionAlerts(!transactionAlerts)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Budget Alerts
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Get notified when approaching budget limits
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={budgetAlerts}
                            onToggle={() => setBudgetAlerts(!budgetAlerts)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Goal Reminders
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Get reminders about your savings goals
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={goalReminders}
                            onToggle={() => setGoalReminders(!goalReminders)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Bill Reminders
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Get reminders about upcoming bills
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={billReminders}
                            onToggle={() => setBillReminders(!billReminders)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Security Alerts
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Get notified about security-related events
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={securityAlerts}
                            onToggle={() => setSecurityAlerts(!securityAlerts)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border ${
                        isDark ? 'border-dark-border' : 'border-light-border'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-base font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                              Weekly Reports
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'}`}>
                              Receive weekly financial summary reports
                            </p>
                          </div>
                          <YesNoToggle
                            isEnabled={weeklyReports}
                            onToggle={() => setWeeklyReports(!weeklyReports)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveNotificationSettings}
                      className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${
                        isDark
                          ? 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                          : 'from-primary to-secondary hover:from-primary-600 hover:to-secondary-600'
                      } text-white shadow-md transition-all duration-200`}
                    >
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab !== 'account' && activeTab !== 'preferences' && activeTab !== 'notifications' && (
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
