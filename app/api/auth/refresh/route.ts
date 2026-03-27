import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokens } from '@/lib/auth/jwt';
import { getRefreshToken, setAuthCookies } from '@/lib/auth/cookies';
import UserRepository from '@/repositories/UserRepository';

/**
 * POST /api/auth/refresh - Refresh access token
 */
export async function POST(request: NextRequest) {
    try {
        const refreshToken = getRefreshToken(request);

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: 'No refresh token' },
                { status: 401 }
            );
        }

        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        const user = await UserRepository.findById(payload.userId);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 401 }
            );
        }

        const tokens = generateTokens(user);
        const response = NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

        setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
        return response;
    } catch (error: any) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}
