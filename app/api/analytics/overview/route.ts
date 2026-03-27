import { NextRequest, NextResponse } from 'next/server';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import { authMiddleware } from '@/middleware/auth';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';

/**
 * GET /api/analytics/overview - Get analytics overview
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'month'; 
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth();
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

        let startDate: Date;
        let endDate: Date;

        switch (period) {
            case 'day':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case 'year':
                startDate = startOfYear(new Date(year, 0, 1));
                endDate = endOfYear(new Date(year, 11, 31));
                break;
            case 'month':
            default:
                startDate = startOfMonth(new Date(year, month, 1));
                endDate = endOfMonth(new Date(year, month, 1));
        }

        const userId = authResult.user!.userId;

        // Get expenses for the period
        const expenses = await ExpenseRepository.findByDateRange(userId, startDate, endDate);

        // Calculate total spending
        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalExpenses = expenses.length;
        const averageExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

        // Category distribution
        const categoryData = await ExpenseRepository.getCategorySpending(userId, startDate, endDate);
        const categoryDistribution = categoryData.map((cat) => ({
            category: cat.category,
            amount: cat.amount,
            percentage: totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0,
        }));

        // Top categories
        const topCategories = categoryData.slice(0, 5).map((cat) => ({
            category: cat.category,
            amount: cat.amount,
        }));

        // Monthly trend (last 6 months)
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = startOfMonth(subMonths(new Date(), i));
            const monthEnd = endOfMonth(subMonths(new Date(), i));
            const monthTotal = await ExpenseRepository.getTotalSpending(userId, monthStart, monthEnd);

            monthlyTrend.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                amount: monthTotal,
            });
        }

        return NextResponse.json({
            success: true,
            analytics: {
                totalExpenses,
                totalAmount,
                averageExpense,
                categoryDistribution,
                topCategories,
                monthlyTrend,
            },
        });
    } catch (error: any) {
        console.error('Analytics overview error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch analytics',
            },
            { status: 500 }
        );
    }
}
