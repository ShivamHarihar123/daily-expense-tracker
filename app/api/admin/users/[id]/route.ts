import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/adminAuth';
import UserRepository from '@/repositories/UserRepository';

/**
 * GET /api/admin/users/[id] - Get user details and history
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify admin authentication
        const authResult = await adminAuthMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const user = await UserRepository.findById(params.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Get expenses and budget
        const Expense = (await import('@/models/Expense')).default;
        const Budget = (await import('@/models/Budget')).default;

        const [expenses, budget] = await Promise.all([
            Expense.find({ userId: params.id, isDeleted: false }).sort({ date: -1 }),
            Budget.findOne({ 
                userId: params.id, 
                month: new Date().getMonth(), 
                year: new Date().getFullYear() 
            }),
        ]);

        return NextResponse.json({
            success: true,
            user,
            expenses,
            budget,
        });
    } catch (error: any) {
        console.error('Get user history error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch user history' },
            { status: 500 }
        );
    }
}

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
