import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  amount: number;
  description: string;
  category: string;
  categoryId?: string;
  date: Date;
  type: 'income' | 'expense';
  paymentMethod?: string;
  tags?: string[];
  location?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringDetails?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
  };
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['income', 'expense'], required: true },
  paymentMethod: { type: String },
  tags: [{ type: String }],
  location: { type: String },
  notes: { type: String },
  isRecurring: { type: Boolean, default: false },
  recurringDetails: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
    endDate: { type: Date }
  }
}, {
  timestamps: true
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
