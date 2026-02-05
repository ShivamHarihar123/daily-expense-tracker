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

        let startDate: Date;
        let endDate: Date = new Date();

        switch (period) {
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = startOfMonth(new Date());
                endDate = endOfMonth(new Date());
                break;
            case 'year':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 12);
                break;
            default:
                startDate = startOfMonth(new Date());
                endDate = endOfMonth(new Date());
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
