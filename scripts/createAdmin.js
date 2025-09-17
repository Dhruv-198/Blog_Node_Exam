require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@blog.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            bio: 'System Administrator'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@blog.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();