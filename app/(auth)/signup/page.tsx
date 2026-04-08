'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from '../login/login.module.scss'; // Reuse login styles for consistency

export default function SignupPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
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
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (!validate()) return;
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('Account created successfully!');
                setUser(data.user);
                setTimeout(() => router.push('/dashboard'), 1000);
            } else {
                setErrorMessage(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
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
                            Join thousands managing their finances smarter with AI-powered insights.
                        </p>

                        <ul className={styles.featureList}>
                            <li>
                                <span className={styles.featureIcon}>📊</span>
                                <div>
                                    <strong>Smart Categorization</strong>
                                    <p>AI automatically sorts every expense for you.</p>
                                </div>
                            </li>
                            <li>
                                <span className={styles.featureIcon}>🎯</span>
                                <div>
                                    <strong>Budget Goals</strong>
                                    <p>Set limits and get alerted before you overspend.</p>
                                </div>
                            </li>
                            <li>
                                <span className={styles.featureIcon}>📈</span>
                                <div>
                                    <strong>Visual Reports</strong>
                                    <p>Beautiful charts to understand your spending trends.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContent}>
                        <div className={styles.mobileLogo}>💰</div>
                        <h2 className={styles.title}>Create Account</h2>

                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
                        )}
                        {successMessage && (
                            <div className={styles.successMessage}>{successMessage}</div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Input
                                type="text"
                                name="name"
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                            />

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
                                placeholder="Strong password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                helperText="Upper, lower, and number"
                                required
                            />

                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required
                            />

                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className={styles.signupPrompt}>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
