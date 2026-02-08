import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/adminAuth';
import UserRepository from '@/repositories/UserRepository';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import BudgetRepository from '@/repositories/BudgetRepository';

/**
 * GET /api/admin/dashboard - Get admin dashboard statistics
 */
export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication
        const authResult = await adminAuthMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        // Get system statistics
        const [totalUsers, totalExpenses, totalBudgets, recentUsers] = await Promise.all([
            UserRepository.countUsers(),
            ExpenseRepository.countAllExpenses(),
            BudgetRepository.countAllBudgets(),
            UserRepository.getRecentUsers(10),
        ]);

        // Get total spending across all users
        const totalSpending = await ExpenseRepository.getTotalSystemSpending();

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalExpenses,
                    totalBudgets,
                    totalSpending,
                },
                recentUsers,
            },
        });
    } catch (error: any) {
        console.error('Admin dashboard error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch dashboard data',
            },
            { status: 500 }
        );
    }
}
