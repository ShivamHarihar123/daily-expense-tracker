import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { UserRole } from '@/types/enums';

export interface AdminAuthResult {
    authenticated: boolean;
    user?: {
        userId: string;
        email: string;
        role: string;
    };
    response?: NextResponse;
}

/**
 * Admin authentication middleware
 * Verifies that the user is authenticated AND has admin role
 */
export async function adminAuthMiddleware(request: NextRequest): Promise<AdminAuthResult> {
    try {
        // Get token from cookie
        const token = request.cookies.get('accessToken')?.value;

        if (!token) {
            return {
                authenticated: false,
                response: NextResponse.json(
                    { success: false, error: 'Unauthorized - No token provided' },
                    { status: 401 }
                ),
            };
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        if (!decoded || !decoded.userId) {
            return {
                authenticated: false,
                response: NextResponse.json(
                    { success: false, error: 'Unauthorized - Invalid token' },
                    { status: 401 }
                ),
            };
        }

        // Check if user has admin role
        if (decoded.role !== UserRole.ADMIN) {
            return {
                authenticated: false,
                response: NextResponse.json(
                    { success: false, error: 'Forbidden - Admin access required' },
                    { status: 403 }
                ),
            };
        }

        return {
            authenticated: true,
            user: {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
            },
        };
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return {
            authenticated: false,
            response: NextResponse.json(
                { success: false, error: 'Authentication failed' },
                { status: 401 }
            ),
        };
    }
}
