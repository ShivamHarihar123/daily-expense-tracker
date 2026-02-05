import { NextRequest, NextResponse } from 'next/server';
import AuthService from '@/services/AuthService';
import { setAuthCookies } from '@/lib/auth/cookies';
import { validate } from '@/lib/utils/validation';
import { signupSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = validate(signupSchema, body);

        // Register user
        const { user, tokens } = await AuthService.signup(validatedData);

        // Set auth cookies
        const response = NextResponse.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your email.',
                user,
            },
            { status: 201 }
        );

        setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

        return response;
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Registration failed',
            },
            { status: 400 }
        );
    }
}
