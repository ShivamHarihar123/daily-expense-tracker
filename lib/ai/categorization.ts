import { ExpenseCategory } from '@/types/enums';
import { CATEGORY_KEYWORDS } from '@/constants/categories';
import { ICategoryPrediction } from '@/types/models';

/**
 * AI-powered expense categorization using keyword matching
 * Returns category with confidence score
 */
export function categorizeExpense(title: string, notes?: string): ICategoryPrediction {
    const text = `${title} ${notes || ''}`.toLowerCase();
    const words = text.split(/\s+/);

    const scores: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;

    // Initialize scores
    Object.keys(CATEGORY_KEYWORDS).forEach((category) => {
        scores[category as ExpenseCategory] = 0;
    });

    // Calculate scores based on keyword matches
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
        keywords.forEach((keyword) => {
            if (text.includes(keyword.toLowerCase())) {
                scores[category as ExpenseCategory] += 1;
            }
        });
    });

    // Find category with highest score
    let maxScore = 0;
    let predictedCategory = ExpenseCategory.OTHER;

    Object.entries(scores).forEach(([category, score]) => {
        if (score > maxScore) {
            maxScore = score;
            predictedCategory = category as ExpenseCategory;
        }
    });

    // Calculate confidence (0-1)
    const totalWords = words.length;
    const confidence = totalWords > 0 ? Math.min(maxScore / totalWords, 1) : 0;

    return {
        category: predictedCategory,
        confidence: Math.round(confidence * 100) / 100,
    };
}

/**
 * Get top 3 category suggestions
 */
export function suggestCategories(title: string, notes?: string): ICategoryPrediction[] {
    const text = `${title} ${notes || ''}`.toLowerCase();

    const scores: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;

    // Initialize scores
    Object.keys(CATEGORY_KEYWORDS).forEach((category) => {
        scores[category as ExpenseCategory] = 0;
    });

    // Calculate scores
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
        keywords.forEach((keyword) => {
            if (text.includes(keyword.toLowerCase())) {
                scores[category as ExpenseCategory] += 1;
            }
        });
    });

    // Sort by score and get top 3
    const suggestions = Object.entries(scores)
        .map(([category, score]) => ({
            category: category as ExpenseCategory,
            confidence: Math.round((score / text.split(/\s+/).length) * 100) / 100,
        }))
        .filter((s) => s.confidence > 0)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

    return suggestions;
}

/**
 * Learn from user corrections (for future ML implementation)
 * Currently stores corrections for pattern analysis
 */
export function learnFromCorrection(
    originalText: string,
    predictedCategory: ExpenseCategory,
    actualCategory: ExpenseCategory
): void {
    // In production, this would store corrections in a database
    // for machine learning model training
    console.log('Learning from correction:', {
        text: originalText,
        predicted: predictedCategory,
        actual: actualCategory,
    });
}
