const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/expense_tracker';

async function dropIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const collection = db.collection('budgets');
        
        console.log('Fetching indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));
        
        const userIdIndex = indexes.find(idx => idx.name === 'userId_1' && idx.unique && !idx.key.month);
        
        if (userIdIndex) {
            console.log('Dropping unique userId_1 index...');
            await collection.dropIndex('userId_1');
            console.log('Index dropped successfully');
        } else {
            console.log('Unique userId_1 index (single field) not found or already dropped');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

dropIndex();
