import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize user input (text fields)
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    // Remove any HTML tags
    let sanitized = sanitizeHtml(input);

    // Trim whitespace
    sanitized = sanitized.trim();

    // Remove any null bytes
    sanitized = sanitized.replace(/\0/g, '');

    return sanitized;
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj } as Record<string, any>;

    Object.keys(sanitized).forEach((key) => {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeInput(sanitized[key]);
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeObject(sanitized[key]);
        }
    });

    return sanitized as T;
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
    return sanitizeInput(email).toLowerCase();
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error('Invalid protocol');
        }
        return parsed.toString();
    } catch {
        return '';
    }
}
