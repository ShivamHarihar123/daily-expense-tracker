const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/expense_tracker';

async function migrateBudgets() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('budgets');
        const all = await collection.find({}).sort({ updatedAt: -1 }).toArray();
        
        console.log(`Analyzing ${all.length} budgets...`);
        
        const seen = new Set();
        const toKeep = [];
        const toDeleteIds = [];
        
        for (const b of all) {
            // Treat undefined month/year as current for cleanup or special case
            const month = b.month !== undefined ? b.month : 'NA';
            const year = b.year !== undefined ? b.year : 'NA';
            const key = `${b.userId}_${month}_${year}`;
            
            if (seen.has(key)) {
                console.log(`Duplicate found: ${key} (_id: ${b._id}). Deleting.`);
                toDeleteIds.push(b._id);
            } else {
                seen.add(key);
                toKeep.push(b);
            }
        }
        
        if (toDeleteIds.length > 0) {
            console.log(`Deleting ${toDeleteIds.length} duplicate/old budgets...`);
            await collection.deleteMany({ _id: { $in: toDeleteIds } });
        }
        
        // Also cleanup the 'NA' (undefined) ones if there are regular ones
        // Actually, let's just make sure we drop the old index again and try to create the new one
        console.log('Dropping existing userId_1 index if it still exists as non-unique...');
        try {
            await collection.dropIndex('userId_1');
        } catch (e) {}
        
        console.log('Ensuring new unique index: { userId: 1, month: 1, year: 1 }');
        await collection.createIndex({ userId: 1, month: 1, year: 1 }, { unique: true });
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateBudgets();
