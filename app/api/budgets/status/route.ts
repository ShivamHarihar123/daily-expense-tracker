import { NextRequest, NextResponse } from 'next/server';
import BudgetService from '@/services/BudgetService';
import { authMiddleware } from '@/middleware/auth';

/**
 * GET /api/budgets/status - Check budget status and alerts
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

        const status = await BudgetService.checkBudgetStatus(authResult.user!.userId, month, year);

        return NextResponse.json({
            success: true,
            ...status,
        });
    } catch (error: any) {
        console.error('Budget status error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to check budget status',
            },
            { status: 500 }
        );
    }
}
