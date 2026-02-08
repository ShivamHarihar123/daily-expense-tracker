import Budget from '@/models/Budget';
import { IBudget, IBudgetCreate } from '@/types/models';
import connectDB from '@/lib/db/mongoose';

/**
 * Budget Repository - Data Access Layer
 */
export class BudgetRepository {
    /**
     * Find budget by user ID
     */
    async findByUserId(userId: string): Promise<IBudget | null> {
        await connectDB();
        const budget = await Budget.findOne({ userId });
        return budget ? (budget.toJSON() as IBudget) : null;
    }

    /**
     * Create budget
     */
    async create(userId: string, budgetData: IBudgetCreate): Promise<IBudget> {
        await connectDB();
        const budget = await Budget.create({ ...budgetData, userId });
        return budget.toJSON() as IBudget;
    }

    /**
     * Update budget
     */
    async update(userId: string, updates: Partial<IBudgetCreate>): Promise<IBudget | null> {
        await connectDB();
        const budget = await Budget.findOneAndUpdate(
            { userId },
            updates,
            { new: true, upsert: true }
        );
        return budget ? (budget.toJSON() as IBudget) : null;
    }

    /**
     * Delete budget
     */
    async delete(userId: string): Promise<boolean> {
        await connectDB();
        const result = await Budget.findOneAndDelete({ userId });
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
