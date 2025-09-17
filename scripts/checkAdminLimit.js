require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkAdminLimit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Count total admins
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = await User.countDocuments({ role: 'user' });
        const totalUsers = await User.countDocuments();

        console.log('=== ADMIN LIMIT STATUS ===');
        console.log('-------------------------');
        console.log(`👑 Current Admins: ${adminCount}/3`);
        console.log(`👤 Regular Users: ${userCount}`);
        console.log(`📊 Total Users: ${totalUsers}`);
        console.log('-------------------------');

        if (adminCount >= 3) {
            console.log('🚫 ADMIN LIMIT REACHED - No new admin registrations allowed');
        } else {
            console.log(`✅ Admin slots available: ${3 - adminCount} remaining`);
        }

        console.log('\n=== CURRENT ADMIN USERS ===');
        const admins = await User.find({ role: 'admin' }, 'firstName lastName email username');
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAdminLimit();