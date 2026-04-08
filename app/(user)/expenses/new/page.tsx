'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { TextArea, Select } from '@/components/ui/Input';
import { ExpenseCategory, PaymentMode } from '@/types/enums';
import styles from './page.module.scss';

interface AISuggestion {
    category: string;
    confidence: number;
}

function AddExpenseContent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: PaymentMode.CASH,
        currency: 'INR',
        notes: '',
    });
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchAISuggestions = useCallback(async () => {
        try {
            const response = await fetch('/api/ai/categorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    notes: formData.notes,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAiSuggestions(data.suggestions || []);
            }
        } catch (error) {
            console.error('Failed to fetch AI suggestions:', error);
        }
    }, [formData.title, formData.notes]);

    useEffect(() => {
        if (formData.title.length > 2) {
            fetchAISuggestions();
        }
    }, [formData.title, formData.notes, fetchAISuggestions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };


    const applySuggestion = (category: string) => {
        setFormData((prev) => ({ ...prev, category }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                }),
            });

            if (response.ok) {
                router.push('/expenses');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to create expense');
            }
        } catch (error) {
            console.error('Failed to create expense:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = Object.values(ExpenseCategory).map((cat) => ({
        value: cat,
        label: cat,
    }));

    const paymentModeOptions = Object.values(PaymentMode).map((mode) => ({
        value: mode,
        label: mode,
    }));


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Add New Expense</h1>
                <p className={styles.subtitle}>Track your spending with AI-powered categorization</p>
            </div>

            <Card>
                <Card.Body>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            type="text"
                            name="title"
                            label="Expense Title"
                            placeholder="e.g., Grocery shopping at Walmart"
                            value={formData.title}
                            onChange={handleChange}
                            error={errors.title}
                            required
                        />

                        {aiSuggestions.length > 0 && (
                            <div className={styles.aiSuggestion}>
                                <div className={styles.suggestionHeader}>
                                    <span className={styles.suggestionTitle}>
                                        🤖 AI Suggestions
                                    </span>
                                </div>
                                <div className={styles.suggestions}>
                                    {aiSuggestions.map((suggestion, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={styles.suggestionChip}
                                            onClick={() => applySuggestion(suggestion.category)}
                                        >
                                            {suggestion.category}
                                            <span className={styles.confidence}>
                                                ({Math.round(suggestion.confidence * 100)}%)
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Input
                            type="number"
                            name="amount"
                            label="Amount"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            error={errors.amount}
                            required
                        />

                        <div className={styles.row}>
                            <Select
                                name="category"
                                label="Category"
                                value={formData.category}
                                onChange={handleChange}
                                options={[{ value: '', label: 'Select category' }, ...categoryOptions]}
                                error={errors.category}
                                required
                            />

                            <Input
                                type="date"
                                name="date"
                                label="Date"
                                value={formData.date}
                                onChange={handleChange}
                                error={errors.date}
                                required
                            />
                        </div>

                        <Select
                            name="paymentMode"
                            label="Payment Mode"
                            value={formData.paymentMode}
                            onChange={handleChange}
                            options={paymentModeOptions}
                            required
                        />


                        <TextArea
                            name="notes"
                            label="Notes (Optional)"
                            placeholder="Add any additional details..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                        />

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push('/expenses')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={loading} disabled={loading}>
                                Add Expense
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default function AddExpensePage() {
    return (
        <ProtectedRoute>
            <AddExpenseContent />
        </ProtectedRoute>
    );
}
