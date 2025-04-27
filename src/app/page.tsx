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
        {/* Finance-themed background */}
        <div className="absolute inset-0 bg-light-bg dark:bg-space-gradient animate-gradient"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] dark:opacity-[0.1]"></div>

        {/* Animated gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"></div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl"
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

        {/* Animated lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
              left: 0,
              right: 0,
              transformOrigin: 'center',
            }}
            animate={{
              scaleX: [0.5, 1.5, 0.5],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
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
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/20 text-primary-700 dark:text-primary mb-4">
                  Smart Financial Management
                </span>
                <h1 className="leading-tight">
                  <span className="block text-4xl md:text-5xl font-orbitron font-bold text-light-text-primary dark:text-dark-text-primary letter-spacing-wide mb-2">
                    MASTER YOUR MONEY
                  </span>
                  <span className="block text-5xl md:text-6xl font-audiowide text-shimmer">
                    SHAPE YOUR FUTURE
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="text-xl font-rajdhani text-light-text-secondary dark:text-dark-text-secondary mt-6 max-w-2xl"
                variants={itemVariants}
              >
                <span className="font-semibold text-primary">Visualize</span> your spending patterns,
                <span className="font-semibold text-secondary"> automate</span> your savings, and
                <span className="font-semibold text-primary"> unlock</span> your financial potential with our AI-powered platform.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-8"
                variants={itemVariants}
              >
                <Link href="/auth">
                  <motion.button
                    className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-dark-bg bg-primary hover:bg-primary-400 transition-all duration-300 shadow-md"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "var(--glow-primary)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="#features">
                  <motion.button
                    className="flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:bg-light-accent dark:hover:bg-dark-accent transition-all duration-300"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
                    }}
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
              <motion.div
                className="relative p-8 rounded-2xl glass-card"
                whileHover={{
                  y: -5,
                  boxShadow: "var(--glow-primary)"
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">Financial Overview</h3>
                  <span className="text-sm text-primary font-medium">Today</span>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-light-card dark:bg-dark-accent border border-light-border dark:border-dark-border finance-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Total Balance</span>
                      <FiDollarSign className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                      ${userData.totalBalance.toLocaleString()}
                    </div>
                    {userData.totalBalance > 0 ? (
                      <div className="flex items-center mt-1 text-success text-sm">
                        <FiTrendingUp className="mr-1" />
                        <span>Track your balance</span>
                      </div>
                    ) : (
                      <div className="flex items-center mt-1 text-secondary text-sm">
                        <span>Add transactions to see your balance</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-success/10 dark:bg-success/20 border border-success/20 dark:border-success/30 finance-card">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Income</span>
                        <FiTrendingUp className="text-success" />
                      </div>
                      <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        ${userData.income.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-danger/10 dark:bg-danger/20 border border-danger/20 dark:border-danger/30 finance-card">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Expenses</span>
                        <FiBarChart2 className="text-danger" />
                      </div>
                      <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        ${userData.expenses.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 finance-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Savings Goal</span>
                      <FiTarget className="text-primary" />
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-light-text-primary dark:text-dark-text-primary">
                            {userData.savingsGoal.percentage}% Complete
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-light-text-muted dark:text-dark-text-muted">
                            ${userData.savingsGoal.current.toLocaleString()} / ${userData.savingsGoal.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-light-accent dark:bg-dark-bg">
                        <motion.div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-gradient"
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
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary mb-4">
              Features
            </span>
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 letter-spacing-wide">
              <span className="text-glow dark:text-glow text-primary">
                NEXT-GEN FINANCIAL TOOLS
              </span>
            </h2>
            <p className="text-xl font-rajdhani max-w-3xl mx-auto text-light-text-secondary dark:text-dark-text-secondary">
              Cutting-edge features engineered to revolutionize how you <span className="font-semibold text-primary">analyze</span>,
              <span className="font-semibold text-secondary"> optimize</span>, and
              <span className="font-semibold text-primary"> maximize</span> your financial potential
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div
                  className="relative p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card finance-card h-full"
                  whileHover={{
                    y: -5,
                    boxShadow: "var(--glow-primary)"
                  }}
                >
                  <div className="text-primary mb-4 text-3xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-light-text-primary dark:text-dark-text-primary">{feature.title}</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{feature.description}</p>
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
            className="rounded-2xl glass-card p-8 md:p-12"
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
                  <div className="text-4xl font-bold mb-2 text-light-text-primary dark:text-dark-text-primary">
                    <AnimatedCounter value={stat.value} duration={0.8} />{stat.suffix}
                  </div>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">{stat.label}</p>
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
            <h2 className="mb-6">
              <span className="block text-3xl md:text-4xl font-rajdhani font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                READY TO ELEVATE YOUR
              </span>
              <span className="block text-5xl md:text-6xl font-audiowide text-glow-green text-secondary letter-spacing-wide">
                FINANCIAL INTELLIGENCE?
              </span>
            </h2>
            <p className="text-xl font-rajdhani max-w-3xl mx-auto mb-8 text-light-text-secondary dark:text-dark-text-secondary">
              Join the <span className="font-semibold text-primary">10,000+</span> users who are already leveraging our platform to
              <span className="font-semibold text-secondary"> build wealth</span>,
              <span className="font-semibold text-primary"> reduce debt</span>, and
              <span className="font-semibold text-secondary"> secure</span> their financial future
            </p>
            <Link href="/auth">
              <motion.button
                className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-dark-bg bg-secondary hover:bg-secondary-400 transition-all duration-300 mx-auto shadow-md"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "var(--glow-secondary)"
                }}
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
      <footer className="relative py-12 border-t border-light-border dark:border-dark-border">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 shadow-md">
                <span className="text-dark-bg font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-light-text-primary dark:text-dark-text-primary">
                Cashminder
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-light-text-muted dark:text-dark-text-muted">
              &copy; {new Date().getFullYear()} Cashminder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
