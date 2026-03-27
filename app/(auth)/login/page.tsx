'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './login.module.scss';

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
            <div className={styles.loginWrapper}>
                {/* Left Side: Illustration & Project Info */}
                <div className={styles.infoSection}>
                    <div className={styles.overlay}></div>
                    <div className={styles.infoContent}>
                        <div className={styles.projectLogo}>💰</div>
                        <h1 className={styles.projectTitle}>Daily Expense Tracker</h1>
                        <p className={styles.projectTagline}>
                            Master your finances with smart tracking and AI-powered insights.
                        </p>
                        
                        <ul className={styles.featureList}>
                            <li>
                                <span className={styles.featureIcon}>📈</span>
                                <div>
                                    <strong>Real-time Analytics</strong>
                                    <p>Visualize your spending patterns instantly.</p>
                                </div>
                            </li>
                            <li>
                                <span className={styles.featureIcon}>🤖</span>
                                <div>
                                    <strong>AI Insights</strong>
                                    <p>Get personalized saving recommendations.</p>
                                </div>
                            </li>
                            <li>
                                <span className={styles.featureIcon}>🎯</span>
                                <div>
                                    <strong>Budget Management</strong>
                                    <p>Set and achieve your monthly financial goals.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContent}>
                    <div className={styles.mobileLogo}>💰</div>
                    <h2 className={styles.title}>Welcome Back</h2>

                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
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
                                placeholder="••••••••"
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
                                size="lg"
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className={styles.signupPrompt}>
                            Don't have an account?{' '}
                            <Link href="/signup">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
