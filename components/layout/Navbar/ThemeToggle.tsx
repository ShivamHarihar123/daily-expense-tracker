'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-all duration-200 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}
