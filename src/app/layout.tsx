import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/components/layout/Navbar';
import ThemeWrapper from '@/components/ThemeWrapper';

// Create a Supabase client for server components
const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseAnonKey);
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cashminder - Personal Finance Manager",
  description: "Track your expenses, manage your budget, and achieve your financial goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          We're removing the inline script to avoid hydration issues with browser extensions.
          Theme handling will be done entirely client-side in the ThemeProvider component.
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200`}
      >
        <ThemeWrapper>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {/* Navbar will be client-side rendered */}
              {/* @ts-expect-error Async Server Component */}
              <Navbar />
              <main className="py-10">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
