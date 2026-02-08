# Admin Panel - Daily Expense Tracker

## 🎯 Overview
Complete admin dashboard for managing users and monitoring system-wide statistics.

## 🔐 Admin Credentials

```
Email:    admin@expensetracker.com
Password: Admin@123
```

## 📍 Admin Panel URLs

- **Login**: http://localhost:3001/login
- **Admin Dashboard**: http://localhost:3001/admin
- **User Management**: http://localhost:3001/admin/users

## ✨ Features

### 1. Admin Dashboard (`/admin`)
- **System Statistics**:
  - Total Users Count
  - Total Expenses Count
  - Total Budgets Count
  - Total System Spending
- **Recent Users**: View last 10 registered users
- **Quick Actions**: Navigate to user management and analytics

### 2. User Management (`/admin/users`)
- **View All Users**: Paginated list with 20 users per page
- **Search Users**: Search by name or email
- **User Actions**:
  - Toggle user role (User ↔ Admin)
  - Delete users (with cascade delete of their data)
  - View user status (Verified/Unverified)
- **Pagination**: Navigate through multiple pages of users

## 🛡️ Security Features

- ✅ **Role-Based Access Control (RBAC)**
- ✅ **JWT Authentication**
- ✅ **Admin-Only Middleware Protection**
- ✅ **Prevents self-deletion**
- ✅ **Secure password hashing (bcrypt)**

## 🚀 How to Access

### Step 1: Login as Admin
1. Go to http://localhost:3001/login
2. Enter credentials:
   - Email: `admin@expensetracker.com`
   - Password: `Admin@123`
3. Click "Sign In"

### Step 2: Access Admin Panel
After login, you'll be redirected to the regular dashboard. To access the admin panel:
- Navigate to: http://localhost:3001/admin
- Or use the navigation menu (if admin links are added)

## 📊 API Endpoints

### Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Cookie (accessToken)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "totalExpenses": 5420,
      "totalBudgets": 98,
      "totalSpending": 125430.50
    },
    "recentUsers": [...]
  }
}
```

### List All Users
```http
GET /api/admin/users?page=1&limit=20&search=john&role=user
Authorization: Cookie (accessToken)
```

**Response:**
```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalItems": 150
  }
}
```

### Update User
```http
PATCH /api/admin/users/:id
Authorization: Cookie (accessToken)
Content-Type: application/json

{
  "role": "admin",
  "verified": true
}
```

### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Cookie (accessToken)
```

## 🔧 Admin User Management

### Create Additional Admin Users

Run the script:
```bash
node scripts/create-admin.js
```

Or manually in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Reset Admin Password

```bash
node scripts/create-admin.js
```
This will reset the password to `Admin@123`

## 🎨 Admin Panel Features

### Dashboard
- 📊 Real-time system statistics
- 👥 Recent user registrations
- 🎯 Quick action buttons
- 💰 Total spending across all users

### User Management
- 🔍 Search and filter users
- 👑 Promote users to admin
- 👤 Demote admins to regular users
- 🗑️ Delete users (with data cascade)
- ✅ View verification status
- 📅 See registration dates

## 🛠️ Technical Details

### Middleware
- `middleware/adminAuth.ts` - Protects admin routes
- Verifies JWT token
- Checks for admin role
- Returns 403 if not admin

### Repository Methods
- `UserRepository.getAllUsers()` - Paginated user list
- `UserRepository.countUsers()` - Total user count
- `UserRepository.updateUser()` - Update user data
- `UserRepository.deleteUser()` - Delete user + cascade
- `ExpenseRepository.countAllExpenses()` - System expense count
- `ExpenseRepository.getTotalSystemSpending()` - Total spending
- `BudgetRepository.countAllBudgets()` - Total budgets

### Frontend Pages
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/users/page.tsx` - User management
- Protected by role check in `useEffect`

## 📝 Notes

- Admin users cannot delete themselves
- Deleting a user cascades to delete all their expenses and budgets
- All admin routes require authentication + admin role
- Search is case-insensitive and searches both name and email

## 🚨 Important

**Default Admin Credentials:**
- Email: `admin@expensetracker.com`
- Password: `Admin@123`

**⚠️ CHANGE THE DEFAULT PASSWORD IN PRODUCTION!**

## 🎯 Next Steps

1. Login with admin credentials
2. Access `/admin` to see dashboard
3. Navigate to `/admin/users` to manage users
4. Test user role toggling and deletion
5. Monitor system statistics

---

**Admin Panel is Ready!** 🎉

Access it at: http://localhost:3001/admin
