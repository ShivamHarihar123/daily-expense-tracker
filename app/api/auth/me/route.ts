import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { updateProfileSchema, validate } from '@/lib/utils/validation';
import UserRepository from '@/repositories/UserRepository';

/**
 * GET /api/auth/me - Get current user
 */
export async function GET(request: NextRequest) {
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

/**
 * PUT /api/auth/me - Update profile
 */
export async function PUT(request: NextRequest) {
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
        const validatedData = validate(updateProfileSchema, body);

        const updatedUser = await UserRepository.update(authResult.user.userId, validatedData);

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to update profile',
            },
            { status: 400 }
        );
    }
}

/**
 * DELETE /api/auth/me - Delete account
 */
export async function DELETE(request: NextRequest) {
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

        await UserRepository.delete(authResult.user.userId);

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete account',
            },
            { status: 500 }
        );
    }
}
