'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 p-4 sm:p-6 text-white overflow-y-auto">
            <div className="w-full max-w-[1050px] min-h-[580px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col md:flex-row overflow-hidden my-auto">
                {/* Left Side: Brand Showcase */}
                <div className="hidden md:flex flex-[1.1] flex-col justify-center p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-indigo-950 relative text-white">
                    <div className="relative z-10 max-w-[420px]">
                        <div className="text-4xl mb-4 drop-shadow">💰</div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight leading-tight">
                            Daily Expense Tracker
                        </h1>
                        <p className="text-indigo-100/90 text-sm lg:text-base leading-relaxed mb-8">
                            Master your finances with smart tracking and AI-powered insights.
                        </p>

                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    📈
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">Real-time Analytics</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">Visualize your spending patterns instantly.</p>
                                </div>
                            </li>

                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    🤖
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">AI Insights</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">Get personalized saving recommendations.</p>
                                </div>
                            </li>

                            <li className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                                <div className="text-2xl w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                                    🎯
                                </div>
                                <div>
                                    <strong className="block text-sm font-semibold text-white">Budget Management</strong>
                                    <p className="text-xs text-indigo-100/80 m-0">Set and achieve your monthly financial goals.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-gray-900/95">
                    <div className="w-full max-w-[380px]">
                        <div className="text-3xl text-center mb-3 md:hidden">💰</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight text-center md:text-left">
                            Welcome Back
                        </h2>
                        <p className="text-slate-400 text-sm mb-6 text-center md:text-left">
                            Sign in to access your financial dashboard and insights.
                        </p>

                        {errorMessage && (
                            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-sm bg-red-500/15 border border-red-500/30 text-red-200">
                                <span>⚠️</span>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
                            <Input
                                type="email"
                                id="login-email"
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
                                id="login-password"
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                autoComplete="current-password"
                                required
                            />

                            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 mt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" id="remember-me" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500" />
                                    <span>Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-indigo-400 hover:text-white transition">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                size="lg"
                                className="mt-2"
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t border-white/10 text-slate-400 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-indigo-400 hover:text-white font-semibold transition ml-1">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
