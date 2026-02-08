import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/middleware/adminAuth';
import UserRepository from '@/repositories/UserRepository';

/**
 * GET /api/admin/users - Get all users with pagination
 */
export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication
        const authResult = await adminAuthMiddleware(request);
        if (!authResult.authenticated) {
            return authResult.response;
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';

        const result = await UserRepository.getAllUsers({
            page,
            limit,
            search,
            role,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        console.error('Get users error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch users',
            },
            { status: 500 }
        );
    }
}
