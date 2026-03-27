'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import { ExpenseCategory } from '@/types/enums';
import styles from './page.module.scss';

interface Budget {
    _id: string;
    monthlyLimit: number;
    month: number;
    year: number;
    categoryLimits?: Array<{ category: string; limit: number }>;
    alertThreshold: number;
}

interface BudgetStatus {
    budget: Budget | null;
    allBudgets?: Budget[]; // All historical budgets
    totalSpent: number;
    percentageUsed: number;
    alerts: Array<{ type: string; message: string }>;
    categorySpending: Array<{ category: string; spent: number; limit: number; percentage: number }>;
}

function BudgetsContent() {
    const router = useRouter();
    const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
    const [allBudgets, setAllBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const [formData, setFormData] = useState({
        monthlyLimit: '',
        alertThreshold: '80',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBudgetStatus();
    }, [selectedMonth, selectedYear]);

    const fetchBudgetStatus = async () => {
        setLoading(true);
        try {
            // Fetch status for current selection
            const statusRes = await fetch(`/api/budgets/status?month=${selectedMonth}&year=${selectedYear}`);
            // Fetch LIST of all set budgets
            const listRes = await fetch(`/api/budgets`);
            
            if (statusRes.ok && listRes.ok) {
                const statusData = await statusRes.json();
                const listData = await listRes.json();
                
                setBudgetStatus(statusData);
                setAllBudgets(listData.allBudgets || []);
                
                if (statusData.budget) {
                    setFormData({
                        monthlyLimit: statusData.budget.monthlyLimit.toString(),
                        alertThreshold: statusData.budget.alertThreshold.toString(),
                    });
                } else {
                    setFormData({
                        monthlyLimit: '',
                        alertThreshold: '80',
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch budget data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBudget = async () => {
        if (!formData.monthlyLimit || isNaN(parseFloat(formData.monthlyLimit))) {
            alert('Please enter a valid monthly limit');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: selectedMonth,
                    year: selectedYear,
                    monthlyLimit: parseFloat(formData.monthlyLimit),
                    alertThreshold: parseInt(formData.alertThreshold),
                }),
            });

            if (response.ok) {
                setModalOpen(false);
                fetchBudgetStatus();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to save budget');
            }
        } catch (error) {
            console.error('Failed to save budget:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return styles.danger;
        if (percentage >= 80) return styles.warning;
        return '';
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Skeleton variant="title" width="40%" />
                    <div className={styles.periodSelectors}>
                        <Skeleton variant="text" width={100} height={40} />
                        <Skeleton variant="text" width={100} height={40} />
                    </div>
                </div>
                <Skeleton variant="card" height={300} />
            </div>
        );
    }

    const { budget, totalSpent, percentageUsed, alerts, categorySpending } = budgetStatus || {
        budget: null,
        totalSpent: 0,
        percentageUsed: 0,
        alerts: [],
        categorySpending: [],
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Budget Management</h1>
                    <p className={styles.subtitle}>
                        Track your spending for {months[selectedMonth]} {selectedYear}
                    </p>
                </div>
                <div className={styles.periodSelectors}>
                    <Select
                        value={selectedMonth.toString()}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                    />
                    <Select
                        value={selectedYear.toString()}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        options={years.map((y) => ({ value: y.toString(), label: y.toString() }))}
                    />
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.budgetContent}>
                    {!budget ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🎯</div>
                            <h3>No budget set for {months[selectedMonth]} {selectedYear}</h3>
                            <p>Set a monthly budget to track your spending and get alerts</p>
                            <Button onClick={() => setModalOpen(true)}>
                                Set Budget
                            </Button>
                        </div>
                    ) : (
                        <>
                            {alerts.length > 0 && (
                                <div className={styles.alerts}>
                                    {alerts.map((alert, idx) => (
                                        <div
                                            key={idx}
                                            className={`${styles.alert} ${alert.type === 'danger' ? styles.danger : styles.warning
                                                }`}
                                        >
                                            <span className={styles.alertIcon}>
                                                {alert.type === 'danger' ? '🚨' : '⚠️'}
                                            </span>
                                            <span className={styles.alertText}>{alert.message}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Card className={styles.currentBudget}>
                                <Card.Body>
                                    <div className={styles.budgetAmount}>
                                        ₹{budget.monthlyLimit.toFixed(2)}
                                    </div>
                                    <p className={styles.budgetLabel}>Monthly Budget</p>

                                    <div className={styles.progressBar}>
                                        <div
                                            className={`${styles.progressFill} ${getProgressColor(percentageUsed)}`}
                                            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                        >
                                            {percentageUsed.toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className={styles.budgetStats}>
                                        <div className={styles.budgetStat}>
                                            <h4>Spent</h4>
                                            <p>₹{totalSpent.toFixed(2)}</p>
                                        </div>
                                        <div className={styles.budgetStat}>
                                            <h4>Remaining</h4>
                                            <p>₹{Math.max(0, budget.monthlyLimit - totalSpent).toFixed(2)}</p>
                                        </div>
                                        <div className={styles.budgetStat}>
                                            <h4>Alert at</h4>
                                            <p>{budget.alertThreshold}%</p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '24px' }}>
                                        <Button variant="outline" onClick={() => setModalOpen(true)}>
                                            ⚙️ Edit Budget
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            {categorySpending.length > 0 && (
                                <div className={styles.categoryBudgets}>
                                    <Card>
                                        <Card.Header title="Category Spending" />
                                        <Card.Body>
                                            <div className={styles.categoryList}>
                                                {categorySpending.map((cat, idx) => (
                                                    <div key={idx} className={styles.categoryItem}>
                                                        <div className={styles.categoryHeader}>
                                                            <span className={styles.categoryName}>{cat.category}</span>
                                                            <span className={styles.categoryAmount}>
                                                                ₹{cat.spent.toFixed(2)} / ₹{cat.limit.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.categoryProgress}>
                                                            <div
                                                                className={`${styles.categoryProgressFill} ${getProgressColor(cat.percentage)}`}
                                                                style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                                            />
                                                        </div>
                                                        <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                                                            {cat.percentage.toFixed(1)}% used
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.budgetSidebar}>
                    <Card>
                        <Card.Header title="Historical Budgets" />
                        <Card.Body>
                            {allBudgets.length === 0 ? (
                                <p className={styles.noHistory}>No budgets set yet</p>
                            ) : (
                                <div className={styles.historyList}>
                                    {allBudgets.map((b) => (
                                        <div 
                                            key={b._id} 
                                            className={`${styles.historyItem} ${b.month === selectedMonth && b.year === selectedYear ? styles.active : ''}`}
                                            onClick={() => {
                                                setSelectedMonth(b.month);
                                                setSelectedYear(b.year);
                                            }}
                                        >
                                            <div className={styles.historyInfo}>
                                                <span className={styles.historyDate}>
                                                    {months[b.month]} {b.year}
                                                </span>
                                                <span className={styles.historyLimit}>
                                                    ₹{b.monthlyLimit.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={budget ? `Edit Budget for ${months[selectedMonth]} ${selectedYear}` : `Set Budget for ${months[selectedMonth]} ${selectedYear}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button loading={saving} onClick={handleSaveBudget}>
                            {budget ? 'Save Changes' : 'Set Budget'}
                        </Button>
                    </>
                }
            >
                <div className={styles.form}>
                    <Input
                        type="number"
                        label="Monthly Limit"
                        placeholder="e.g., 2000"
                        value={formData.monthlyLimit}
                        onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                        required
                    />
                    <Input
                        type="number"
                        label="Alert Threshold (%)"
                        placeholder="80"
                        value={formData.alertThreshold}
                        onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                        helperText="Get notified when you reach this percentage of your budget"
                        required
                    />
                </div>
            </Modal>
        </div>
    );
}

export default function BudgetsPage() {
    return (
        <ProtectedRoute>
            <BudgetsContent />
        </ProtectedRoute>
    );
}
