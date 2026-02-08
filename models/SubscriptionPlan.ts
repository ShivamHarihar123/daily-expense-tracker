import mongoose, { Schema, Document, Model } from 'mongoose';

export enum PlanDuration {
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export interface ISubscriptionPlan extends Document {
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: PlanDuration;
    features: string[];
    isActive: boolean;
    isRecommended: boolean;
    tierLevel: number; // 1 for Silver, 2 for Gold, etc. used for sorting and logic
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a plan name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a plan description'],
        },
        price: {
            type: Number,
            required: [true, 'Please provide a plan price'],
        },
        currency: {
            type: String,
            default: 'INR',
        },
        duration: {
            type: String,
            enum: Object.values(PlanDuration),
            default: PlanDuration.YEARLY,
        },
        features: {
            type: [String], // Array of feature strings
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isRecommended: {
            type: Boolean,
            default: false,
        },
        tierLevel: {
            type: Number,
            default: 1,
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate active plans with same name and duration if needed, 
// but for now we'll allow flexibility.

const SubscriptionPlan: Model<ISubscriptionPlan> =
    mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
