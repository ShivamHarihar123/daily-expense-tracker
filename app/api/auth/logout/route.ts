import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
    try {
        const response = NextResponse.json(
            {
                success: true,
                message: 'Logout successful',
            },
            { status: 200 }
        );

        // Clear auth cookies
        clearAuthCookies(response);

        return response;
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Logout failed',
            },
            { status: 500 }
        );
    }
}
