import connectDB from './mongoose';

/**
 * Create database indexes for optimal query performance
 */
export async function createIndexes() {
    try {
        const db = await connectDB();

        // User indexes
        await db.connection.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.connection.collection('users').createIndex({ verificationToken: 1 });
        await db.connection.collection('users').createIndex({ resetPasswordToken: 1 });

        // Expense indexes
        await db.connection.collection('expenses').createIndex({ userId: 1, date: -1 });
        await db.connection.collection('expenses').createIndex({ userId: 1, category: 1 });
        await db.connection.collection('expenses').createIndex({ userId: 1, isDeleted: 1 });
        await db.connection.collection('expenses').createIndex({ userId: 1, createdAt: -1 });
        await db.connection.collection('expenses').createIndex({
            userId: 1,
            date: -1,
            category: 1
        });

        // Budget indexes
        await db.connection.collection('budgets').createIndex({ userId: 1 }, { unique: true });

        // Notification indexes
        await db.connection.collection('notifications').createIndex({ userId: 1, createdAt: -1 });
        await db.connection.collection('notifications').createIndex({ userId: 1, readStatus: 1 });

        console.log('✅ Database indexes created successfully');
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        throw error;
    }
}
