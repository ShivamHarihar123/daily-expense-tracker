'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Papa from 'papaparse';
import styles from './page.module.scss';

interface CSVRow {
    title: string;
    amount: string;
    category: string;
    date: string;
    paymentMode?: string;
    notes?: string;
}

function ImportExpensesContent() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [csvData, setCsvData] = useState<CSVRow[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type === 'text/csv') {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    setCsvData(results.data as CSVRow[]);
                    setResult(null);
                },
                error: (error) => {
                    alert('Failed to parse CSV: ' + error.message);
                },
            });
        } else {
            alert('Please select a valid CSV file');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleImport = async () => {
        if (csvData.length === 0) {
            alert('No data to import');
            return;
        }

        setImporting(true);
        setResult(null);

        try {
            const response = await fetch('/api/expenses/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csvData }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    success: true,
                    message: data.message || 'Import completed successfully',
                });
                setTimeout(() => {
                    router.push('/expenses');
                }, 2000);
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Import failed',
                });
            }
        } catch (error) {
            console.error('Import error:', error);
            setResult({
                success: false,
                message: 'An error occurred during import',
            });
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const template = 'title,amount,category,date,paymentMode,notes\n' +
            'Grocery Shopping,50.00,Food & Dining,2024-01-15,Cash,Weekly groceries\n' +
            'Gas Station,30.00,Transportation,2024-01-16,Credit Card,Fuel for car';

        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expense_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Import Expenses from CSV</h1>
                <p className={styles.subtitle}>
                    Upload a CSV file to bulk import your expenses
                </p>
            </div>

            <Card>
                <Card.Body>
                    <div
                        className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={styles.uploadIcon}>📁</div>
                        <p className={styles.uploadText}>
                            Drag and drop your CSV file here
                        </p>
                        <p className={styles.uploadHint}>
                            or click to browse
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className={styles.fileInput}
                            onChange={handleFileInputChange}
                        />
                    </div>

                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Button variant="ghost" size="sm" onClick={downloadTemplate}>
                            📥 Download Template
                        </Button>
                    </div>

                    {csvData.length > 0 && (
                        <div className={styles.preview}>
                            <div className={styles.previewHeader}>
                                <h3 className={styles.previewTitle}>
                                    Preview ({csvData.length} rows)
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCsvData([])}
                                >
                                    Clear
                                </Button>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Amount</th>
                                            <th>Category</th>
                                            <th>Date</th>
                                            <th>Payment Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {csvData.slice(0, 10).map((row, idx) => (
                                            <tr key={idx}>
                                                <td>{row.title}</td>
                                                <td>${row.amount}</td>
                                                <td>{row.category}</td>
                                                <td>{row.date}</td>
                                                <td>{row.paymentMode || 'Cash'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {csvData.length > 10 && (
                                <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
                                    Showing first 10 rows of {csvData.length}
                                </p>
                            )}

                            <div className={styles.actions}>
                                <Button variant="ghost" onClick={() => router.push('/expenses')}>
                                    Cancel
                                </Button>
                                <Button loading={importing} onClick={handleImport}>
                                    Import {csvData.length} Expenses
                                </Button>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className={`${styles.result} ${result.success ? styles.success : styles.error}`}>
                            {result.message}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default function ImportExpensesPage() {
    return (
        <ProtectedRoute>
            <ImportExpensesContent />
        </ProtectedRoute>
    );
}
