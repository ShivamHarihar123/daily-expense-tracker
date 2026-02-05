import { NextRequest, NextResponse } from 'next/server';
import BudgetService from '@/services/BudgetService';
import { authMiddleware } from '@/middleware/auth';
import { validate } from '@/lib/utils/validation';
import { createBudgetSchema, updateBudgetSchema } from '@/lib/utils/validation';

/**
 * GET /api/budgets - Get user budget
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const budget = await BudgetService.getBudget(authResult.user!.userId);

        return NextResponse.json({
            success: true,
            budget,
        });
    } catch (error: any) {
        console.error('Get budget error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch budget',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/budgets - Create or update budget
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();
        const validatedData = validate(createBudgetSchema, body);

        const budget = await BudgetService.setBudget(
            authResult.user!.userId,
            validatedData
        );

        return NextResponse.json({
            success: true,
            message: 'Budget saved successfully',
            budget,
        });
    } catch (error: any) {
        console.error('Set budget error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to save budget',
            },
            { status: 400 }
        );
    }
}

/**
 * DELETE /api/budgets - Delete budget
 */
export async function DELETE(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        await BudgetService.deleteBudget(authResult.user!.userId);

        return NextResponse.json({
            success: true,
            message: 'Budget deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete budget error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete budget',
            },
            { status: 400 }
        );
    }
}
