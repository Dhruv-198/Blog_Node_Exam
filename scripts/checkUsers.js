require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const users = await User.find({}, 'username email role firstName lastName');
        
        console.log('=== ALL USERS AND THEIR ROLES ===');
        console.log('----------------------------------');
        
        users.forEach(user => {
            const roleIcon = user.role === 'admin' ? '👑' : '👤';
            console.log(`${roleIcon} ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Username: ${user.username}`);
            console.log(`   Role: ${user.role.toUpperCase()}`);
            console.log('----------------------------------');
        });
        
        const adminCount = users.filter(u => u.role === 'admin').length;
        const userCount = users.filter(u => u.role === 'user').length;
        
        console.log(`\n📊 SUMMARY:`);
        console.log(`👑 Admins: ${adminCount}`);
        console.log(`👤 Users: ${userCount}`);
        console.log(`📋 Total: ${users.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();