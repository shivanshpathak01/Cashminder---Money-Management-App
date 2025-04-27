'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

type AuthMode = 'login' | 'signup';

export default function FuturisticAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Reset form step when mode changes
  useEffect(() => {
    setFormStep(0);
    setError(null);
  }, [mode]);

  const validateEmail = () => {
    if (!email.includes('@') || email.length < 5) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (formStep === 0) {
      if (!validateEmail()) return;
      setError(null);
      setFormStep(1);
    } else if (formStep === 1) {
      if (!validatePassword()) return;
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call our API route for authentication
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split('@')[0], // Use part of email as name if not provided
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user data in localStorage for client-side access
      localStorage.setItem('cashminder_user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isNewUser: data.user.isNewUser,
        role: data.user.role,
        preferences: data.user.preferences,
        token: data.token
      }));

      // Dispatch custom event to notify other components about auth state change
      window.dispatchEvent(new Event('auth_state_changed'));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      setFormStep(0); // Go back to first step on error
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  return (
    <motion.div
      className={`w-full max-w-md p-8 space-y-8 rounded-2xl shadow-xl ${
        isDark
          ? 'bg-gray-900 border border-gray-800'
          : 'bg-white/95 border border-gray-200 shadow-lg'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${
            isDark
              ? 'from-indigo-600 to-blue-700'
              : 'from-indigo-500 to-blue-600'
          } flex items-center justify-center mb-4 shadow-lg`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            boxShadow: [
              '0 0 0 rgba(79, 70, 229, 0.4)',
              '0 0 20px rgba(79, 70, 229, 0.6)',
              '0 0 0 rgba(79, 70, 229, 0.4)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-white font-bold text-3xl"
            animate={{
              textShadow: [
                '0 0 5px rgba(255,255,255,0.5)',
                '0 0 15px rgba(255,255,255,0.8)',
                '0 0 5px rgba(255,255,255,0.5)'
              ],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            C
          </motion.span>
        </motion.div>

        <motion.h1
          className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </motion.h1>

        <motion.p
          className={`mt-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {mode === 'login'
            ? 'Sign in to access your financial dashboard'
            : 'Start your journey to financial freedom'}
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className={`p-4 rounded-lg flex items-center space-x-2 ${
              isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-500'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <FiAlertCircle className="flex-shrink-0 w-5 h-5" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {formStep === 0 ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                    <FiMail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name (optional)
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                      <FiUser className="h-5 w-5" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2`}
                      placeholder="Your name"
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                type="button"
                onClick={handleNextStep}
                className={`flex justify-center items-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-indigo-500'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:ring-indigo-400'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                disabled={!email}
              >
                <span>Continue</span>
                <FiArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>
                    <FiLock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFormStep(0)}
                  className={`text-sm font-medium ${
                    isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={`text-sm font-medium ${
                    isDark ? 'text-gray-200 hover:text-gray-100' : 'text-gray-600 hover:text-gray-500'
                  }`}
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="button"
                onClick={handleNextStep}
                className={`flex justify-center items-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-indigo-500'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:ring-indigo-400'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                disabled={loading || !password}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Processing...
                    </motion.span>
                  </div>
                ) : (
                  <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-center">
        <motion.button
          type="button"
          onClick={toggleMode}
          className={`text-sm font-medium ${
            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </motion.button>
      </div>
    </motion.div>
  );
}
