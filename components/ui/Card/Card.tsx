'use client';

import React from 'react';
import styles from './Card.module.scss';

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
}

export interface CardBodyProps {
    children: React.ReactNode;
}

export interface CardFooterProps {
    children: React.ReactNode;
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
        const cardClasses = [
            styles.card,
            hoverable && styles.hoverable,
            glass && styles.glass,
            noPadding && styles.noPadding,
            compact && styles.compact,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={cardClasses} onClick={onClick}>
                {children}
            </div>
        );
    };

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => {
    return (
        <div className={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 className={styles.title}>{title}</h3>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
        </div>
    );
};

const CardBody: React.FC<CardBodyProps> = ({ children }) => {
    return <div className={styles.body}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
    return <div className={styles.footer}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
