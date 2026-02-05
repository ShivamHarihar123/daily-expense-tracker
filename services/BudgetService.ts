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
        currentSpending: number;
        remainingBudget: number;
        percentageUsed: number;
        alerts: string[];
    }> {
        const budget = await BudgetRepository.findByUserId(userId);

        if (!budget) {
            return {
                budget: null,
                currentSpending: 0,
                remainingBudget: 0,
                percentageUsed: 0,
                alerts: [],
            };
        }

        const startDate = startOfMonth(new Date());
        const endDate = endOfMonth(new Date());

        const currentSpending = await ExpenseRepository.getTotalSpending(
            userId,
            startDate,
            endDate
        );

        const remainingBudget = budget.monthlyLimit - currentSpending;
        const percentageUsed = (currentSpending / budget.monthlyLimit) * 100;

        const alerts: string[] = [];

        // Check if threshold exceeded
        if (percentageUsed >= budget.alertThreshold) {
            alerts.push(
                `You've used ${percentageUsed.toFixed(1)}% of your monthly budget!`
            );
        }

        // Check if budget exceeded
        if (currentSpending > budget.monthlyLimit) {
            alerts.push(
                `You've exceeded your monthly budget by $${(currentSpending - budget.monthlyLimit).toFixed(2)}!`
            );
        }

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

                if (spending && spending.amount > categoryLimit.limit) {
                    alerts.push(
                        `${categoryLimit.category} spending ($${spending.amount.toFixed(2)}) exceeded limit ($${categoryLimit.limit.toFixed(2)})`
                    );
                }
            }
        }

        return {
            budget,
            currentSpending,
            remainingBudget,
            percentageUsed,
            alerts,
        };
    }
}

export default new BudgetService();
