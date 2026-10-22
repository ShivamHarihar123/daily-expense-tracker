'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
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
    rightElement,
    required,
    className = '',
    id,
    name,
    type = 'text',
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const effectiveType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    <span>{label}</span>
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    name={name}
                    type={effectiveType}
                    className={`w-full py-3 text-sm rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200 outline-none ${
                        icon ? 'pl-11' : 'pl-4'
                    } ${
                        isPassword || rightElement ? 'pr-11' : 'pr-4'
                    } ${
                        error
                            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                            : 'border-gray-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
                    } ${className}`}
                    {...props}
                />
                {isPassword ? (
                    <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                ) : rightElement ? (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">{rightElement}</div>
                ) : null}
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1">{error}</p>}
            {helperText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">{helperText}</p>}
        </div>
    );
};

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    error,
    helperText,
    required,
    className = '',
    id,
    name,
    ...props
}) => {
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                id={inputId}
                name={name}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200 outline-none ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-gray-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
                } ${className}`}
                {...props}
            />
            {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
            {helperText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">{helperText}</p>}
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
    id,
    name,
    ...props
}) => {
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}
            <select
                id={inputId}
                name={name}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors duration-200 outline-none cursor-pointer ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-gray-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
                } ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
            {helperText && !error && <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">{helperText}</p>}
        </div>
    );
};

export default Input;
