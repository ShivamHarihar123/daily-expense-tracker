import { NextRequest, NextResponse } from 'next/server';
import ExpenseService from '@/services/ExpenseService';
import { authMiddleware } from '@/middleware/auth';
import Papa from 'papaparse';

/**
 * POST /api/expenses/import - Import expenses from CSV
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();
        const { csvData } = body;

        if (!csvData || !Array.isArray(csvData)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid CSV data',
                },
                { status: 400 }
            );
        }

        const result = await ExpenseService.importFromCSV(
            authResult.user!.userId,
            csvData
        );

        return NextResponse.json({
            success: true,
            message: `Import completed. ${result.imported} expenses imported, ${result.failed} failed.`,
            ...result,
        });
    } catch (error: any) {
        console.error('Import expenses error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to import expenses',
            },
            { status: 500 }
        );
    }
}
