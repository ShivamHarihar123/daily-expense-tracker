import { NextRequest, NextResponse } from 'next/server';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import { adminAuthMiddleware } from '@/middleware/adminAuth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const auth = await adminAuthMiddleware(request);
    if (!auth.authenticated || !auth.user) {
        return auth.response || NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await ExpenseRepository.deleteExpenseAdmin(params.id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (error: any) {
        console.error('Failed to delete admin expense:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const auth = await adminAuthMiddleware(request);
    if (!auth.authenticated || !auth.user) {
        return auth.response || NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const result = await ExpenseRepository.updateExpenseAdmin(params.id, body);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            expense: result,
            message: 'Expense updated successfully',
        });
    } catch (error: any) {
        console.error('Failed to update admin expense:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
