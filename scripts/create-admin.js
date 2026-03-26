const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function createAdmin() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@expensetracker.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const adminName = 'Admin User';

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingUser = await mongoose.connection.db.collection('users').findOne({ email: adminEmail });

        if (existingUser) {
            console.log(`ℹ️  Admin user [${adminEmail}] already exists`);

            // Update password and ensure admin role
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await mongoose.connection.db.collection('users').updateOne(
                { email: adminEmail },
                {
                    $set: {
                        password: hashedPassword,
                        role: 'admin',
                        verified: true
                    }
                }
            );
            console.log('✅ Admin credentials updated and role verified');
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await mongoose.connection.db.collection('users').insertOne({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                verified: true,
                avatar: null,
                oauthProvider: 'local',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`✅ Admin user [${adminEmail}] created successfully!`);
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
