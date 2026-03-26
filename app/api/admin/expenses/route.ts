import { NextRequest, NextResponse } from 'next/server';
import ExpenseRepository from '@/repositories/ExpenseRepository';
import { adminAuthMiddleware } from '@/middleware/adminAuth';

export async function GET(request: NextRequest) {
    // Check admin authorization
    const auth = await adminAuthMiddleware(request);
    if (!auth.authenticated || !auth.user) {
        return auth.response || NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || undefined;
        const category = searchParams.get('category') || undefined;

        const result = await ExpenseRepository.getAllExpensesAdmin(page, limit, search, category);

        return NextResponse.json({
            success: true,
            expenses: result.data,
            pagination: result.pagination,
        });
    } catch (error: any) {
        console.error('Failed to fetch admin expenses:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
