import Expense from '@/models/Expense';
import { IExpense, IExpenseCreate, IExpenseUpdate, IExpenseFilter, IPaginatedResponse } from '@/types/models';
import connectDB from '@/lib/db/mongoose';

/**
 * Expense Repository - Data Access Layer
 */
export class ExpenseRepository {
    /**
     * Find expense by ID
     */
    async findById(id: string, userId: string): Promise<IExpense | null> {
        await connectDB();
        const expense = await Expense.findOne({ _id: id, userId, isDeleted: false });
        return expense ? (expense.toJSON() as IExpense) : null;
    }

    /**
     * Create new expense
     */
    async create(userId: string, expenseData: IExpenseCreate): Promise<IExpense> {
        await connectDB();
        const expense = await Expense.create({ ...expenseData, userId });
        return expense.toJSON() as IExpense;
    }

    /**
     * Update expense
     */
    async update(id: string, userId: string, updates: IExpenseUpdate): Promise<IExpense | null> {
        await connectDB();
        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            updates,
            { new: true }
        );
        return expense ? (expense.toJSON() as IExpense) : null;
    }

    /**
     * Soft delete expense
     */
    async delete(id: string, userId: string): Promise<boolean> {
        await connectDB();
        const result = await Expense.findOneAndUpdate(
            { _id: id, userId },
            { isDeleted: true },
            { new: true }
        );
        return !!result;
    }

    /**
     * Find expenses with filters and pagination
     */
    async findWithFilters(
        userId: string,
        filters: IExpenseFilter,
        page: number = 1,
        limit: number = 20
    ): Promise<IPaginatedResponse<IExpense>> {
        await connectDB();

        const query: any = { userId, isDeleted: false };

        // Apply filters
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) query.date.$gte = filters.startDate;
            if (filters.endDate) query.date.$lte = filters.endDate;
        }

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
            query.amount = {};
            if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
            if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
        }

        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        if (filters.paymentMode) {
            query.paymentMode = filters.paymentMode;
        }

        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { notes: { $regex: filters.search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [expenses, total] = await Promise.all([
            Expense.find(query).sort({ date: -1 }).skip(skip).limit(limit),
            Expense.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: expenses.map((e) => e.toJSON() as IExpense),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    /**
     * Get expenses by date range
     */
    async findByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<IExpense[]> {
        await connectDB();
        const expenses = await Expense.find({
            userId,
            isDeleted: false,
            date: { $gte: startDate, $lte: endDate },
        }).sort({ date: -1 });
        return expenses.map((e) => e.toJSON() as IExpense);
    }

    /**
     * Get expenses by category
     */
    async findByCategory(userId: string, category: string): Promise<IExpense[]> {
        await connectDB();
        const expenses = await Expense.find({
            userId,
            category,
            isDeleted: false,
        }).sort({ date: -1 });
        return expenses.map((e) => e.toJSON() as IExpense);
    }

    /**
     * Get total spending by user
     */
    async getTotalSpending(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
        await connectDB();
        const query: any = { userId, isDeleted: false };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const result = await Expense.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return result.length > 0 ? result[0].total : 0;
    }

    /**
     * Get category-wise spending
     */
    async getCategorySpending(
        userId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ category: string; amount: number; count: number }[]> {
        await connectDB();
        const query: any = { userId, isDeleted: false };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const result = await Expense.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    amount: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { amount: -1 } },
        ]);

        return result.map((r) => ({
            category: r._id,
            amount: r.amount,
            count: r.count,
        }));
    }

    /**
     * Check for duplicate expenses
     */
    async findDuplicates(
        userId: string,
        title: string,
        amount: number,
        date: Date
    ): Promise<IExpense[]> {
        await connectDB();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const expenses = await Expense.find({
            userId,
            title: { $regex: new RegExp(title, 'i') },
            amount,
            date: { $gte: startOfDay, $lte: endOfDay },
            isDeleted: false,
        });

        return expenses.map((e) => e.toJSON() as IExpense);
    }

    /**
     * Get recurring expenses
     */
    async findRecurring(userId: string): Promise<IExpense[]> {
        await connectDB();
        const expenses = await Expense.find({
            userId,
            recurring: true,
            isDeleted: false,
        }).sort({ date: -1 });
        return expenses.map((e) => e.toJSON() as IExpense);
    }

    // ========================
    // ADMIN METHODS
    // ========================

    /**
     * Count all expenses (admin only)
     */
    async countAllExpenses(): Promise<number> {
        await connectDB();
        return await Expense.countDocuments({ isDeleted: false });
    }

    /**
     * Get total system spending (admin only)
     */
    async getTotalSystemSpending(): Promise<number> {
        await connectDB();
        const result = await Expense.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return result.length > 0 ? result[0].total : 0;
    }
}

export default new ExpenseRepository();
