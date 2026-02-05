'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from '../auth.module.scss';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validate = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');

        if (!validate()) return;

        setLoading(true);

        try {
            // TODO: Implement forgot password API
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSuccessMessage(
                'Password reset link has been sent to your email. Please check your inbox.'
            );
            setEmail('');
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>🔒</div>
                    <h1 className={styles.title}>Forgot Password?</h1>
                    <p className={styles.subtitle}>
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {successMessage && (
                    <div className={styles.success}>{successMessage}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        error={error}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                        disabled={loading}
                    >
                        Send Reset Link
                    </Button>
                </form>

                <div className={styles.footer}>
                    Remember your password?{' '}
                    <Link href="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
