import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category?: string;
  categoryId?: string;
  description?: string;
  isCompleted?: boolean;
  progress?: number;
  color?: string;
  icon?: string;
}

const GoalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { type: String },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: { type: String },
  isCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  color: { type: String },
  icon: { type: String }
}, {
  timestamps: true
});

// Pre-save hook to calculate progress
GoalSchema.pre('save', function(next) {
  if (typeof this.targetAmount === 'number' && typeof this.currentAmount === 'number') {
    this.progress = (this.currentAmount / this.targetAmount) * 100;
    this.isCompleted = this.currentAmount >= this.targetAmount;
  }
  next();
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
