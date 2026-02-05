import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/ExpenseService';
import { authMiddleware } from '@/middleware/auth';
import { validate } from '@/lib/utils/validation';
import { updateExpenseSchema } from '@/lib/utils/validation';

/**
 * GET /api/expenses/[id] - Get single expense
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const expense = await ExpenseService.getExpense(params.id, authResult.user!.userId);

        return NextResponse.json({
            success: true,
            expense,
        });
    } catch (error: any) {
        console.error('Get expense error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch expense',
            },
            { status: 404 }
        );
    }
}

/**
 * PUT /api/expenses/[id] - Update expense
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();
        const validatedData = validate(updateExpenseSchema, body);

        const expense = await ExpenseService.updateExpense(
            params.id,
            authResult.user!.userId,
            validatedData
        );

        return NextResponse.json({
            success: true,
            message: 'Expense updated successfully',
            expense,
        });
    } catch (error: any) {
        console.error('Update expense error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to update expense',
            },
            { status: 400 }
        );
    }
}

/**
 * DELETE /api/expenses/[id] - Delete expense
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        await ExpenseService.deleteExpense(params.id, authResult.user!.userId);

        return NextResponse.json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete expense error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete expense',
            },
            { status: 400 }
        );
    }
}
