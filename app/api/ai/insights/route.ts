import { NextRequest, NextResponse } from 'next/server';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import { generateInsights } from '@/lib/ai/insights';
import { authMiddleware } from '@/middleware/auth';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * GET /api/ai/insights - Get AI-powered financial insights
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
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case 'year':
                startDate = new Date(year, 0, 1);
                endDate = new Date(year, 11, 31, 23, 59, 59, 999);
                break;
            case 'month':
            default:
                startDate = startOfMonth(new Date(year, month, 1));
                endDate = endOfMonth(new Date(year, month, 1));
        }

        const userId = authResult.user!.userId;
        const expenses = await ExpenseRepository.findByDateRange(userId, startDate, endDate);

        const insights = generateInsights(expenses);

        return NextResponse.json({
            success: true,
            insights,
        });
    } catch (error: any) {
        console.error('AI insights error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to generate insights',
            },
            { status: 500 }
        );
    }
}
