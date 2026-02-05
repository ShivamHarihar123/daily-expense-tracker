import { ExpenseCategory } from '@/types/enums';

export const EXPENSE_CATEGORIES = [
    ExpenseCategory.FOOD,
    ExpenseCategory.TRANSPORT,
    ExpenseCategory.SHOPPING,
    ExpenseCategory.ENTERTAINMENT,
    ExpenseCategory.BILLS,
    ExpenseCategory.HEALTHCARE,
    ExpenseCategory.EDUCATION,
    ExpenseCategory.TRAVEL,
    ExpenseCategory.GROCERIES,
    ExpenseCategory.RENT,
    ExpenseCategory.SALARY,
    ExpenseCategory.INVESTMENT,
    ExpenseCategory.OTHER,
];

/**
 * Keyword mapping for AI-powered category detection
 * Maps keywords to expense categories for automatic categorization
 */
export const CATEGORY_KEYWORDS: Record<ExpenseCategory, string[]> = {
    [ExpenseCategory.FOOD]: [
        'restaurant', 'food', 'dining', 'cafe', 'coffee', 'breakfast', 'lunch',
        'dinner', 'snack', 'meal', 'pizza', 'burger', 'sushi', 'delivery',
        'zomato', 'swiggy', 'ubereats', 'doordash', 'grubhub', 'eat', 'kitchen'
    ],
    [ExpenseCategory.TRANSPORT]: [
        'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'metro', 'subway',
        'fuel', 'gas', 'petrol', 'diesel', 'parking', 'toll', 'transport',
        'commute', 'ride', 'ola', 'rapido', 'auto'
    ],
    [ExpenseCategory.SHOPPING]: [
        'amazon', 'flipkart', 'shop', 'store', 'mall', 'clothing', 'clothes',
        'shoes', 'fashion', 'accessories', 'electronics', 'gadget', 'purchase',
        'buy', 'walmart', 'target', 'myntra', 'ajio'
    ],
    [ExpenseCategory.ENTERTAINMENT]: [
        'movie', 'cinema', 'theater', 'netflix', 'spotify', 'prime', 'hotstar',
        'disney', 'youtube', 'game', 'gaming', 'concert', 'show', 'event',
        'party', 'club', 'bar', 'pub', 'entertainment'
    ],
    [ExpenseCategory.BILLS]: [
        'electricity', 'water', 'gas', 'internet', 'wifi', 'broadband', 'phone',
        'mobile', 'utility', 'bill', 'payment', 'recharge', 'airtel', 'jio',
        'vodafone', 'bsnl', 'postpaid', 'prepaid'
    ],
    [ExpenseCategory.HEALTHCARE]: [
        'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'medical',
        'health', 'insurance', 'checkup', 'consultation', 'treatment', 'therapy',
        'dental', 'dentist', 'lab', 'test', 'prescription'
    ],
    [ExpenseCategory.EDUCATION]: [
        'school', 'college', 'university', 'course', 'class', 'tuition', 'fee',
        'book', 'study', 'education', 'training', 'workshop', 'seminar',
        'certification', 'udemy', 'coursera', 'learning'
    ],
    [ExpenseCategory.TRAVEL]: [
        'flight', 'hotel', 'booking', 'airbnb', 'vacation', 'trip', 'tour',
        'travel', 'ticket', 'airline', 'airport', 'makemytrip', 'goibibo',
        'cleartrip', 'expedia', 'resort', 'accommodation'
    ],
    [ExpenseCategory.GROCERIES]: [
        'grocery', 'supermarket', 'vegetables', 'fruits', 'milk', 'bread',
        'eggs', 'meat', 'chicken', 'fish', 'rice', 'flour', 'bigbasket',
        'dmart', 'reliance', 'fresh', 'market', 'provisions'
    ],
    [ExpenseCategory.RENT]: [
        'rent', 'lease', 'housing', 'apartment', 'flat', 'house', 'landlord',
        'property', 'maintenance', 'society'
    ],
    [ExpenseCategory.SALARY]: [
        'salary', 'income', 'wage', 'paycheck', 'payment', 'earnings', 'bonus',
        'incentive', 'commission'
    ],
    [ExpenseCategory.INVESTMENT]: [
        'investment', 'stock', 'mutual fund', 'sip', 'equity', 'bond', 'gold',
        'crypto', 'bitcoin', 'trading', 'zerodha', 'groww', 'upstox', 'etf'
    ],
    [ExpenseCategory.OTHER]: [
        'miscellaneous', 'other', 'misc', 'various', 'general'
    ],
};
