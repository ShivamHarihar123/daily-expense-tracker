'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/admin/Sidebar/Sidebar';
import AdminHeader from '@/components/admin/Header/Header';
import styles from './layout.module.scss';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        setAuthorized(true);
    }, [isAuthenticated, user, router]);

    if (!authorized) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Establishing secure connection...</p>
            </div>
        );
    }

    return (
        <div className={styles.adminMain}>
            <AdminSidebar />
            <div className={styles.contentWrapper}>
                <AdminHeader />
                <main className={styles.mainContent}>
                    <div className={styles.fadeContainer}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
