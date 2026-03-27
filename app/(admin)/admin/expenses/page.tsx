'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card/Card';
import styles from './page.module.scss';

interface UserSummary {
    _id: string; // userId
    totalSpent: number;
    totalExpenses: number;
    lastExpenseDate: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
}

interface PaginatedSummaries {
    data: UserSummary[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export default function AdminExpensesPage() {
    const router = useRouter();
    const [summaries, setSummaries] = useState<PaginatedSummaries | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchSummaries();
    }, [page]);

    // Handle search with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (page === 1) {
                fetchSummaries();
            } else {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const fetchSummaries = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                grouped: 'true',
                ...(search && { search }),
            });

            const response = await fetch(`/api/admin/expenses?${query}`);
            const data = await response.json();

            if (data.success) {
                setSummaries({
                    data: data.expenses,
                    pagination: data.pagination,
                });
            }
        } catch (error) {
            console.error('Failed to fetch expense summaries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !summaries) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading expense summaries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by user name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    {summaries?.data.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No user expense data found.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Total Expenses</th>
                                    <th>Total Spent</th>
                                    <th>Last Activity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaries?.data.map((summary) => (
                                    <tr key={summary._id}>
                                        <td className={styles.userCol}>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>
                                                    {summary.user.name}
                                                </span>
                                                <span className={styles.userEmail}>
                                                    {summary.user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.expenseCount}>
                                                {summary.totalExpenses} expenses
                                            </span>
                                        </td>
                                        <td className={styles.amount}>
                                            ₹{summary.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td>
                                            {new Date(summary.lastExpenseDate).toLocaleDateString()}
                                        </td>
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => router.push(`/admin/users/${summary._id}`)}
                                                title="View Historical Dossier"
                                            >
                                                <span>👁️ View Expenses</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {summaries && summaries.pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.info}>
                            Showing {summaries.data.length} of {summaries.pagination.totalItems} users
                        </div>
                        <div className={styles.buttons}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(summaries.pagination.totalPages, p + 1))}
                                disabled={page === summaries.pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
