import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Orbitron, Rajdhani, Audiowide } from "next/font/google";
import "./globals.css";
import FuturisticNavbar from '@/components/layout/FuturisticNavbar';
import ThemeWrapper from '@/components/ThemeWrapper';

// Add Inter font for a more modern look
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add futuristic fonts for headings and special text
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${audiowide.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300`}
      >
        <ThemeWrapper>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {/* Futuristic Navbar */}
              <FuturisticNavbar />
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
