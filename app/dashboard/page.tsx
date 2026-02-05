'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.scss';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [stats, setStats] = useState({
        totalExpenses: 0,
        totalAmount: 0,
        monthlyBudget: 0,
        budgetUsed: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [analyticsRes, budgetRes] = await Promise.all([
                    fetch('/api/analytics/overview?period=month'),
                    fetch('/api/budgets/status'),
                ]);

                if (analyticsRes.ok) {
                    const analyticsData = await analyticsRes.json();
                    setStats((prev) => ({
                        ...prev,
                        totalExpenses: analyticsData.analytics.totalExpenses,
                        totalAmount: analyticsData.analytics.totalAmount,
                    }));
                }

                if (budgetRes.ok) {
                    const budgetData = await budgetRes.json();
                    setStats((prev) => ({
                        ...prev,
                        monthlyBudget: budgetData.budget?.monthlyLimit || 0,
                        budgetUsed: budgetData.percentageUsed || 0,
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <Skeleton variant="title" width="40%" />
                <div className={styles.statsGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="card" />
                    ))}
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Welcome back, {user?.name}! 👋</h1>
                    <p className={styles.subtitle}>Here's your financial overview for this month</p>
                </div>
                <Button onClick={() => router.push('/expenses/new')}>
                    + Add Expense
                </Button>
            </div>

            <div className={styles.statsGrid}>
                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💰</div>
                            <div>
                                <p className={styles.statLabel}>Total Expenses</p>
                                <h2 className={styles.statValue}>
                                    {loading ? <Skeleton width={100} /> : stats.totalExpenses}
                                </h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💸</div>
                            <div>
                                <p className={styles.statLabel}>Total Spent</p>
                                <h2 className={styles.statValue}>
                                    {loading ? <Skeleton width={100} /> : `$${stats.totalAmount.toFixed(2)}`}
                                </h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🎯</div>
                            <div>
                                <p className={styles.statLabel}>Monthly Budget</p>
                                <h2 className={styles.statValue}>
                                    {loading ? (
                                        <Skeleton width={100} />
                                    ) : stats.monthlyBudget > 0 ? (
                                        `$${stats.monthlyBudget.toFixed(2)}`
                                    ) : (
                                        'Not Set'
                                    )}
                                </h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📊</div>
                            <div>
                                <p className={styles.statLabel}>Budget Used</p>
                                <h2 className={styles.statValue}>
                                    {loading ? <Skeleton width={100} /> : `${stats.budgetUsed.toFixed(1)}%`}
                                </h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className={styles.quickActions}>
                <Card>
                    <Card.Header title="Quick Actions" />
                    <Card.Body>
                        <div className={styles.actionGrid}>
                            <Button variant="outline" onClick={() => router.push('/expenses')}>
                                View All Expenses
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/analytics')}>
                                View Analytics
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/budgets')}>
                                Manage Budget
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/profile')}>
                                Edit Profile
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}
