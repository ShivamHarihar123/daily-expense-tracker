# Daily Expense Tracker - Setup Guide

## 🗄️ MongoDB Setup Options

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **Verify MongoDB is Running**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check if running
   mongosh
   ```

3. **Your `.env.local` is already configured for local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/expense_tracker
   ```

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster**
   - Choose FREE tier (M0)
   - Select your region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `expensetracker`
   - Password: Generate a secure password
   - User Privileges: "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update `.env.local`**
   ```env
   MONGODB_URI=mongodb+srv://expensetracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```

---

## 🔑 Test Credentials

After starting the app, you can create a test account:

**Sign Up:**
- Name: `Test User`
- Email: `test@example.com`
- Password: `Test123!`

Or create your own account with any email/password!

---

## 🚀 Running the Project

1. **Install Dependencies** (if not done)
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to: http://localhost:3000
   - You should see the landing page

4. **Create Your Account**
   - Click "Get Started" or "Sign Up"
   - Fill in your details
   - Start tracking expenses!

---

## 📝 Quick Test Flow

1. **Sign Up** → Create account
2. **Add Expense** → Click "+ Add Expense"
   - Title: "Grocery Shopping"
   - Amount: 50
   - Watch AI suggest "Food & Dining" category!
3. **View Analytics** → See your first chart
4. **Set Budget** → Go to Budgets → Set $500 monthly limit
5. **Import CSV** → Try bulk import feature

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# Or install MongoDB if not installed
```

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Kill the process or use different port
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

### Module Not Found
```
Error: Cannot find module 'xyz'
```
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🎯 Environment Variables Explained

- **MONGODB_URI**: Your MongoDB connection string
- **JWT_ACCESS_SECRET**: Secret key for access tokens (change in production!)
- **JWT_REFRESH_SECRET**: Secret key for refresh tokens (change in production!)
- **NEXT_PUBLIC_APP_URL**: Your app's URL (for redirects, emails, etc.)

---

**You're all set! Happy expense tracking! 🎉**
