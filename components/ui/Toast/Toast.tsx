'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
    id: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const typeStyles: Record<string, { border: string; iconBg: string }> = {
    success: { border: 'border-l-emerald-500', iconBg: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    error: { border: 'border-l-rose-500', iconBg: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
    warning: { border: 'border-l-amber-500', iconBg: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    info: { border: 'border-l-indigo-500', iconBg: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
};

export default function Toast({
    id,
    type = 'info',
    title,
    message,
    duration = 5000,
    onClose,
}: ToastProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    };

    if (!mounted || typeof window === 'undefined') {
        return null;
    }

    const { border, iconBg } = typeStyles[type] || typeStyles.info;

    const content = (
        <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl max-w-sm w-full border-l-4 ${border} animate-in slide-in-from-bottom-4 duration-200`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${iconBg}`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                {title && <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{title}</h4>}
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{message}</p>
            </div>
            <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors text-base leading-none"
                onClick={() => onClose(id)}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );

    return createPortal(content, document.body);
}
