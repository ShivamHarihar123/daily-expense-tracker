'use client';

import React from 'react';

export interface SkeletonProps {
    variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
    width?: string | number;
    height?: string | number;
    className?: string;
}

const variantStyles: Record<string, string> = {
    text: 'h-4 w-full rounded-md',
    title: 'h-6 w-3/4 rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
};

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = '',
}) => {
    const style: React.CSSProperties = {};

    if (width) {
        style.width = typeof width === 'number' ? `${width}px` : width;
    }

    if (height) {
        style.height = typeof height === 'number' ? `${height}px` : height;
    }

    const defaultVariant = variantStyles[variant] || variantStyles.text;

    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-slate-800 ${defaultVariant} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
