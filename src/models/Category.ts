import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: string;
  name: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense';
  description?: string;
  isDefault?: boolean;
  budget?: number;
  parentCategory?: string;
}

const CategorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String },
  type: { type: String, enum: ['income', 'expense'], required: true },
  description: { type: String },
  isDefault: { type: Boolean, default: false },
  budget: { type: Number },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' }
}, {
  timestamps: true
});

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
