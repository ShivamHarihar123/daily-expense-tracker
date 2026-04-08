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
    async getBudget(userId: string, month: number, year: number): Promise<IBudget | null> {
        return await BudgetRepository.findByUserId(userId, month, year);
    }

    /**
     * Get all budgets for user
     */
    async getAllBudgets(userId: string): Promise<IBudget[]> {
        return await BudgetRepository.findAllByUserId(userId);
    }

    /**
     * Create or update budget
     */
    async setBudget(userId: string, budgetData: IBudgetCreate): Promise<IBudget> {
        return await BudgetRepository.upsert(userId, budgetData);
    }

    /**
     * Delete budget
     */
    async deleteBudget(userId: string, month: number, year: number): Promise<void> {
        const success = await BudgetRepository.delete(userId, month, year);
        if (!success) {
            throw new Error('Budget not found');
        }
    }

    /**
     * Check budget status and get alerts
     */
    async checkBudgetStatus(userId: string, month?: number, year?: number): Promise<{
        budget: IBudget | null;
        totalSpent: number;
        remainingBudget: number;
        percentageUsed: number;
        alerts: Array<{ type: string; message: string }>;
        categorySpending: Array<{ category: string; spent: number; limit: number; percentage: number }>;
    }> {
        const targetDate = (month !== undefined && year !== undefined) 
            ? new Date(year, month, 1) 
            : new Date();
        
        const targetMonth = month !== undefined ? month : targetDate.getMonth();
        const targetYear = year !== undefined ? year : targetDate.getFullYear();

        const budget = await BudgetRepository.findByUserId(userId, targetMonth, targetYear);

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

        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

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
                message: `You've used ${percentageUsed.toFixed(1)}% of your budget for ${targetDate.toLocaleString('default', { month: 'long', year: 'numeric' })}!`,
            });
        }

        // Check if budget exceeded
        if (totalSpent > budget.monthlyLimit) {
            alerts.push({
                type: 'danger',
                message: `You've exceeded your budget by ₹${(totalSpent - budget.monthlyLimit).toFixed(2)} for ${targetDate.toLocaleString('default', { month: 'long', year: 'numeric' })}!`,
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
