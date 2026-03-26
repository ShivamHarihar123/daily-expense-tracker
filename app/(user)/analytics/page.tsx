'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import styles from './page.module.scss';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

interface Analytics {
    totalExpenses: number;
    totalAmount: number;
    averageExpense: number;
    categoryDistribution: Array<{ category: string; amount: number; count: number }>;
    monthlyTrends: Array<{ month: string; amount: number }>;
    topCategories: Array<{ category: string; amount: number; count: number }>;
}

interface AIInsight {
    type: string;
    message: string;
    icon: string;
}

function AnalyticsContent() {
    const router = useRouter();
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        fetchInsights();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics/overview?period=${period}`);
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async () => {
        try {
            const response = await fetch(`/api/ai/insights?period=${period}`);
            if (response.ok) {
                const data = await response.json();
                const formattedInsights: AIInsight[] = [
                    { type: 'spending', message: data.insights.spendingPattern, icon: '📊' },
                    { type: 'trend', message: data.insights.trend, icon: '📈' },
                    ...data.insights.recommendations.map((rec: string) => ({
                        type: 'recommendation',
                        message: rec,
                        icon: '💡',
                    })),
                ];
                setInsights(formattedInsights);
            }
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Skeleton variant="title" width="40%" />
                <div className={styles.statsGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} variant="card" height={100} />
                    ))}
                </div>
                <Skeleton variant="card" height={400} />
            </div>
        );
    }

    if (!analytics || analytics.totalExpenses === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📊</div>
                    <h3>No analytics available</h3>
                    <p>Start adding expenses to see your spending analytics</p>
                    <Button onClick={() => router.push('/expenses/new')}>
                        + Add Your First Expense
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Analytics Dashboard</h1>
                <p className={styles.subtitle}>
                    Visualize your spending patterns and get AI-powered insights
                </p>
            </div>

            <div className={styles.filters}>
                <button
                    className={`${styles.periodButton} ${period === 'week' ? styles.active : ''}`}
                    onClick={() => setPeriod('week')}
                >
                    This Week
                </button>
                <button
                    className={`${styles.periodButton} ${period === 'month' ? styles.active : ''}`}
                    onClick={() => setPeriod('month')}
                >
                    This Month
                </button>
                <button
                    className={`${styles.periodButton} ${period === 'year' ? styles.active : ''}`}
                    onClick={() => setPeriod('year')}
                >
                    This Year
                </button>
            </div>

            <div className={styles.statsGrid}>
                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💰</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Total Expenses</p>
                                <h2 className={styles.statValue}>{analytics.totalExpenses}</h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💸</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Total Spent</p>
                                <h2 className={styles.statValue}>₹{analytics.totalAmount.toFixed(2)}</h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📊</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Average Expense</p>
                                <h2 className={styles.statValue}>₹{analytics.averageExpense.toFixed(2)}</h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card hoverable>
                    <Card.Body>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🏷️</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Categories</p>
                                <h2 className={styles.statValue}>{analytics.categoryDistribution.length}</h2>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className={styles.chartsGrid}>
                <Card className={styles.chartCard}>
                    <Card.Body>
                        <h3 className={styles.chartTitle}>Category Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.categoryDistribution}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `${entry.category}: ₹${entry.amount.toFixed(0)}`}
                                >
                                    {analytics.categoryDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                <Card className={styles.chartCard}>
                    <Card.Body>
                        <h3 className={styles.chartTitle}>Spending Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
            </div>

            {analytics.topCategories.length > 0 && (
                <div className={styles.topCategories}>
                    <Card>
                        <Card.Header title="Top Spending Categories" />
                        <Card.Body>
                            <div className={styles.categoryList}>
                                {analytics.topCategories.slice(0, 5).map((cat, idx) => (
                                    <div key={idx} className={styles.categoryItem}>
                                        <div className={styles.categoryInfo}>
                                            <div className={styles.categoryIcon}>
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📌'}
                                            </div>
                                            <div>
                                                <div className={styles.categoryName}>{cat.category}</div>
                                                <div className={styles.categoryCount}>{cat.count} expenses</div>
                                            </div>
                                        </div>
                                        <div className={styles.categoryAmount}>₹{cat.amount.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {insights.length > 0 && (
                <div className={styles.insightsSection}>
                    <h2 className={styles.title} style={{ marginBottom: '24px' }}>
                        🤖 AI Insights
                    </h2>
                    <div className={styles.insightsGrid}>
                        {insights.map((insight, idx) => (
                            <div key={idx} className={styles.insightCard}>
                                <div className={styles.insightHeader}>
                                    <span className={styles.insightIcon}>{insight.icon}</span>
                                    <span className={styles.insightTitle}>
                                        {insight.type === 'spending' ? 'Spending Pattern' :
                                            insight.type === 'trend' ? 'Trend Analysis' : 'Recommendation'}
                                    </span>
                                </div>
                                <p className={styles.insightText}>{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <AnalyticsContent />
        </ProtectedRoute>
    );
}
