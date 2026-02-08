import { Currency } from '@/types/enums';

export const CURRENCIES = [
    Currency.INR,
    Currency.USD,
    Currency.EUR,
    Currency.GBP,
    Currency.JPY,
    Currency.AUD,
    Currency.CAD,
];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
    [Currency.INR]: '₹',
    [Currency.JPY]: '¥',
    [Currency.AUD]: 'A$',
    [Currency.CAD]: 'C$',
};

/**
 * Exchange rates relative to USD
 * In production, these should be fetched from a real-time API
 */
export const EXCHANGE_RATES: Record<Currency, number> = {
    [Currency.USD]: 1,
    [Currency.EUR]: 0.92,
    [Currency.GBP]: 0.79,
    [Currency.INR]: 83.12,
    [Currency.JPY]: 149.50,
    [Currency.AUD]: 1.52,
    [Currency.CAD]: 1.35,
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
    amount: number,
    from: Currency,
    to: Currency
): number {
    if (from === to) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = amount / EXCHANGE_RATES[from];
    const convertedAmount = usdAmount * EXCHANGE_RATES[to];

    return Math.round(convertedAmount * 100) / 100;
}

/**
 * Format currency with symbol
 */
export function formatCurrency(amount: number, currency: Currency): string {
    const symbol = CURRENCY_SYMBOLS[currency];
    // Use Indian locale for INR to get proper formatting (e.g., 1,00,000 instead of 100,000)
    const locale = currency === Currency.INR ? 'en-IN' : 'en-US';
    const formattedAmount = amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${symbol}${formattedAmount}`;
}
