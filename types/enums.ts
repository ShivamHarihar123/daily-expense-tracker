export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum ExpenseCategory {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  BILLS = 'Bills & Utilities',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  TRAVEL = 'Travel',
  GROCERIES = 'Groceries',
  RENT = 'Rent',
  SALARY = 'Salary',
  INVESTMENT = 'Investment',
  OTHER = 'Other'
}

export enum PaymentMode {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  UPI = 'UPI',
  NET_BANKING = 'Net Banking',
  WALLET = 'Wallet',
  OTHER = 'Other'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  JPY = 'JPY',
  AUD = 'AUD',
  CAD = 'CAD'
}

export enum NotificationType {
  BUDGET_ALERT = 'budget_alert',
  WEEKLY_REPORT = 'weekly_report',
  EXPENSE_ADDED = 'expense_added',
  SYSTEM = 'system'
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}
