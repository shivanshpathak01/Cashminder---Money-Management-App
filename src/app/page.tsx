import Image from "next/image";
import Link from "next/link";
import { FiBarChart2, FiDollarSign, FiPieChart, FiTarget } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-white">
        <div className="relative px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10">
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <span className="text-2xl font-bold text-indigo-600">Cashminder</span>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
              <Link href="/auth/signup" className="font-medium text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-500">
                Sign up
              </Link>
            </div>
          </nav>
        </div>

        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Take control of</span>
                <span className="block text-indigo-600">your finances</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Cashminder helps you track expenses, manage budgets, and achieve your financial goals with ease.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/auth/signup" className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/auth/login" className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                      Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Dashboard preview"
                    width={500}
                    height={300}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your money
            </p>
            <p className="max-w-2xl mt-4 text-xl text-gray-500 lg:mx-auto">
              Cashminder provides powerful tools to help you take control of your financial life.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md bg-indigo-500 text-white">
                  <FiBarChart2 className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Expense Tracking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Easily log and categorize your expenses to see where your money is going.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md bg-indigo-500 text-white">
                  <FiPieChart className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Budget Planning</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create and manage budgets for different categories to stay on track with your spending.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md bg-indigo-500 text-white">
                  <FiTarget className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Savings Goals</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Set and track progress towards your financial goals, from emergency funds to big purchases.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-md bg-indigo-500 text-white">
                  <FiDollarSign className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Financial Insights</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get visual reports and insights to understand your spending patterns and improve your habits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-sm text-gray-500">Privacy Policy</span>
            <span className="text-sm text-gray-500">Terms of Service</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-base text-center text-gray-400">&copy; 2025 Cashminder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
