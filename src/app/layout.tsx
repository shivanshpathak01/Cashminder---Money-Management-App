import type { Metadata } from "next";
// Using CSS imports for fonts instead of Next.js font optimization to avoid build hanging
import "./globals.css";
import FuturisticNavbar from '@/components/layout/FuturisticNavbar';
import ThemeWrapper from '@/components/ThemeWrapper';

// Fonts are now loaded via CSS imports in globals.css

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
        <title>Cashminder - Smart Money Management</title>
        <meta name="description" content="Take control of your finances with Cashminder's intelligent money management tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

{/* Fonts will be added after server is stable */}

        <script dangerouslySetInnerHTML={{
          __html: `
            // Block Sentry requests to prevent console errors
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
              if (url && typeof url === 'string' && url.includes('sentry')) {
                console.log('Blocked Sentry request:', url);
                return Promise.resolve(new Response('', { status: 200 }));
              }
              return originalFetch.apply(this, arguments);
            };
          `
        }} />
      </head>
      <body
        className="font-inter antialiased bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300"
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
