import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Category from '@/models/Category';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper function to create default categories for a new user
async function createDefaultCategories(userId: string) {
  const defaultExpenseCategories = [
    { name: 'Food & Dining', color: '#FF5733', icon: 'utensils', type: 'expense' },
    { name: 'Transportation', color: '#33A1FF', icon: 'car', type: 'expense' },
    { name: 'Housing', color: '#33FF57', icon: 'home', type: 'expense' },
    { name: 'Entertainment', color: '#A133FF', icon: 'film', type: 'expense' },
    { name: 'Shopping', color: '#FF33A1', icon: 'shopping-bag', type: 'expense' },
    { name: 'Utilities', color: '#33FFA1', icon: 'bolt', type: 'expense' },
    { name: 'Healthcare', color: '#FF3357', icon: 'medkit', type: 'expense' },
    { name: 'Personal Care', color: '#5733FF', icon: 'user', type: 'expense' }
  ];

  const defaultIncomeCategories = [
    { name: 'Salary', color: '#57FF33', icon: 'briefcase', type: 'income' },
    { name: 'Investments', color: '#FFA133', icon: 'chart-line', type: 'income' },
    { name: 'Gifts', color: '#A1FF33', icon: 'gift', type: 'income' },
    { name: 'Other Income', color: '#33FFF5', icon: 'dollar-sign', type: 'income' }
  ];

  const allCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];

  const categoryPromises = allCategories.map(cat => {
    const category = new Category({
      userId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      type: cat.type,
      isDefault: true
    });
    return category.save();
  });

  await Promise.all(categoryPromises);
  console.log(`Created ${allCategories.length} default categories for user ${userId}`);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, mode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    await connectToDatabase();

    if (mode === 'signup') {
      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Create new user - password will be hashed by the pre-save middleware
      const newUser = new User({
        email,
        password,
        name: name || email.split('@')[0], // Use part of email as name if not provided
        isNewUser: true,
        isVerified: true, // In a real app, this would be false until email verification
        role: 'user',
        preferences: {
          currency: 'USD',
          theme: 'light',
          language: 'en',
          notifications: true
        },
        stats: {
          totalTransactions: 0,
          totalSavings: 0,
          streakDays: 0,
          lastActive: new Date()
        }
      });

      await newUser.save();
      console.log(`New user created: ${newUser._id} (${email})`);

      // Create default categories for the new user
      await createDefaultCategories(newUser._id);

      // Generate JWT token
      const token = generateToken({
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name
      });

      // Set HTTP-only cookie with the token
      (await cookies()).set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          isNewUser: newUser.isNewUser,
          role: newUser.role,
          preferences: newUser.preferences
        },
        token
      });
    } else {
      // Login mode
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Compare passwords
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Update last login time and stats
      user.lastLogin = new Date();
      user.stats.lastActive = new Date();
      await user.save();

      console.log(`User logged in: ${user._id} (${email})`);

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      // Set HTTP-only cookie with the token
      (await cookies()).set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isNewUser: user.isNewUser,
          role: user.role,
          preferences: user.preferences
        },
        token
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
