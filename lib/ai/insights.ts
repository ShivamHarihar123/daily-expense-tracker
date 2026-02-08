import { IExpense } from '@/types/models';
import { ExpenseCategory } from '@/types/enums';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface SpendingPattern {
    category: ExpenseCategory;
    averageAmount: number;
    frequency: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Generate AI-powered financial insights
 */
export function generateInsights(expenses: IExpense[]): {
    summary: string;
    recommendations: string[];
    anomalies: { description: string; severity: 'low' | 'medium' | 'high' }[];
    savingsPotential: number;
} {
    if (expenses.length === 0) {
        return {
            summary: 'No expense data available for analysis.',
            recommendations: ['Start tracking your expenses to get personalized insights.'],
            anomalies: [],
            savingsPotential: 0,
        };
    }

    const patterns = analyzeSpendingPatterns(expenses);
    const anomalies = detectAnomalies(expenses);
    const recommendations = generateRecommendations(patterns, expenses);
    const savingsPotential = calculateSavingsPotential(patterns, expenses);

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgExpense = totalSpent / expenses.length;
    const topCategory = patterns.sort((a, b) => b.averageAmount - a.averageAmount)[0];

    const summary = `You've spent ₹${totalSpent.toFixed(2)} across ${expenses.length} transactions. ` +
        `Your average expense is ₹${avgExpense.toFixed(2)}. ` +
        `${topCategory ? `You spend most on ${topCategory.category}.` : ''}`;

    return {
        summary,
        recommendations,
        anomalies,
        savingsPotential,
    };
}

/**
 * Analyze spending patterns by category
 */
function analyzeSpendingPatterns(expenses: IExpense[]): SpendingPattern[] {
    const categoryData: Record<string, { total: number; count: number; amounts: number[] }> = {};

    expenses.forEach((expense) => {
        if (!categoryData[expense.category]) {
            categoryData[expense.category] = { total: 0, count: 0, amounts: [] };
        }
        categoryData[expense.category].total += expense.amount;
        categoryData[expense.category].count += 1;
        categoryData[expense.category].amounts.push(expense.amount);
    });

    return Object.entries(categoryData).map(([category, data]) => {
        const averageAmount = data.total / data.count;
        const trend = calculateTrend(data.amounts);

        return {
            category: category as ExpenseCategory,
            averageAmount,
            frequency: data.count,
            trend,
        };
    });
}

/**
 * Calculate trend from amounts array
 */
function calculateTrend(amounts: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (amounts.length < 3) return 'stable';

    const firstHalf = amounts.slice(0, Math.floor(amounts.length / 2));
    const secondHalf = amounts.slice(Math.floor(amounts.length / 2));

    const firstAvg = firstHalf.reduce((sum, a) => sum + a, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, a) => sum + a, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
}

/**
 * Detect spending anomalies
 */
function detectAnomalies(expenses: IExpense[]): {
    description: string;
    severity: 'low' | 'medium' | 'high';
}[] {
    const anomalies: { description: string; severity: 'low' | 'medium' | 'high' }[] = [];

    const amounts = expenses.map((e) => e.amount);
    const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
    const stdDev = Math.sqrt(
        amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length
    );

    // Find unusually high expenses
    expenses.forEach((expense) => {
        if (expense.amount > avgAmount + 2 * stdDev) {
            anomalies.push({
                description: `Unusually high ${expense.category} expense of ₹${expense.amount.toFixed(2)} on ${format(new Date(expense.date), 'MMM dd')}`,
                severity: expense.amount > avgAmount + 3 * stdDev ? 'high' : 'medium',
            });
        }
    });

    return anomalies;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
    patterns: SpendingPattern[],
    expenses: IExpense[]
): string[] {
    const recommendations: string[] = [];

    // Check for increasing trends
    const increasingCategories = patterns.filter((p) => p.trend === 'increasing');
    if (increasingCategories.length > 0) {
        const topIncreasing = increasingCategories.sort((a, b) => b.averageAmount - a.averageAmount)[0];
        recommendations.push(
            `Your ${topIncreasing.category} expenses are increasing. Consider setting a budget limit.`
        );
    }

    // Check for high-frequency categories
    const highFrequency = patterns.filter((p) => p.frequency > expenses.length * 0.3);
    if (highFrequency.length > 0) {
        highFrequency.forEach((pattern) => {
            recommendations.push(
                `You have ${pattern.frequency} ${pattern.category} transactions. Look for subscription or recurring costs to optimize.`
            );
        });
    }

    // General recommendations
    const topSpending = patterns.sort((a, b) => b.averageAmount * b.frequency - a.averageAmount * a.frequency)[0];
    if (topSpending) {
        recommendations.push(
            `Focus on reducing ${topSpending.category} expenses to save more effectively.`
        );
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
}

/**
 * Calculate potential savings
 */
function calculateSavingsPotential(
    patterns: SpendingPattern[],
    expenses: IExpense[]
): number {
    // Estimate 10-15% savings potential on discretionary categories
    const discretionaryCategories = [
        ExpenseCategory.FOOD,
        ExpenseCategory.SHOPPING,
        ExpenseCategory.ENTERTAINMENT,
    ];

    const discretionarySpending = expenses
        .filter((e) => discretionaryCategories.includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);

    return Math.round(discretionarySpending * 0.15 * 100) / 100;
}
