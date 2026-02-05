import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/ExpenseService';
import { authMiddleware } from '@/middleware/auth';
import { validate } from '@/lib/utils/validation';
import { createExpenseSchema, expenseFilterSchema, paginationSchema } from '@/lib/utils/validation';

/**
 * GET /api/expenses - Get all expenses with filters
 */
export async function GET(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const { searchParams } = new URL(request.url);

        // Parse pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Parse filters
        const filters: any = {};
        if (searchParams.get('startDate')) filters.startDate = new Date(searchParams.get('startDate')!);
        if (searchParams.get('endDate')) filters.endDate = new Date(searchParams.get('endDate')!);
        if (searchParams.get('category')) filters.category = searchParams.get('category');
        if (searchParams.get('minAmount')) filters.minAmount = parseFloat(searchParams.get('minAmount')!);
        if (searchParams.get('maxAmount')) filters.maxAmount = parseFloat(searchParams.get('maxAmount')!);
        if (searchParams.get('paymentMode')) filters.paymentMode = searchParams.get('paymentMode');
        if (searchParams.get('search')) filters.search = searchParams.get('search');
        if (searchParams.get('tags')) filters.tags = searchParams.get('tags')!.split(',');

        const result = await ExpenseService.getExpenses(
            authResult.user!.userId,
            filters,
            page,
            limit
        );

        return NextResponse.json({
            success: true,
            expenses: result.data, // Rename 'data' to 'expenses' for frontend
            pagination: result.pagination,
            totalPages: result.pagination.totalPages,
        });
    } catch (error: any) {
        console.error('Get expenses error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch expenses',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/expenses - Create new expense
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();

        // Validate input
        const validatedData = validate(createExpenseSchema, body);

        // Create expense
        const expense = await ExpenseService.createExpense(
            authResult.user!.userId,
            validatedData
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Expense created successfully',
                expense,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create expense error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create expense',
            },
            { status: 400 }
        );
    }
}
