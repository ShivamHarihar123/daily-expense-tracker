'use client';

import { useState, useCallback } from 'react';
import Toast, { ToastProps } from '@/components/ui/Toast';

interface ToastItem extends Omit<ToastProps, 'onClose'> {
    id: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback(
        (toast: Omit<ToastItem, 'id'>) => {
            const id = Math.random().toString(36).substring(7);
            setToasts((prev) => [...prev, { ...toast, id }]);
        },
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback(
        (message: string, title?: string) => {
            addToast({ type: 'success', message, title });
        },
        [addToast]
    );

    const error = useCallback(
        (message: string, title?: string) => {
            addToast({ type: 'error', message, title });
        },
        [addToast]
    );

    const warning = useCallback(
        (message: string, title?: string) => {
            addToast({ type: 'warning', message, title });
        },
        [addToast]
    );

    const info = useCallback(
        (message: string, title?: string) => {
            addToast({ type: 'info', message, title });
        },
        [addToast]
    );

    const ToastContainer = useCallback(
        () => (
            <>
            {
                toasts.map((toast) => (
                    <Toast key= { toast.id } { ...toast } onClose = { removeToast } />
        ))}
</>
    ),
[toasts, removeToast]
  );

return {
    success,
    error,
    warning,
    info,
    ToastContainer,
};
}
