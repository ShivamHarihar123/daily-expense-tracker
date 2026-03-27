const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/expense_tracker';

async function checkBudgets() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('budgets');
        const count = await collection.countDocuments();
        console.log(`Total budgets: ${count}`);
        const all = await collection.find({}).toArray();
        all.forEach(b => {
            console.log(`_id: ${b._id}, userId: ${b.userId}, month: ${b.month}, year: ${b.year}, monthlyLimit: ${b.monthlyLimit}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkBudgets();
