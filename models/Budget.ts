import mongoose, { Schema, Model } from 'mongoose';
import { IBudget } from '@/types/models';
import { ExpenseCategory } from '@/types/enums';

const BudgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        month: {
            type: Number,
            required: [true, 'Month is required'],
            min: [0, 'Month must be between 0 and 11'],
            max: [11, 'Month must be between 0 and 11'],
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
        },
        monthlyLimit: {
            type: Number,
            required: [true, 'Monthly limit is required'],
            min: [0, 'Monthly limit cannot be negative'],
        },
        categoryLimits: [
            {
                category: {
                    type: String,
                    enum: Object.values(ExpenseCategory),
                    required: true,
                },
                limit: {
                    type: Number,
                    required: true,
                    min: [0, 'Category limit cannot be negative'],
                },
            },
        ],
        alertThreshold: {
            type: Number,
            default: 80,
            min: [0, 'Alert threshold cannot be negative'],
            max: [100, 'Alert threshold cannot exceed 100'],
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret: Record<string, any>) {
                ret._id = ret._id.toString();
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Index for quick user budget lookup for a specific month
BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

// Clean up the model for HMR or force schema update
if (mongoose.models.Budget) {
    delete mongoose.models.Budget;
}

const Budget: Model<IBudget> = mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
