require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createRegularUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if regular user already exists
        const existingUser = await User.findOne({ email: 'user@blog.com' });
        if (existingUser) {
            console.log('Regular user already exists:', existingUser.email);
            process.exit(0);
        }

        // Create regular user
        const regularUser = new User({
            username: 'regularuser',
            email: 'user@blog.com',
            password: 'user123',
            firstName: 'Regular',
            lastName: 'User',
            role: 'user',
            bio: 'Regular blog reader'
        });

        await regularUser.save();
        console.log('Regular user created successfully!');
        console.log('Email: user@blog.com');
        console.log('Password: user123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

createRegularUser();