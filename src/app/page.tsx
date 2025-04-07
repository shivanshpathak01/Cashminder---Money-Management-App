'use client';

import Image from "next/image";
import Link from "next/link";
import { FiBarChart2, FiDollarSign, FiPieChart, FiTarget, FiArrowRight, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black text-gray-900 dark:text-white transition-colors duration-200">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20"></div>
        
        {/* Fixed Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
          <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-transparent bg-clip-text">Cashminder</span>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link href="/auth/login" className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all duration-300 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                  <FiLogIn className="mr-1.5" />
                  Log in
                </Link>
                <Link href="/auth/signup" className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                  <FiUserPlus className="mr-1.5" />
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with padding for fixed nav */}
        <div className="pt-16 relative z-10 flex-1 flex items-center">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                    Future of Finance
                  </span>
                  <span className="block mt-2 text-gray-900 dark:text-white">
                    Starts Here
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 sm:mt-8">
                  Experience the next generation of money management with AI-powered insights and real-time tracking.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup" className="group inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                    Get Started
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/auth/login" className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                  <div className="relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Total Balance</span>
                            <FiDollarSign className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">$24,500.00</div>
                          <div className="text-sm text-green-600 dark:text-green-400">+2.5% from last month</div>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Monthly Savings</span>
                            <FiTarget className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">$1,200.00</div>
                          <div className="text-sm text-green-600 dark:text-green-400">On track</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Investments</span>
                            <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">$15,800.00</div>
                          <div className="text-sm text-green-600 dark:text-green-400">+5.2% growth</div>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Budget Status</span>
                            <FiPieChart className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
                          <div className="text-sm text-green-600 dark:text-green-400">Within limits</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20"></div>
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 uppercase">Features</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
              Next-Gen Financial Tools
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <FiBarChart2 className="w-8 h-8" />,
                title: "Smart Analytics",
                description: "AI-powered insights and predictive analytics for your financial future."
              },
              {
                icon: <FiPieChart className="w-8 h-8" />,
                title: "Dynamic Budgeting",
                description: "Real-time budget tracking with intelligent categorization and alerts."
              },
              {
                icon: <FiTarget className="w-8 h-8" />,
                title: "Goal Tracking",
                description: "Set and achieve financial goals with personalized recommendations."
              },
              {
                icon: <FiDollarSign className="w-8 h-8" />,
                title: "Wealth Insights",
                description: "Comprehensive financial health scoring and improvement suggestions."
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">&copy; 2025 Cashminder. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
