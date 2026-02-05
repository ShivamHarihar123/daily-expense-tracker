import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getAccessToken } from '@/lib/auth/cookies';
import { UserRole } from '@/types/enums';

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

/**
 * Middleware to authenticate requests using JWT
 */
export async function authMiddleware(
    request: NextRequest
): Promise<{ authenticated: boolean; user?: any; response?: NextResponse }> {
    const token = getAccessToken(request);

    if (!token) {
        return {
            authenticated: false,
            response: NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            ),
        };
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
        return {
            authenticated: false,
            response: NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            ),
        };
    }

    return {
        authenticated: true,
        user: {
            userId: payload.userId,
            email: payload.email,
            role: payload.role as UserRole,
        },
    };
}

/**
 * Middleware to check if user has admin role
 */
export async function adminMiddleware(
    request: NextRequest
): Promise<{ authorized: boolean; user?: any; response?: NextResponse }> {
    const authResult = await authMiddleware(request);

    if (!authResult.authenticated) {
        return {
            authorized: false,
            response: authResult.response,
        };
    }

    if (authResult.user?.role !== UserRole.ADMIN) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            ),
        };
    }

    return {
        authorized: true,
        user: authResult.user,
    };
}

/**
 * Helper to extract user from request
 */
export async function getUserFromRequest(
    request: NextRequest
): Promise<{ userId: string; email: string; role: UserRole } | null> {
    const authResult = await authMiddleware(request);
    return authResult.authenticated ? authResult.user : null;
}
