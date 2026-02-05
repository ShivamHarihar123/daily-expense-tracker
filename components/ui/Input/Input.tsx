'use client';

import React from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    required?: boolean;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    options: { value: string; label: string }[];
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    icon,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={styles.inputContainer}>
                {icon && <div className={styles.icon}>{icon}</div>}
                <input
                    className={[
                        styles.input,
                        icon && styles.withIcon,
                        error && styles.error,
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    {...props}
                />
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
};

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    helperText,
    required,
    className = '',
    ...props
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <textarea
                className={[styles.textarea, error && styles.error, className]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
};

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    required,
    options,
    className = '',
    ...props
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <select
                className={[styles.select, error && styles.error, className]
                    .filter(Boolean)
                    .join(' ')}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorMessage}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
};

export default Input;
