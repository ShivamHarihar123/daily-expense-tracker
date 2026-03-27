const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/expense_tracker';

async function updateBudgets() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('budgets');
        const userId = '6988a4bf860448d6b92358fc';
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        
        console.log(`Setting budget for user ${userId} for ${month}/${year}...`);
        
        await collection.updateOne(
            { userId, month: { $exists: false } },
            { $set: { month: month, year: year, monthlyLimit: 5000 } }
        );
        
        console.log('Update result shown if we check again.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateBudgets();
