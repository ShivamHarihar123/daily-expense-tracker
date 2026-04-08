import Budget from '@/models/Budget';
import { IBudget, IBudgetCreate } from '@/types/models';
import connectDB from '@/lib/db/mongoose';

/**
 * Budget Repository - Data Access Layer
 */
export class BudgetRepository {
    /**
     * Find budget by user ID and period
     */
    async findByUserId(userId: string, month: number, year: number): Promise<IBudget | null> {
        await connectDB();
        const budget = await Budget.findOne({ userId, month, year });
        return budget ? (budget.toJSON() as IBudget) : null;
    }

    /**
     * Find all budgets for a user
     */
    async findAllByUserId(userId: string): Promise<IBudget[]> {
        await connectDB();
        const budgets = await Budget.find({ 
            userId, 
            month: { $exists: true }, 
            year: { $exists: true } 
        }).sort({ year: -1, month: -1 });
        return budgets.map(b => b.toJSON() as IBudget);
    }

    /**
     * Create or update budget atomically (upsert)
     * This is the safe way - never causes E11000 duplicate key errors
     */
    async upsert(userId: string, budgetData: IBudgetCreate): Promise<IBudget> {
        await connectDB();
        const { month, year, ...rest } = budgetData;
        const budget = await Budget.findOneAndUpdate(
            { userId, month, year },
            { $set: { ...rest, userId, month, year } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return budget.toJSON() as IBudget;
    }

    /**
     * Create budget (direct insert - only use when you are certain no duplicate exists)
     */
    async create(userId: string, budgetData: IBudgetCreate): Promise<IBudget> {
        await connectDB();
        const budget = await Budget.create({ ...budgetData, userId });
        return budget.toJSON() as IBudget;
    }

    /**
     * Update budget
     */
    async update(userId: string, month: number, year: number, updates: Partial<IBudgetCreate>): Promise<IBudget | null> {
        await connectDB();
        const budget = await Budget.findOneAndUpdate(
            { userId, month, year },
            updates,
            { new: true, upsert: true }
        );
        return budget ? (budget.toJSON() as IBudget) : null;
    }

    /**
     * Delete budget
     */
    async delete(userId: string, month: number, year: number): Promise<boolean> {
        await connectDB();
        const result = await Budget.findOneAndDelete({ userId, month, year });
        return !!result;
    }

    /**
     * Count all budgets (admin only)
     */
    async countAllBudgets(): Promise<number> {
        await connectDB();
        return await Budget.countDocuments();
    }
}

export default new BudgetRepository();
