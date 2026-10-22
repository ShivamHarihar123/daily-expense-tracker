'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
            setError('Please enter a valid email address');
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
            // Simulated password reset API call
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setSuccessMessage(
                'Password reset link has been sent to your email. Please check your inbox and spam folder.'
            );
            setEmail('');
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-full max-w-md relative z-10">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
                            🔒
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Forgot Password?
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Enter your registered email and we&apos;ll send you instructions to reset your password.
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-3">
                            <span className="text-base">✓</span>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
                            <span className="text-base">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            error={error}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            disabled={loading}
                            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200"
                        >
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
                        Remember your password?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
