import BudgetRepository from '@/repositories/BudgetRepository';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import { IBudget, IBudgetCreate } from '@/types/models';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Budget Service - Business Logic Layer
 */
export class BudgetService {
    /**
     * Get user budget
     */
    async getBudget(userId: string): Promise<IBudget | null> {
        return await BudgetRepository.findByUserId(userId);
    }

    /**
     * Create or update budget
     */
    async setBudget(userId: string, budgetData: IBudgetCreate): Promise<IBudget> {
        const existingBudget = await BudgetRepository.findByUserId(userId);

        if (existingBudget) {
            const updated = await BudgetRepository.update(userId, budgetData);
            if (!updated) throw new Error('Failed to update budget');
            return updated;
        }

        return await BudgetRepository.create(userId, budgetData);
    }

    /**
     * Delete budget
     */
    async deleteBudget(userId: string): Promise<void> {
        const success = await BudgetRepository.delete(userId);
        if (!success) {
            throw new Error('Budget not found');
        }
    }

    /**
     * Check budget status and get alerts
     */
    async checkBudgetStatus(userId: string): Promise<{
        budget: IBudget | null;
        totalSpent: number;
        remainingBudget: number;
        percentageUsed: number;
        alerts: Array<{ type: string; message: string }>;
        categorySpending: Array<{ category: string; spent: number; limit: number; percentage: number }>;
    }> {
        const budget = await BudgetRepository.findByUserId(userId);

        if (!budget) {
            return {
                budget: null,
                totalSpent: 0,
                remainingBudget: 0,
                percentageUsed: 0,
                alerts: [],
                categorySpending: [],
            };
        }

        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

        const totalSpent = await ExpenseRepository.getTotalSpending(
            userId,
            startDate,
            endDate
        );

        const remainingBudget = budget.monthlyLimit - totalSpent;
        const percentageUsed = (totalSpent / budget.monthlyLimit) * 100;

        const alerts: Array<{ type: string; message: string }> = [];

        // Check if threshold exceeded
        if (percentageUsed >= budget.alertThreshold) {
            alerts.push({
                type: percentageUsed >= 100 ? 'danger' : 'warning',
                message: `You've used ${percentageUsed.toFixed(1)}% of your monthly budget!`,
            });
        }

        // Check if budget exceeded
        if (totalSpent > budget.monthlyLimit) {
            alerts.push({
                type: 'danger',
                message: `You've exceeded your monthly budget by ₹${(totalSpent - budget.monthlyLimit).toFixed(2)}!`,
            });
        }

        const categorySpendingResult: Array<{ category: string; spent: number; limit: number; percentage: number }> = [];

        // Check category limits
        if (budget.categoryLimits && budget.categoryLimits.length > 0) {
            const categorySpending = await ExpenseRepository.getCategorySpending(
                userId,
                startDate,
                endDate
            );

            for (const categoryLimit of budget.categoryLimits) {
                const spending = categorySpending.find(
                    (cs) => cs.category === categoryLimit.category
                );

                const spent = spending ? spending.amount : 0;
                const percentage = (spent / categoryLimit.limit) * 100;

                categorySpendingResult.push({
                    category: categoryLimit.category,
                    spent: spent,
                    limit: categoryLimit.limit,
                    percentage: percentage,
                });

                if (spent > categoryLimit.limit) {
                    alerts.push({
                        type: 'danger',
                        message: `${categoryLimit.category} spending (₹${spent.toFixed(2)}) exceeded limit (₹${categoryLimit.limit.toFixed(2)})`,
                    });
                }
            }
        }

        return {
            budget,
            totalSpent,
            remainingBudget,
            percentageUsed,
            alerts,
            categorySpending: categorySpendingResult,
        };
    }
}

export default new BudgetService();
