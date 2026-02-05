'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import styles from './Navbar.module.scss';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.icon}>💰</span>
                    <span>ExpenseTracker</span>
                </Link>

                {isAuthenticated && (
                    <div className={styles.nav}>
                        <Link
                            href="/dashboard"
                            className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/expenses"
                            className={`${styles.navLink} ${pathname === '/expenses' ? styles.active : ''}`}
                        >
                            Expenses
                        </Link>
                        <Link
                            href="/analytics"
                            className={`${styles.navLink} ${pathname === '/analytics' ? styles.active : ''}`}
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/budgets"
                            className={`${styles.navLink} ${pathname === '/budgets' ? styles.active : ''}`}
                        >
                            Budgets
                        </Link>
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {isAuthenticated && user ? (
                        <div className={styles.userMenu} ref={dropdownRef}>
                            <button
                                className={styles.userButton}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className={styles.avatar}>{getInitials(user.name)}</div>
                                <span className={styles.userName}>{user.name}</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    style={{
                                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s',
                                    }}
                                >
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className={styles.dropdown}>
                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            router.push('/profile');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span>👤</span>
                                        Profile
                                    </button>
                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            router.push('/settings');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span>⚙️</span>
                                        Settings
                                    </button>
                                    <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                                    <button
                                        className={`${styles.dropdownItem} ${styles.danger}`}
                                        onClick={handleLogout}
                                    >
                                        <span>🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => router.push('/login')}>
                                Sign In
                            </Button>
                            <Button onClick={() => router.push('/signup')}>
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
