'use client';

import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import ThemeToggle from '../../layout/Navbar/ThemeToggle';

export default function AdminHeader() {
    const { user } = useAuthStore();
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.pathBreadcrumb}>
                    <span className={styles.segment}>System</span>
                    <span className={styles.separator}>/</span>
                    {pathSegments.map((segment, index) => (
                        <span
                            key={segment}
                            className={`${styles.segment} ${index === pathSegments.length - 1 ? styles.active : ''}`}
                        >
                            {segment}
                            {index < pathSegments.length - 1 && <span className={styles.separator}> / </span>}
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.right}>
                <ThemeToggle />
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {user?.name?.[0].toUpperCase() || 'A'}
                    </div>
                    <div className={styles.details}>
                        <span className={styles.name}>{user?.name || 'Administrator'}</span>
                        <span className={styles.badge}>System Superuser</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
