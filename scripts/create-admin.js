const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/expense_tracker');
        console.log('✅ Connected to MongoDB');

        const email = 'admin@expensetracker.com';
        const password = 'Admin@123';
        const name = 'Admin User';

        // Check if admin already exists
        const existingUser = await mongoose.connection.db.collection('users').findOne({ email });

        if (existingUser) {
            console.log('ℹ️  Admin user already exists');

            // Update password and ensure admin role
            const hashedPassword = await bcrypt.hash(password, 10);
            await mongoose.connection.db.collection('users').updateOne(
                { email },
                {
                    $set: {
                        password: hashedPassword,
                        role: 'admin',
                        verified: true
                    }
                }
            );
            console.log('✅ Admin password updated and role verified');
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(password, 10);

            await mongoose.connection.db.collection('users').insertOne({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                verified: true,
                avatar: null,
                oauthProvider: 'local',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log('✅ Admin user created successfully!');
        }

        await mongoose.connection.close();

        console.log('\n=================================');
        console.log('ADMIN LOGIN CREDENTIALS:');
        console.log('=================================');
        console.log('Email:    admin@expensetracker.com');
        console.log('Password: Admin@123');
        console.log('=================================');
        console.log('\nAdmin Panel URL: http://localhost:3001/admin');
        console.log('Login URL: http://localhost:3001/login');
        console.log('\n✅ Setup complete!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createAdmin();
