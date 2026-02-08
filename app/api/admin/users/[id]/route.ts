import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/adminAuth';
import UserRepository from '@/repositories/UserRepository';

/**
 * PATCH /api/admin/users/[id] - Update user
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin authentication
        const authResult = await adminAuthMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const body = await request.json();
        const user = await UserRepository.updateUser(params.id, body);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user,
        });
    } catch (error: any) {
        console.error('Update user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to update user',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/users/[id] - Delete user
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin authentication
        const authResult = await adminAuthMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        // Prevent admin from deleting themselves
        if (authResult.user?.userId === params.id) {
            return NextResponse.json(
                { success: false, error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        await UserRepository.deleteUser(params.id);

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete user',
            },
            { status: 500 }
        );
    }
}
