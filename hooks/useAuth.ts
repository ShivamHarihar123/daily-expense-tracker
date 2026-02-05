'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

/**
 * Custom hook for authentication
 */
export function useAuth() {
    const { user, isAuthenticated, isLoading, setUser, setLoading, login, logout } = useAuthStore();

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (isLoading) {
            checkAuth();
        }
    }, [isLoading, setUser, setLoading]);

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
}
