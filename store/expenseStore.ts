import { create } from 'zustand';
import { IExpense, IExpenseFilter } from '@/types/models';

interface ExpenseState {
    expenses: IExpense[];
    filters: IExpenseFilter;
    isLoading: boolean;
    error: string | null;

    setExpenses: (expenses: IExpense[]) => void;
    addExpense: (expense: IExpense) => void;
    updateExpense: (id: string, updates: Partial<IExpense>) => void;
    removeExpense: (id: string) => void;
    setFilters: (filters: IExpenseFilter) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearExpenses: () => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
    expenses: [],
    filters: {},
    isLoading: false,
    error: null,

    setExpenses: (expenses) =>
        set({
            expenses,
            isLoading: false,
            error: null,
        }),

    addExpense: (expense) =>
        set((state) => ({
            expenses: [expense, ...state.expenses],
        })),

    updateExpense: (id, updates) =>
        set((state) => ({
            expenses: state.expenses.map((exp) =>
                exp._id === id ? { ...exp, ...updates } : exp
            ),
        })),

    removeExpense: (id) =>
        set((state) => ({
            expenses: state.expenses.filter((exp) => exp._id !== id),
        })),

    setFilters: (filters) =>
        set({
            filters,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    setError: (error) =>
        set({
            error,
            isLoading: false,
        }),

    clearExpenses: () =>
        set({
            expenses: [],
            filters: {},
            error: null,
        }),
}));
