import { serialize, parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
};

/**
 * Set access token cookie
 */
export function setAccessTokenCookie(response: NextResponse, token: string): void {
    const cookie = serialize('accessToken', token, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60, // 15 minutes
    });

    response.headers.append('Set-Cookie', cookie);
}

/**
 * Set refresh token cookie
 */
export function setRefreshTokenCookie(response: NextResponse, token: string): void {
    const cookie = serialize('refreshToken', token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.headers.append('Set-Cookie', cookie);
}

/**
 * Set both access and refresh token cookies
 */
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
): void {
    setAccessTokenCookie(response, accessToken);
    setRefreshTokenCookie(response, refreshToken);
}

/**
 * Clear access token cookie
 */
export function clearAccessTokenCookie(response: NextResponse): void {
    const cookie = serialize('accessToken', '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    });

    response.headers.append('Set-Cookie', cookie);
}

/**
 * Clear refresh token cookie
 */
export function clearRefreshTokenCookie(response: NextResponse): void {
    const cookie = serialize('refreshToken', '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
    });

    response.headers.append('Set-Cookie', cookie);
}

/**
 * Clear all auth cookies
 */
export function clearAuthCookies(response: NextResponse): void {
    clearAccessTokenCookie(response);
    clearRefreshTokenCookie(response);
}

/**
 * Get access token from request cookies
 */
export function getAccessToken(request: NextRequest): string | null {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = parse(cookieHeader);
    return cookies.accessToken || null;
}

/**
 * Get refresh token from request cookies
 */
export function getRefreshToken(request: NextRequest): string | null {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = parse(cookieHeader);
    return cookies.refreshToken || null;
}
