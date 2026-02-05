'use client';

import { useUIStore } from '@/store/uiStore';

/**
 * Custom hook for theme management
 */
export function useTheme() {
    const { theme, toggleTheme, setTheme } = useUIStore();

    // Apply theme to document
    if (typeof window !== 'undefined') {
        document.body.setAttribute('data-theme', theme);
    }

    return {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
    };
}
