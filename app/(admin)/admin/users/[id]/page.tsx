'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IExpense, IBudget, IUser } from '@/types/models';
import styles from './page.module.scss';

interface UserHistoryData {
    user: IUser;
    expenses: IExpense[];
    budget: IBudget | null;
}

export default function UserHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<UserHistoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [monthFilter, setMonthFilter] = useState<string>('all');

    useEffect(() => {
        fetchUserHistory();
    }, [params.id]);

    const fetchUserHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/users/${params.id}`);
            const result = await response.json();

            if (result.success) {
                setData({
                    user: result.user,
                    expenses: result.expenses,
                    budget: result.budget,
                });
            } else {
                alert(result.error || 'Failed to fetch user history');
                router.push('/admin/users');
            }
        } catch (error) {
            console.error('Failed to fetch user history:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Retrieving user financial history...</p>
            </div>
        );
    }

    if (!data) return null;

    // Get unique months from expenses for the filter
    const months = Array.from(new Set(data.expenses.map((exp: IExpense) => {
        const date = new Date(exp.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))).sort().reverse();

    const filteredExpenses = monthFilter === 'all' 
        ? data.expenses 
        : data.expenses.filter((exp: IExpense) => {
            const date = new Date(exp.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return key === monthFilter;
        });

    const totalSpent = filteredExpenses.reduce((acc: number, curr: IExpense) => acc + curr.amount, 0);
    const monthlyBudget = data.budget?.monthlyLimit || 0;
    const budgetUtilization = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.backAction}>
                    <Button variant="ghost" onClick={() => router.back()}>
                        ← Back to List
                    </Button>
                </div>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>User Financial Dossier</h1>
                    <p className={styles.subtitle}>Detailed historical record for {data.user.name}</p>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statsCard}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Lifetime Spending</span>
                        <h2 className={styles.statValue}>₹{totalSpent.toLocaleString()}</h2>
                    </div>
                    <div className={styles.statIcon}>💰</div>
                </Card>

                <Card className={styles.statsCard}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Monthly Budget</span>
                        <h2 className={styles.statValue}>₹{monthlyBudget.toLocaleString()}</h2>
                    </div>
                    <div className={styles.statIcon}>📊</div>
                </Card>

                <Card className={styles.statsCard}>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Budget Utilization</span>
                        <h2 className={styles.statValue}>{budgetUtilization.toFixed(1)}%</h2>
                        <div className={styles.progressBar}>
                            <div 
                                className={styles.progressFill} 
                                style={{ width: `${Math.min(budgetUtilization, 100)}%`, backgroundColor: budgetUtilization > 100 ? '#ef4444' : '#6366f1' }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className={styles.userProfileCard}>
                <Card>
                    <Card.Header title="Profile Summary" />
                    <Card.Body>
                        <div className={styles.profileGrid}>
                            <div className={styles.profileItem}>
                                <label>Full Name</label>
                                <span>{data.user.name}</span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>Email Address</label>
                                <span>{data.user.email}</span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>Account Status</label>
                                <span className={data.user.verified ? styles.verified : styles.unverified}>
                                    {data.user.verified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                            <div className={styles.profileItem}>
                                <label>Member Since</label>
                                <span>{new Date(data.user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <Card className={styles.historyCard}>
                <Card.Header 
                    title="Comprehensive Expense History" 
                    subtitle={`Showing ${filteredExpenses.length} transactions`}
                    action={
                        <select 
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className={styles.monthSelect}
                        >
                            <option value="all">All Time</option>
                            {months.map(month => {
                                const [year, m] = month.split('-');
                                const date = new Date(parseInt(year), parseInt(m) - 1);
                                return (
                                    <option key={month} value={month}>
                                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </option>
                                );
                            })}
                        </select>
                    }
                />
                <div className={styles.tableWrapper}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Expense Title</th>
                                <th>Category</th>
                                <th>Payment Mode</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className={styles.titleCol}>{expense.title}</td>
                                    <td>
                                        <span className={styles.categoryBadge}>{expense.category}</span>
                                    </td>
                                    <td>{expense.paymentMode}</td>
                                    <td className={styles.amountCol}>₹{expense.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={styles.emptyTable}>No expense records found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
