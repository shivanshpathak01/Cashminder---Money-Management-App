import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  name: string;
  amount: number;
  spent?: number;
  remaining?: number;
  categoryId?: string;
  category?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  color?: string;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  remaining: { type: Number },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  category: { type: String },
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly', required: true },
  startDate: { type: Date, default: Date.now, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  color: { type: String }
}, {
  timestamps: true
});

// Pre-save hook to calculate remaining budget
BudgetSchema.pre('save', function(next) {
  if (this.amount && this.spent !== undefined) {
    this.remaining = this.amount - this.spent;
  }
  next();
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
