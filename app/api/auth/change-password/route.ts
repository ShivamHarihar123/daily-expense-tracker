import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { changePasswordSchema, validate } from '@/lib/utils/validation';
import AuthService from '@/services/AuthService';

/**
 * POST /api/auth/change-password - Change password
 */
export async function POST(request: NextRequest) {
    try {
        const authResult = await authMiddleware(request);

        if (!authResult.authenticated || !authResult.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Not authenticated',
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = validate(changePasswordSchema, body);

        await AuthService.changePassword(
            authResult.user.userId,
            validatedData.currentPassword,
            validatedData.newPassword
        );

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error: any) {
        console.error('Change password error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to change password',
            },
            { status: 400 }
        );
    }
}
