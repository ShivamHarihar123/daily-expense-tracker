import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/ExpenseService';
import { authMiddleware } from '@/middleware/auth';

/**
 * GET /api/expenses/export - Export expenses to CSV
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const { searchParams } = new URL(request.url);

        // Parse filters
        const filters: any = {};
        if (searchParams.get('startDate')) filters.startDate = new Date(searchParams.get('startDate')!);
        if (searchParams.get('endDate')) filters.endDate = new Date(searchParams.get('endDate')!);
        if (searchParams.get('category')) filters.category = searchParams.get('category');

        const csvData = await ExpenseService.exportToCSV(
            authResult.user!.userId,
            filters
        );

        return NextResponse.json({
            success: true,
            data: csvData,
        });
    } catch (error: any) {
        console.error('Export expenses error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to export expenses',
            },
            { status: 500 }
        );
    }
}
