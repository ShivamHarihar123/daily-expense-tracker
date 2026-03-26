'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import styles from './page.module.scss';

function SettingsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/profile');
    }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.loader}>
                <div className={styles.spinner}></div>
                <p className={styles.text}>Redirecting to settings...</p>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsRedirect />
        </ProtectedRoute>
    );
}
