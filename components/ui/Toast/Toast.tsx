'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.scss';

export interface ToastProps {
    id: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

export default function Toast({
    id,
    type = 'info',
    title,
    message,
    duration = 5000,
    onClose,
}: ToastProps) {
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
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    const content = (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.icon}>{getIcon()}</span>
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.message}>{message}</div>
            </div>
            <button className={styles.closeButton} onClick={() => onClose(id)} aria-label="Close">
                ×
            </button>
        </div>
    );

    if (typeof window === 'undefined') {
        return null;
    }

    return createPortal(content, document.body);
}
