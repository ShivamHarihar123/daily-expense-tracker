import mongoose, { Schema, Model } from 'mongoose';
import { IExpense } from '@/types/models';
import { ExpenseCategory, PaymentMode, Currency, RecurringFrequency } from '@/types/enums';

const ExpenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [2, 'Title must be at least 2 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        currency: {
            type: String,
            enum: Object.values(Currency),
            default: Currency.INR,
        },
        category: {
            type: String,
            enum: Object.values(ExpenseCategory),
            required: [true, 'Category is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            index: true,
        },
        notes: {
            type: String,
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        },
        receiptUrl: {
            type: String,
        },
        recurring: {
            type: Boolean,
            default: false,
        },
        recurringFrequency: {
            type: String,
            enum: Object.values(RecurringFrequency),
        },
        paymentMode: {
            type: String,
            enum: Object.values(PaymentMode),
            required: [true, 'Payment mode is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret._id = ret._id.toString();
                if (ret.__v !== undefined) delete ret.__v;
                return ret;
            },
        },
    }
);

// Compound indexes for common queries
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, isDeleted: 1 });
ExpenseSchema.index({ userId: 1, createdAt: -1 });
ExpenseSchema.index({ userId: 1, date: -1, category: 1 });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
