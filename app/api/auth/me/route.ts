import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';

/**
 * GET /api/auth/me - Get current user
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);

        if (!authResult.authenticated) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Not authenticated',
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: authResult.user,
        });
    } catch (error: any) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get user',
            },
            { status: 500 }
        );
    }
}
