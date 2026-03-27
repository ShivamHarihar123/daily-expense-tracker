import { UserRole, ExpenseCategory, PaymentMode, Currency, NotificationType, RecurringFrequency } from './enums';

// ========================
// USER TYPES
// ========================
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role: UserRole;
    verified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    oauthProvider?: 'google' | 'local';
    oauthId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserCreate {
    name: string;
    email: string;
    password: string;
}

export interface IUserUpdate {
    name?: string;
    avatar?: string;
    email?: string;
}

// ========================
// EXPENSE TYPES
// ========================
export interface IExpense {
    _id: string;
    userId: string;
    title: string;
    amount: number;
    currency: Currency;
    category: ExpenseCategory;
    tags: string[];
    date: Date;
    notes?: string;
    receiptUrl?: string;
    recurring: boolean;
    recurringFrequency?: RecurringFrequency;
    paymentMode: PaymentMode;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExpenseCreate {
    title: string;
    amount: number;
    currency: Currency;
    category: ExpenseCategory;
    tags?: string[];
    date: Date;
    notes?: string;
    receiptUrl?: string;
    recurring?: boolean;
    recurringFrequency?: RecurringFrequency;
    paymentMode: PaymentMode;
}

export interface IExpenseUpdate {
    title?: string;
    amount?: number;
    currency?: Currency;
    category?: ExpenseCategory;
    tags?: string[];
    date?: Date;
    notes?: string;
    receiptUrl?: string;
    recurring?: boolean;
    recurringFrequency?: RecurringFrequency;
    paymentMode?: PaymentMode;
}

export interface IExpenseFilter {
    startDate?: Date;
    endDate?: Date;
    category?: ExpenseCategory;
    minAmount?: number;
    maxAmount?: number;
    tags?: string[];
    paymentMode?: PaymentMode;
    search?: string;
}

// ========================
// BUDGET TYPES
// ========================
export interface IBudget {
    _id: string;
    userId: string;
    month: number; // 0-11
    year: number;
    monthlyLimit: number;
    categoryLimits: {
        category: ExpenseCategory;
        limit: number;
    }[];
    alertThreshold: number; // Percentage (e.g., 80 for 80%)
    createdAt: Date;
    updatedAt: Date;
}

export interface IBudgetCreate {
    month: number;
    year: number;
    monthlyLimit: number;
    categoryLimits?: {
        category: ExpenseCategory;
        limit: number;
    }[];
    alertThreshold?: number;
}

// ========================
// NOTIFICATION TYPES
// ========================
export interface INotification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    readStatus: boolean;
    createdAt: Date;
}

export interface INotificationCreate {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
}

// ========================
// ANALYTICS TYPES
// ========================
export interface IAnalyticsOverview {
    totalExpenses: number;
    totalAmount: number;
    averageExpense: number;
    categoryDistribution: {
        category: ExpenseCategory;
        amount: number;
        percentage: number;
    }[];
    topCategories: {
        category: ExpenseCategory;
        amount: number;
    }[];
    monthlyTrend: {
        month: string;
        amount: number;
    }[];
    budgetUtilization: number;
}

export interface ISpendingTrend {
    date: string;
    amount: number;
}

export interface ICategoryBreakdown {
    category: ExpenseCategory;
    amount: number;
    count: number;
    percentage: number;
}

// ========================
// AI TYPES
// ========================
export interface IAIInsight {
    summary: string;
    recommendations: string[];
    anomalies: {
        description: string;
        severity: 'low' | 'medium' | 'high';
    }[];
    savingsPotential: number;
}

export interface ICategoryPrediction {
    category: ExpenseCategory;
    confidence: number;
}

// ========================
// AUTH TYPES
// ========================
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface ISignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface IResetPassword {
    token: string;
    newPassword: string;
}

// ========================
// PAGINATION TYPES
// ========================
export interface IPaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
