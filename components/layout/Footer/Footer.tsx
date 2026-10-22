'use client';

import React from 'react';
import Link from 'next/link';

export interface FooterProps {
    className?: string;
    variant?: 'full' | 'compact';
}

export default function Footer({ className = '', variant = 'full' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    if (variant === 'compact') {
        return (
            <footer className={`py-4 px-6 border-t border-white/10 dark:border-white/10 bg-transparent ${className}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-base">💰</span>
                        <span className="font-semibold text-white">ExpenseTracker</span>
                        <span className="text-slate-500">© {currentYear} All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hover:text-indigo-400 transition">Dashboard</Link>
                        <Link href="/expenses" className="hover:text-indigo-400 transition">Expenses</Link>
                        <Link href="/budgets" className="hover:text-indigo-400 transition">Budgets</Link>
                        <Link href="/analytics" className="hover:text-indigo-400 transition">Analytics</Link>
                    </div>
                </div>
            </footer>
        );
    }

    return (
        <footer className={`bg-[#0b1120] border-t border-white/10 text-slate-300 relative z-10 pt-16 pb-8 ${className}`}>
            <div className="max-w-[1300px] mx-auto px-6">
                {/* Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <Link href="/" className="inline-flex items-center gap-3 text-white text-xl font-bold">
                            <span className="text-2xl">💰</span>
                            <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                                ExpenseTracker
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Master your money with automated expense tracking, predictive budgeting, and real-time AI-powered financial intelligence.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full w-fit mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></span>
                            <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
                        </div>
                    </div>

                    {/* Links: Product */}
                    <div className="flex flex-col gap-3.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
                            <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                            <li><Link href="/expenses" className="hover:text-white transition">Expenses</Link></li>
                            <li><Link href="/expenses/new" className="hover:text-white transition">Log Expense</Link></li>
                            <li><Link href="/budgets" className="hover:text-white transition">Budgets</Link></li>
                            <li><Link href="/analytics" className="hover:text-white transition">Analytics</Link></li>
                        </ul>
                    </div>

                    {/* Links: Features */}
                    <div className="flex flex-col gap-3.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Features</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
                            <li><Link href="/#features" className="hover:text-white transition">Smart AI Categorization</Link></li>
                            <li><Link href="/#features" className="hover:text-white transition">Budget Limits</Link></li>
                            <li><Link href="/#features" className="hover:text-white transition">Visual Reports</Link></li>
                            <li><Link href="/#features" className="hover:text-white transition">Instant Export</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link></li>
                        </ul>
                    </div>

                    {/* Links: Account */}
                    <div className="flex flex-col gap-3.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Account</h4>
                        <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
                            <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
                            <li><Link href="/signup" className="hover:text-white transition">Create Account</Link></li>
                            <li><Link href="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
                            <li><Link href="/profile" className="hover:text-white transition">User Profile</Link></li>
                            <li><Link href="/settings" className="hover:text-white transition">Preferences</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                    <div>
                        © {currentYear} ExpenseTracker. Built for financial freedom.
                    </div>

                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <Link href="/#privacy" className="hover:text-white transition">Privacy Policy</Link>
                        <span>•</span>
                        <Link href="/#terms" className="hover:text-white transition">Terms of Service</Link>
                        <span>•</span>
                        <Link href="/#security" className="hover:text-white transition">Security</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* GitHub */}
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:text-white transition">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>
                        {/* Twitter */}
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:text-white transition">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:text-white transition">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0-.01-2.92 1.46 1.46 0 0 0 .01 2.92M7.86 18.5V10.13H5.07V18.5h2.79z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
