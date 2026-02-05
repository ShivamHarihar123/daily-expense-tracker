import { NextRequest, NextResponse } from 'next/server';
import AuthService from '@/services/AuthService';
import { setAuthCookies } from '@/lib/auth/cookies';
import { validate } from '@/lib/utils/validation';
import { loginSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = validate(loginSchema, body);

        // Login user
        const { user, tokens } = await AuthService.login(validatedData);

        // Set auth cookies
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user,
            },
            { status: 200 }
        );

        setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Login failed',
            },
            { status: 401 }
        );
    }
}
