'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { ExpenseCategory } from '@/types/enums';
import { format } from 'date-fns';
import styles from './page.module.scss';

interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    paymentMode: string;
    tags?: string[];
    notes?: string;
}

function ExpenseListContent() {
    const router = useRouter();
    const pathname = usePathname();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        startDate: '',
        endDate: '',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchExpenses();
    }, [page, filters, pathname]); // Added pathname to trigger refetch

    // Refetch when component mounts or becomes visible (e.g., after adding expense)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchExpenses();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Also refetch when window gains focus
        window.addEventListener('focus', fetchExpenses);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', fetchExpenses);
        };
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(filters.search && { search: filters.search }),
                ...(filters.category && { category: filters.category }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            });

            const response = await fetch(`/api/expenses?${params}`);
            if (response.ok) {
                const data = await response.json();
                setExpenses(data.expenses || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            startDate: '',
            endDate: '',
        });
        setPage(1);
    };

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...Object.values(ExpenseCategory).map((cat) => ({
            value: cat,
            label: cat,
        })),
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Expenses</h1>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => router.push('/expenses/import')}>
                        📥 Import CSV
                    </Button>
                    <Button onClick={() => router.push('/expenses/new')}>
                        + Add Expense
                    </Button>
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGrid}>
                    <Input
                        type="text"
                        placeholder="Search expenses..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <Select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        options={categoryOptions}
                    />
                    <Input
                        type="date"
                        placeholder="Start Date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <Input
                        type="date"
                        placeholder="End Date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                </div>
                <div className={styles.filterActions}>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchExpenses}>
                        Apply Filters
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className={styles.expenseList}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} variant="card" height={120} />
                    ))}
                </div>
            ) : expenses.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>💰</div>
                    <h3>No expenses found</h3>
                    <p>Start tracking your expenses by adding your first one!</p>
                    <Button onClick={() => router.push('/expenses/new')}>
                        + Add Your First Expense
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.expenseList}>
                        {expenses.map((expense) => (
                            <div
                                key={expense._id}
                                className={styles.expenseCard}
                                onClick={() => router.push(`/expenses/${expense._id}`)}
                            >
                                <div className={styles.expenseHeader}>
                                    <h3 className={styles.expenseTitle}>{expense.title}</h3>
                                    <span className={styles.expenseAmount}>
                                        ${expense.amount.toFixed(2)}
                                    </span>
                                </div>
                                <div className={styles.expenseDetails}>
                                    <div className={styles.expenseDetail}>
                                        <span className={styles.category}>{expense.category}</span>
                                    </div>
                                    <div className={styles.expenseDetail}>
                                        📅 {format(new Date(expense.date), 'MMM dd, yyyy')}
                                    </div>
                                    <div className={styles.expenseDetail}>
                                        💳 {expense.paymentMode}
                                    </div>
                                    {expense.tags && expense.tags.length > 0 && (
                                        <div className={styles.tags}>
                                            {expense.tags.map((tag, idx) => (
                                                <span key={idx} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ←
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`${styles.pageButton} ${p === page ? styles.active : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className={styles.pageButton}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function ExpenseListPage() {
    return (
        <ProtectedRoute>
            <ExpenseListContent />
        </ProtectedRoute>
    );
}
