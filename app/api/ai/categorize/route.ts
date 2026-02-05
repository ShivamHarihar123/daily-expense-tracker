import { NextRequest, NextResponse } from 'next/server';
import { categorizeExpense, suggestCategories } from '@/lib/ai/categorization';
import { authMiddleware } from '@/middleware/auth';

/**
 * POST /api/ai/categorize - AI-powered expense categorization
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();
        const { title, notes } = body;

        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title is required',
                },
                { status: 400 }
            );
        }

        // Get primary category prediction
        const prediction = categorizeExpense(title, notes);

        // Get alternative suggestions
        const suggestions = suggestCategories(title, notes);

        return NextResponse.json({
            success: true,
            prediction,
            suggestions,
        });
    } catch (error: any) {
        console.error('AI categorization error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to categorize expense',
            },
            { status: 500 }
        );
    }
}
