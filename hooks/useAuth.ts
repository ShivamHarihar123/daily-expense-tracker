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
                // First attempt: check if access token is valid
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else if (response.status === 401) {
                    // Second attempt: try refreshing the session
                    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        setUser(refreshData.user);
                    } else {
                        // All auth check failed
                        setUser(null);
                    }
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
