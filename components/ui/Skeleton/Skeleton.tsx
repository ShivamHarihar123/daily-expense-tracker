'use client';

import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps {
    variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';
    width?: string | number;
    height?: string | number;
    className?: string;
}

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

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
