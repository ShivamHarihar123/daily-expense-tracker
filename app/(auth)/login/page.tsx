'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from '../auth.module.scss';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!validate()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                // Redirect based on role
                if (data.user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setErrorMessage(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>💰</div>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to your account to continue</p>
                </div>

                {errorMessage && (
                    <div className={styles.error}>{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                        disabled={loading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className={styles.footer}>
                    Don't have an account?{' '}
                    <Link href="/signup">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
