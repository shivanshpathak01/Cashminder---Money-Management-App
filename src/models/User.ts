import mongoose, { Schema, Document } from 'mongoose';
import { hashPassword } from '@/lib/password';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  preferences: {
    currency: string;
    theme: string;
    language: string;
    notifications: boolean;
    dashboardLayout?: string;
  };
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
    phone?: string;
  };
  stats?: {
    totalTransactions: number;
    totalSavings: number;
    streakDays: number;
    lastActive: Date;
  };
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isNewUser: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    theme: {
      type: String,
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    dashboardLayout: {
      type: String
    }
  },
  profile: {
    bio: String,
    location: String,
    website: String,
    phone: String
  },
  stats: {
    totalTransactions: {
      type: Number,
      default: 0
    },
    totalSavings: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash the password with a salt factor of 10
    this.password = await hashPassword(this.password as string);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
