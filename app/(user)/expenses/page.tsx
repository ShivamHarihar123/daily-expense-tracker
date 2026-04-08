'use client';

import { useState, useEffect, useCallback } from 'react';
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
    
    // New month/year state for consistent selection
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const [filters, setFilters] = useState({
        search: '',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({
        totalSpent: 0,
        monthlyBudget: 0,
        remaining: 0,
    });

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                startDate,
                ...(filters.search && { search: filters.search }),
            });

            const response = await fetch(`/api/expenses?${params}`);
            if (response.ok) {
                const data = await response.json();
                setExpenses(data.expenses || []);
                setTotalPages(data.totalPages || 1);
                if (data.summary) {
                    setSummary(data.summary);
                }
            }
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    }, [page, filters.search, selectedMonth, selectedYear]);

    useEffect(() => {
        fetchExpenses();
    }, [page, filters.search, selectedMonth, selectedYear, pathname, fetchExpenses]);

    const handleSearchChange = (value: string) => {
        setFilters({ search: value });
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ search: '' });
        setSelectedMonth(new Date().getMonth());
        setSelectedYear(new Date().getFullYear());
        setPage(1);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Expenses</h1>
                    <p className={styles.periodLabel}>
                        Budget Period: {months[selectedMonth]} {selectedYear}
                    </p>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => router.push('/expenses/new')}>
                        + Add Expense
                    </Button>
                </div>
            </div>

            {/* Summary Section */}
            <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Spent</span>
                    <span className={styles.summaryValue}>₹{summary.totalSpent.toFixed(2)}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Monthly Budget</span>
                    <span className={styles.summaryValue}>₹{summary.monthlyBudget.toFixed(2)}</span>
                </div>
                <div className={`${styles.summaryItem} ${summary.remaining < 0 ? styles.overBudget : ''}`}>
                    <span className={styles.summaryLabel}>Remaining</span>
                    <span className={styles.summaryValue}>₹{summary.remaining.toFixed(2)}</span>
                </div>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGrid}>
                    <Input
                        type="text"
                        label="Search"
                        placeholder="Search expenses..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Select
                        label="Month"
                        value={selectedMonth.toString()}
                        onChange={(e) => {
                            setSelectedMonth(parseInt(e.target.value));
                            setPage(1);
                        }}
                        options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                    />
                    <Select
                        label="Year"
                        value={selectedYear.toString()}
                        onChange={(e) => {
                            setSelectedYear(parseInt(e.target.value));
                            setPage(1);
                        }}
                        options={years.map((y) => ({ value: y.toString(), label: y.toString() }))}
                    />
                </div>
                <div className={styles.filterActions}>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchExpenses}>
                        Refresh
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
                    <h3>No expenses found for {months[selectedMonth]} {selectedYear}</h3>
                    <p>Start tracking your expenses by adding your first one!</p>
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
                                        ₹{expense.amount.toFixed(2)}
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
