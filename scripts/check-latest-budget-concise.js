const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/expense_tracker';

async function checkBudgets() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('budgets');
        const latest = await collection.find({}).sort({ createdAt: -1 }).limit(1).toArray();
        if (latest.length > 0) {
            const b = latest[0];
            console.log(`_id: ${b._id}, userId: ${b.userId}, month: ${b.month}, year: ${b.year}, monthlyLimit: ${b.monthlyLimit}, createdAt: ${b.createdAt}`);
        } else {
            console.log('No budgets found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkBudgets();
