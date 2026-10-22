'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 p-4 sm:p-6 text-white overflow-y-auto">
            <div className="w-full max-w-[1050px] min-h-[600px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col md:flex-row overflow-hidden my-auto">
                {/* Left Side: Brand Showcase */}
                <div className="hidden md:flex flex-[1.1] flex-col justify-center p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-indigo-950 relative text-white">
                    <div className="relative z-10 max-w-[420px]">
                        <div className="text-4xl mb-4 drop-shadow">💰</div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight leading-tight">
                            Daily Expense Tracker
                        </h1>
                        <p className="text-indigo-100/90 text-sm lg:text-base leading-relaxed mb-8">
                            Join thousands managing their finances smarter with AI-powered insights.
                        </p>

                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    📊
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">Smart Categorization</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">AI automatically sorts every expense for you.</p>
                                </div>
                            </li>

                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    🎯
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">Budget Goals</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">Set limits and get alerted before you overspend.</p>
                                </div>
                            </li>

                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    📈
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">Visual Reports</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">Beautiful charts to understand your spending trends.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-gray-900/95">
                    <div className="w-full max-w-[380px]">
                        <div className="text-3xl text-center mb-3 md:hidden">💰</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight text-center md:text-left">
                            Create Account
                        </h2>
                        <p className="text-slate-400 text-sm mb-6 text-center md:text-left">
                            Start tracking expenses and gaining financial clarity in seconds.
                        </p>

                        {errorMessage && (
                            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-sm bg-red-500/15 border border-red-500/30 text-red-200">
                                <span>⚠️</span>
                                <span>{errorMessage}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                                <span>✅</span>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                            <Input
                                type="text"
                                id="signup-name"
                                name="name"
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                autoComplete="name"
                                required
                            />

                            <Input
                                type="email"
                                id="signup-email"
                                name="email"
                                label="Email Address"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoComplete="email"
                                required
                            />

                            <Input
                                type="password"
                                id="signup-password"
                                name="password"
                                label="Password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                helperText="At least 6 characters with letters and numbers"
                                autoComplete="new-password"
                                required
                            />

                            <Input
                                type="password"
                                id="signup-confirm-password"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                                required
                            />

                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                size="lg"
                                className="mt-2"
                            >
                                Create Account
                            </Button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t border-white/10 text-slate-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-400 hover:text-white font-semibold transition ml-1">
                                Sign in
                            </Link>
                        </div>

                        <p className="text-center text-xs text-slate-500 mt-4 leading-normal">
                            By registering, you agree to our{' '}
                            <Link href="/#terms" className="text-slate-400 underline hover:text-white">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/#privacy" className="text-slate-400 underline hover:text-white">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
