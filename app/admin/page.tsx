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
    const { user, isAuthenticated } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchDashboardData();
    }, [isAuthenticated, user, router]);

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
            <div className={styles.container}>
                <div className={styles.loading}>Loading admin dashboard...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p>System Overview and Management</p>
            </div>

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
                            ₹{stats?.totalSpending?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                </Card>
            </div>

            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionButtons}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => router.push('/admin/users')}
                    >
                        <span>👥</span>
                        Manage Users
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={() => router.push('/admin/analytics')}
                    >
                        <span>📊</span>
                        View Analytics
                    </button>
                </div>
            </div>

            <div className={styles.recentUsers}>
                <h2>Recent Users</h2>
                <Card>
                    <div className={styles.userTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={`${styles.badge} ${user.role === 'admin'
                                                    ? styles.badgeAdmin
                                                    : styles.badgeUser
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
