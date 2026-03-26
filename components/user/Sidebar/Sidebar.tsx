'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Expenses', path: '/expenses', icon: '💰' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Budgets', path: '/budgets', icon: '🎯' },
    { label: 'Edit Profile', path: '/profile', icon: '👤' },
];

export default function UserSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.icon}>💰</span>
                    <span>ExpenseTracker</span>
                </Link>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                <button
                    className={styles.logoutBtn}
                    onClick={async () => {
                        try {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            logout();
                            router.push('/login');
                        } catch (err) {
                            console.error('Logout failed:', err);
                        }
                    }}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
