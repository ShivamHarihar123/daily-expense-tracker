'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Expenses', path: '/expenses', icon: '💰' },
    { label: 'Analytics', path: '/analytics', icon: '📈' },
    { label: 'Budgets', path: '/budgets', icon: '🎯' },
    { label: 'Edit Profile', path: '/profile', icon: '👤' },
];

export default function UserSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuthStore();

    return (
        <aside className="w-64 sm:w-72 h-screen sticky top-0 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors z-30 shrink-0">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                <Link href="/" className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white tracking-tight group">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform">💰</span>
                    <span>Expense<span className="text-indigo-600 dark:text-indigo-400">Tracker</span></span>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                                    : 'text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-800/70'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer with Logout */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                <button
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/30 text-gray-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium text-sm transition-all duration-150"
                    onClick={async () => {
                        try {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            logout();
                            router.push('/login');
                        } catch (err) {
                            console.error('Logout failed:', err);
                        }
                    }}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
