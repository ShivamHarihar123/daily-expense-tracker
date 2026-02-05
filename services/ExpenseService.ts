import ExpenseRepository from '@/repositories/ExpenseRepository';
import { IExpense, IExpenseCreate, IExpenseUpdate, IExpenseFilter, IPaginatedResponse } from '@/types/models';
import { categorizeExpense } from '@/lib/ai/categorization';
import { sanitizeInput } from '@/lib/utils/sanitization';

/**
 * Expense Service - Business Logic Layer
 */
export class ExpenseService {
    /**
     * Create new expense
     */
    async createExpense(userId: string, expenseData: IExpenseCreate): Promise<IExpense> {
        // Sanitize inputs
        const sanitizedData = {
            ...expenseData,
            title: sanitizeInput(expenseData.title),
            notes: expenseData.notes ? sanitizeInput(expenseData.notes) : undefined,
        };

        // AI category suggestion if not provided or user wants suggestion
        if (!sanitizedData.category) {
            const prediction = categorizeExpense(sanitizedData.title, sanitizedData.notes);
            sanitizedData.category = prediction.category;
        }

        // Check for duplicates
        const duplicates = await ExpenseRepository.findDuplicates(
            userId,
            sanitizedData.title,
            sanitizedData.amount,
            sanitizedData.date
        );

        if (duplicates.length > 0) {
            console.warn('Potential duplicate expense detected:', duplicates);
            // In production, you might want to return a warning to the user
        }

        return await ExpenseRepository.create(userId, sanitizedData);
    }

    /**
     * Update expense
     */
    async updateExpense(
        id: string,
        userId: string,
        updates: IExpenseUpdate
    ): Promise<IExpense> {
        // Sanitize inputs
        if (updates.title) {
            updates.title = sanitizeInput(updates.title);
        }
        if (updates.notes) {
            updates.notes = sanitizeInput(updates.notes);
        }

        const expense = await ExpenseRepository.update(id, userId, updates);
        if (!expense) {
            throw new Error('Expense not found');
        }

        return expense;
    }

    /**
     * Delete expense
     */
    async deleteExpense(id: string, userId: string): Promise<void> {
        const success = await ExpenseRepository.delete(id, userId);
        if (!success) {
            throw new Error('Expense not found');
        }
    }

    /**
     * Get expense by ID
     */
    async getExpense(id: string, userId: string): Promise<IExpense> {
        const expense = await ExpenseRepository.findById(id, userId);
        if (!expense) {
            throw new Error('Expense not found');
        }
        return expense;
    }

    /**
     * Get expenses with filters
     */
    async getExpenses(
        userId: string,
        filters: IExpenseFilter,
        page: number = 1,
        limit: number = 20
    ): Promise<IPaginatedResponse<IExpense>> {
        return await ExpenseRepository.findWithFilters(userId, filters, page, limit);
    }

    /**
     * Get expenses by date range
     */
    async getExpensesByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<IExpense[]> {
        return await ExpenseRepository.findByDateRange(userId, startDate, endDate);
    }

    /**
     * Get recurring expenses
     */
    async getRecurringExpenses(userId: string): Promise<IExpense[]> {
        return await ExpenseRepository.findRecurring(userId);
    }

    /**
     * Import expenses from CSV
     */
    async importFromCSV(userId: string, csvData: any[]): Promise<{
        imported: number;
        failed: number;
        errors: string[];
    }> {
        let imported = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const row of csvData) {
            try {
                const expenseData: IExpenseCreate = {
                    title: row.title || row.Title,
                    amount: parseFloat(row.amount || row.Amount),
                    currency: row.currency || row.Currency || 'USD',
                    category: row.category || row.Category,
                    date: new Date(row.date || row.Date),
                    notes: row.notes || row.Notes,
                    paymentMode: row.paymentMode || row.PaymentMode || 'Cash',
                    tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
                } as IExpenseCreate;

                await this.createExpense(userId, expenseData);
                imported++;
            } catch (error: any) {
                failed++;
                errors.push(`Row ${imported + failed}: ${error.message}`);
            }
        }

        return { imported, failed, errors };
    }

    /**
     * Export expenses to CSV format
     */
    async exportToCSV(userId: string, filters: IExpenseFilter): Promise<any[]> {
        const result = await ExpenseRepository.findWithFilters(userId, filters, 1, 10000);

        return result.data.map((expense) => ({
            Title: expense.title,
            Amount: expense.amount,
            Currency: expense.currency,
            Category: expense.category,
            Date: new Date(expense.date).toISOString().split('T')[0],
            PaymentMode: expense.paymentMode,
            Tags: expense.tags.join(', '),
            Notes: expense.notes || '',
        }));
    }

    /**
     * Get total spending
     */
    async getTotalSpending(
        userId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<number> {
        return await ExpenseRepository.getTotalSpending(userId, startDate, endDate);
    }

    /**
     * Get category breakdown
     */
    async getCategoryBreakdown(
        userId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ category: string; amount: number; count: number }[]> {
        return await ExpenseRepository.getCategorySpending(userId, startDate, endDate);
    }
}

export default new ExpenseService();
