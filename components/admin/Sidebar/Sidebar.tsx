'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Manage Users', path: '/admin/users', icon: '👥' },
    { label: 'Manage Expenses', path: '/admin/expenses', icon: '💰' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <div className={styles.logo}>
                    <span className={styles.icon}>🏺</span>
                    <span>AdminPanel</span>
                    <span className={styles.badge}>Pro</span>
                </div>
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
                    className={`${styles.exitBtn} ${styles.logoutBtn}`}
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
                    <span>🔒</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
