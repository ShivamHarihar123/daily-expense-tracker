'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import { format } from 'date-fns';
import styles from './page.module.scss';

interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    paymentMode: string;
    currency: string;
    tags?: string[];
    notes?: string;
}

function ExpenseDetailContent() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchExpense = useCallback(async () => {
        try {
            const response = await fetch(`/api/expenses/${id}`);
            if (response.ok) {
                const data = await response.json();
                setExpense(data.expense);
            } else {
                alert('Expense not found');
                router.push('/expenses');
            }
        } catch (error) {
            console.error('Failed to fetch expense:', error);
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchExpense();
    }, [id, fetchExpense]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/expenses');
            } else {
                alert('Failed to delete expense');
            }
        } catch (error) {
            console.error('Failed to delete expense:', error);
            alert('An error occurred');
        } finally {
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Skeleton variant="title" width="40%" />
                <Skeleton variant="card" height={400} />
            </div>
        );
    }

    if (!expense) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/expenses" className={styles.backButton}>
                    ← Back to Expenses
                </Link>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => router.push(`/expenses/${id}/edit`)}>
                        ✏️ Edit
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                        🗑️ Delete
                    </Button>
                </div>
            </div>

            <Card>
                <Card.Body>
                    <div className={styles.detailCard}>
                        <div className={styles.amount}>
                            {expense.currency} ₹{expense.amount.toFixed(2)}
                        </div>
                        <h1 className={styles.title}>{expense.title}</h1>

                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <h4>Category</h4>
                                <p>
                                    <span className={styles.category}>{expense.category}</span>
                                </p>
                            </div>

                            <div className={styles.detailItem}>
                                <h4>Date</h4>
                                <p>{format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
                            </div>

                            <div className={styles.detailItem}>
                                <h4>Payment Mode</h4>
                                <p>{expense.paymentMode}</p>
                            </div>

                            <div className={styles.detailItem}>
                                <h4>Currency</h4>
                                <p>{expense.currency}</p>
                            </div>
                        </div>

                        {expense.tags && expense.tags.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>
                                    Tags
                                </h4>
                                <div className={styles.tags}>
                                    {expense.tags.map((tag, idx) => (
                                        <span key={idx} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {expense.notes && (
                            <div>
                                <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 500 }}>
                                    Notes
                                </h4>
                                <div className={styles.notes}>{expense.notes}</div>
                            </div>
                        )}

                        <div className={styles.deleteButton}>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                                Created on {format(new Date(expense.date), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Expense"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" loading={deleting} onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default function ExpenseDetailPage() {
    return (
        <ProtectedRoute>
            <ExpenseDetailContent />
        </ProtectedRoute>
    );
}
