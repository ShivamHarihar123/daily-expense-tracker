'use client';

import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeToggle.module.scss';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}
