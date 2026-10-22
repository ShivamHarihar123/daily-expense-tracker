'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Hide navbar for admin and user application routes that have sidebars
    const sidebarRoutes = ['/admin', '/dashboard', '/expenses', '/analytics', '/budgets', '/profile', '/settings'];
    const isSidebarRoute = sidebarRoutes.some(route => pathname?.startsWith(route));

    if (isSidebarRoute) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white tracking-tight group">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform">💰</span>
                    <span>Expense<span className="text-indigo-600 dark:text-indigo-400">Tracker</span></span>
                </Link>

                {/* Authenticated Navigation Links */}
                {isAuthenticated && (
                    <div className="hidden md:flex items-center gap-1 sm:gap-2">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Expenses', href: '/expenses' },
                            { name: 'Analytics', href: '/analytics' },
                            { name: 'Budgets', href: '/budgets' },
                        ].map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {isAuthenticated && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-expanded={dropdownOpen}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {getInitials(user.name)}
                                </div>
                                <span className="hidden sm:inline-block text-sm font-medium text-gray-800 dark:text-slate-200 max-w-[120px] truncate">
                                    {user.name}
                                </span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className={`text-gray-500 dark:text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                >
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                                        <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{user.email}</p>
                                    </div>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                                        onClick={() => {
                                            router.push('/profile');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span>👤</span>
                                        Profile
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                                        onClick={() => {
                                            router.push('/settings');
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        <span>⚙️</span>
                                        Settings
                                    </button>
                                    <div className="my-1 border-t border-gray-100 dark:border-slate-800" />
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left font-medium"
                                        onClick={handleLogout}
                                    >
                                        <span>🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/login')}
                                className="text-sm px-3.5 py-2 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Sign In
                            </Button>
                            <Button
                                onClick={() => router.push('/signup')}
                                className="text-sm px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20"
                            >
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
