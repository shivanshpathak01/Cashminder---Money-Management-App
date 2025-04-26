'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2, FiDollarSign, FiPieChart, FiTarget,
  FiArrowRight, FiShield, FiTrendingUp, FiZap
} from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

// Animated number counter component
const AnimatedCounter = ({ value, duration = 0.5 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const totalMiliseconds = duration * 1000;

    // Use a faster increment for large numbers
    const increment = Math.max(1, Math.floor(end / 30));
    const incrementTime = totalMiliseconds / (end / increment);

    const timer = setInterval(() => {
      start = Math.min(end, start + increment);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savingsGoal: {
      current: 0,
      target: 10000,
      percentage: 0
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Check if user is logged in and get their data
    const storedUser = localStorage.getItem('cashminder_user');
    if (storedUser) {
      setIsLoggedIn(true);

      // In a real app, we would fetch the user's data from the API
      // For now, we'll just use zeros for a new user
      setUserData({
        totalBalance: 0,
        income: 0,
        expenses: 0,
        savingsGoal: {
          current: 0,
          target: 10000,
          percentage: 0
        }
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const features = [
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Harness the power of machine learning to predict spending patterns and optimize your financial decisions."
    },
    {
      icon: <FiPieChart className="w-8 h-8" />,
      title: "Dynamic Budgeting",
      description: "Real-time budget tracking with intelligent categorization and personalized alerts."
    },
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "Smart Goal Tracking",
      description: "Set and achieve financial goals with adaptive recommendations based on your spending habits."
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Investment Insights",
      description: "Track your investments and receive AI-powered recommendations for portfolio optimization."
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security protocols."
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Real-Time Notifications",
      description: "Instant alerts for unusual spending, bill payments, and financial opportunities."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950"></div>

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20"></div>

        {/* Animated particles */}
        {isDark && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: Math.random() * 0.5 + 0.3
                }}
                animate={{
                  y: [null, Math.random() * -100, null],
                  opacity: [null, Math.random() * 0.8 + 0.2, null]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px'
                }}
              />
            ))}
          </>
        )}

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 mb-4">
                  The Future of Finance
                </span>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                    Smart Money
                  </span>
                  <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Management
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className={`text-xl ${isDark ? 'text-gray-100' : 'text-gray-600'}`}
                variants={itemVariants}
              >
                Take control of your finances with our AI-powered platform. Track expenses, set budgets, and achieve your financial goals with ease.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Link href="/auth">
                  <motion.button
                    className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="#features">
                  <motion.button
                    className={`flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border ${
                      isDark
                        ? 'border-gray-700 text-white hover:bg-gray-800/50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    } transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <motion.div
                className={`relative p-8 rounded-2xl backdrop-blur-xl border ${
                  isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'
                }`}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h3>
                  <span className="text-sm text-indigo-500 dark:text-indigo-400">Today</span>
                </div>

                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Balance</span>
                      <FiDollarSign className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${userData.totalBalance.toLocaleString()}
                    </div>
                    {userData.totalBalance > 0 ? (
                      <div className="flex items-center mt-1 text-green-500 dark:text-green-400 text-sm">
                        <FiTrendingUp className="mr-1" />
                        <span>Track your balance</span>
                      </div>
                    ) : (
                      <div className="flex items-center mt-1 text-blue-500 dark:text-blue-400 text-sm">
                        <span>Add transactions to see your balance</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Income</span>
                        <FiTrendingUp className="text-green-500 dark:text-green-400" />
                      </div>
                      <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${userData.income.toLocaleString()}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Expenses</span>
                        <FiBarChart2 className="text-red-500 dark:text-red-400" />
                      </div>
                      <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${userData.expenses.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Savings Goal</span>
                      <FiTarget className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-xs font-semibold inline-block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {userData.savingsGoal.percentage}% Complete
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold inline-block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ${userData.savingsGoal.current.toLocaleString()} / ${userData.savingsGoal.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-300 dark:bg-gray-700">
                        <motion.div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-blue-500"
                          initial={{ width: "0%" }}
                          animate={{ width: `${userData.savingsGoal.percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                Next-Gen Financial Tools
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
              Powerful features designed to transform how you manage, track, and grow your finances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  className={`relative p-6 rounded-xl border ${
                    isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/90 border-gray-200 shadow-md'
                  } backdrop-blur-sm h-full`}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="text-indigo-500 dark:text-indigo-400 mb-4">{feature.icon}</div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={`${isDark ? 'text-gray-200' : 'text-gray-600'}`}>{feature.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            className={`rounded-2xl ${
              isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white/90 border-gray-200 shadow-lg'
            } border backdrop-blur-xl p-8 md:p-12`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Active Users", value: 25000, suffix: "+" },
                { label: "Transactions Processed", value: 1500000, suffix: "+" },
                { label: "Savings Goals Achieved", value: 8700, suffix: "+" },
                { label: "Customer Satisfaction", value: 98, suffix: "%" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <AnimatedCounter value={stat.value} duration={0.8} />{stat.suffix}
                  </div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                transform your finances?
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
              Join thousands of users who have already taken control of their financial future
            </p>
            <Link href="/auth">
              <motion.button
                className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Now
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative py-12 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center mr-2`}>
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cashminder
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Privacy
              </Link>
              <Link href="#" className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Terms
              </Link>
              <Link href="#" className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              &copy; {new Date().getFullYear()} Cashminder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
