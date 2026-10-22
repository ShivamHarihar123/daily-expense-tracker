'use client';

import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    glass?: boolean;
    noPadding?: boolean;
    compact?: boolean;
    onClick?: () => void;
}

export interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Body: React.FC<CardBodyProps>;
    Footer: React.FC<CardFooterProps>;
} = ({
    children,
    className = '',
    hoverable = false,
    glass = false,
    noPadding = false,
    compact = false,
    onClick,
}) => {
    const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';
    const surfaceStyles = glass
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl'
        : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm';
    const hoverStyles = hoverable
        ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-slate-700 cursor-pointer'
        : '';
    const paddingStyles = noPadding ? '' : compact ? 'p-4' : 'p-6';

    return (
        <div
            className={`${baseStyles} ${surfaceStyles} ${hoverStyles} ${paddingStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 flex items-start justify-between gap-4 ${className}`}>
            <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
};

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-3.5 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/50 ${className}`}>
            {children}
        </div>
    );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
