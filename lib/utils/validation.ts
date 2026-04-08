import { z } from 'zod';
import { ExpenseCategory, PaymentMode, Currency, UserRole, NotificationType, RecurringFrequency } from '@/types/enums';

/**
 * Validation helper function
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

// ========================
// AUTH VALIDATION SCHEMAS
// ========================

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .regex(/(?=.*\d)/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .regex(/(?=.*\d)/, 'Password must contain at least one number'),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    avatar: z.string().url('Invalid URL').optional(),
});

// ========================
// EXPENSE VALIDATION SCHEMAS
// ========================

export const createExpenseSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    amount: z.number().positive('Amount must be positive'),
    category: z.nativeEnum(ExpenseCategory, { errorMap: () => ({ message: 'Invalid category' }) }),
    date: z.coerce.date(),
    paymentMode: z.nativeEnum(PaymentMode, { errorMap: () => ({ message: 'Invalid payment mode' }) }),
    currency: z.nativeEnum(Currency).default(Currency.INR),
    notes: z.string().max(1000, 'Notes are too long').optional(),
    tags: z.array(z.string()).optional(),
    receiptUrl: z.string().url('Invalid URL').optional(),
    recurring: z.boolean().default(false),
    recurringFrequency: z.nativeEnum(RecurringFrequency).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseFilterSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    category: z.nativeEnum(ExpenseCategory).optional(),
    minAmount: z.number().positive().optional(),
    maxAmount: z.number().positive().optional(),
    paymentMode: z.nativeEnum(PaymentMode).optional(),
    search: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// ========================
// BUDGET VALIDATION SCHEMAS
// ========================

export const createBudgetSchema = z.object({
    month: z.number().int().min(0).max(11, 'Month must be between 0 and 11'),
    year: z.number().int().min(2000, 'Year must be valid'),
    monthlyLimit: z.number().positive('Monthly limit must be positive'),
    categoryLimits: z
        .array(
            z.object({
                category: z.nativeEnum(ExpenseCategory),
                limit: z.number().positive('Category limit must be positive'),
            })
        )
        .optional(),
    alertThreshold: z.number().min(0).max(100, 'Alert threshold must be between 0 and 100').default(80),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// ========================
// PAGINATION SCHEMA
// ========================

export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

// ========================
// TYPE EXPORTS
// ========================

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
