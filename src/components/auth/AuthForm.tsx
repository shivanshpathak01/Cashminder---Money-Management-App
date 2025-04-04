'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simple validation
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Please enter a valid email and a password with at least 6 characters');
      }

      // Mock authentication - in a real app, this would use Supabase or another auth provider
      if (mode === 'signup') {
        // Create a new user account
        setTimeout(() => {
          // Generate a unique user ID
          const userId = `user_${Date.now()}`;

          // Store user data in localStorage
          localStorage.setItem('cashminder_user', JSON.stringify({
            id: userId,
            email,
            isNewUser: true, // Flag to indicate this is a new user
            createdAt: new Date().toISOString()
          }));

          // Initialize empty data for the new user
          localStorage.setItem(`cashminder_transactions_${userId}`, JSON.stringify([]));
          localStorage.setItem(`cashminder_categories_${userId}`, JSON.stringify([]));
          localStorage.setItem(`cashminder_budgets_${userId}`, JSON.stringify([]));
          localStorage.setItem(`cashminder_goals_${userId}`, JSON.stringify([]));

          // Redirect to dashboard
          router.push('/dashboard');
          router.refresh();
          setLoading(false);
        }, 1000);
      } else {
        // Simulate login success
        setTimeout(() => {
          // Check if user exists (in a real app, this would be a server check)
          const existingUsers = Object.keys(localStorage)
            .filter(key => key.startsWith('cashminder_user'));

          // If this is the first login, create a mock user
          if (existingUsers.length === 0) {
            const userId = `user_${Date.now()}`;
            localStorage.setItem('cashminder_user', JSON.stringify({
              id: userId,
              email,
              isNewUser: true,
              createdAt: new Date().toISOString()
            }));
          } else {
            // Just store the user info
            localStorage.setItem('cashminder_user', JSON.stringify({
              email,
              isNewUser: false
            }));
          }

          // Redirect to dashboard
          router.push('/dashboard');
          router.refresh();
          setLoading(false);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h1>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={toggleMode}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
