'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card/Card';
import styles from './page.module.scss';
import { IExpense } from '@/types/models';

interface PaginatedExpenses {
    data: (Omit<IExpense, 'userId'> & { userId: { _id: string; name: string; email: string } | string | null })[];
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
    const [expenses, setExpenses] = useState<PaginatedExpenses | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchExpenses();
    }, [page, category]);

    // Handle search with debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (page === 1) {
                fetchExpenses();
            } else {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(search && { search }),
                ...(category && { category }),
            });

            const response = await fetch(`/api/admin/expenses?${query}`);
            const data = await response.json();

            if (data.success) {
                setExpenses({
                    data: data.expenses,
                    pagination: data.pagination,
                });
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
            return;
        }

        try {
            setDeletingId(id);
            const response = await fetch(`/api/admin/expenses/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                // Refresh data
                fetchExpenses();
            } else {
                alert(data.error || 'Failed to delete expense');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete expense');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && !expenses) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading expenses...</p>
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
                        placeholder="Search by title or notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.filterBox}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Bills & Utilities">Bills & Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health & Fitness">Health & Fitness</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>

            <Card className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    {expenses?.data.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No expenses found.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Expense Title</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses?.data.map((expense) => (
                                    <tr key={expense._id}>
                                        <td className={styles.userCol}>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>
                                                    {typeof expense.userId === 'object' && expense.userId ? expense.userId.name : 'Unknown User'}
                                                </span>
                                                <span className={styles.userEmail}>
                                                    {typeof expense.userId === 'object' && expense.userId ? expense.userId.email : (typeof expense.userId === 'string' ? `ID: ${expense.userId}` : 'N/A')}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{expense.title}</td>
                                        <td className={styles.amount}>
                                            ₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td>
                                            <span className={styles.categoryBadge}>{expense.category}</span>
                                        </td>
                                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.viewBtn}
                                                onClick={() => router.push(`/admin/users/${typeof expense.userId === 'object' ? (expense.userId as any)._id : expense.userId}`)}
                                                title="View User Details"
                                            >
                                                <span>👁️</span>
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(expense._id)}
                                                disabled={deletingId === expense._id}
                                                title="Delete Expense"
                                            >
                                                <span>🗑️</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {expenses && expenses.pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.info}>
                            Showing {expenses.data.length} of {expenses.pagination.totalItems} expenses
                        </div>
                        <div className={styles.buttons}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(expenses.pagination.totalPages, p + 1))}
                                disabled={page === expenses.pagination.totalPages}
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
