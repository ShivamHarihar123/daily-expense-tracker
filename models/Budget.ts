import mongoose, { Schema, Model } from 'mongoose';
import { IBudget } from '@/types/models';
import { ExpenseCategory } from '@/types/enums';

const BudgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
            index: true,
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
            transform: function (doc, ret) {
                ret._id = ret._id.toString();
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Index for quick user budget lookup
BudgetSchema.index({ userId: 1 }, { unique: true });

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
