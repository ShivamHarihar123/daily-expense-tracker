# Daily Expense Tracker - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Git

### Installation

1. **Clone and Install**
```bash
cd d:/csproject/daily_expense_tracker
npm install --legacy-peer-deps
```

2. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Features Available

### ✅ Authentication
- Sign up with email/password
- Login with validation
- Secure JWT authentication
- Password reset flow (UI ready)

### ✅ Expense Management
- Add expenses with AI categorization
- Search and filter expenses
- View expense details
- Edit and delete expenses
- Import expenses from CSV
- Export expenses to CSV

### ✅ Analytics
- Category distribution pie chart
- Monthly spending trends
- Top spending categories
- AI-powered insights
- Period filters (week/month/year)

### ✅ Budget Tracking
- Set monthly budget limits
- Visual progress bars
- Budget alerts
- Category-wise spending
- Alert thresholds

### ✅ Profile & Settings
- Edit profile information
- Change password
- Account preferences
- Delete account

---

## 🎨 UI Features

- 🌓 **Dark/Light Mode** - Toggle in navbar
- 📱 **Fully Responsive** - Works on all devices
- ✨ **Glassmorphism** - Modern design effects
- 🎭 **Smooth Animations** - Framer Motion ready
- 🎨 **SCSS Modules** - Scoped styling

---

## 🔑 Default Test Data

After starting the app:
1. Sign up for a new account
2. Add some expenses to see analytics
3. Set a budget to track spending
4. Import sample CSV for bulk data

---

## 📁 Project Structure

```
daily_expense_tracker/
├── app/                    # Next.js pages
│   ├── (auth)/            # Auth pages
│   ├── api/               # API routes
│   ├── expenses/          # Expense pages
│   ├── analytics/         # Analytics page
│   ├── budgets/           # Budget page
│   └── profile/           # Profile page
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                   # Utilities
│   ├── db/               # Database
│   ├── auth/             # Authentication
│   ├── ai/               # AI services
│   └── utils/            # Helpers
├── models/                # Mongoose models
├── repositories/          # Data access
├── services/             # Business logic
├── store/                # Zustand stores
├── hooks/                # Custom hooks
├── types/                # TypeScript types
└── styles/               # SCSS styles
```

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🎯 Key Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Zustand** - State management
- **Recharts** - Data visualization
- **SCSS Modules** - Styling
- **Zod** - Validation
- **JWT** - Authentication

---

## 📝 Notes

- The app uses HTTP-only cookies for authentication
- AI categorization uses keyword-based NLP
- All passwords are hashed with bcrypt
- Dark mode preference is saved to localStorage
- CSV import supports standard expense format

---

**Ready to track your expenses! 🚀**
