'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card/Card';
import styles from './page.module.scss';

interface DashboardStats {
    totalUsers: number;
    totalExpenses: number;
    totalBudgets: number;
    totalSpending: number;
}

interface RecentUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            const data = await response.json();

            if (data.success) {
                setStats(data.data.overview);
                setRecentUsers(data.data.recentUsers);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Gathering system data...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statInfo}>
                        <h3>Total Users</h3>
                        <p className={styles.statValue}>{stats?.totalUsers || 0}</p>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statInfo}>
                        <h3>Total Expenses</h3>
                        <p className={styles.statValue}>{stats?.totalExpenses || 0}</p>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>🎯</div>
                    <div className={styles.statInfo}>
                        <h3>Total Budgets</h3>
                        <p className={styles.statValue}>{stats?.totalBudgets || 0}</p>
                    </div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statInfo}>
                        <h3>Total Spending</h3>
                        <p className={styles.statValue}>
                            ₹{stats?.totalSpending?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                        </p>
                    </div>
                </Card>
            </div>

            <div className={styles.row}>
                <div className={styles.recentUsers}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Registrations</h2>
                        <button onClick={() => router.push('/admin/users')}>View All</button>
                    </div>
                    <Card>
                        <div className={styles.userTable}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className={styles.quickActions}>
                    <h2>Quick Links</h2>
                    <div className={styles.actionGrid}>
                        <button onClick={() => router.push('/admin/users')}>Manage Users</button>
                        <button onClick={() => router.push('/admin/expenses')}>System Expenses</button>
                        <button onClick={() => router.push('/admin/analytics')}>Full Analytics</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
