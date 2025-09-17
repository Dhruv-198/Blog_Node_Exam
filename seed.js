const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
require('dotenv').config();

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Article.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@blog.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            bio: 'System administrator and content moderator'
        });
        await adminUser.save();
        console.log('Created admin user');

        // Create regular user
        const regularUser = new User({
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            bio: 'Tech enthusiast and writer passionate about web development'
        });
        await regularUser.save();
        console.log('Created regular user');

        // Create sample articles
        const articles = [
            {
                title: 'Getting Started with Node.js and Express',
                content: 'Node.js has revolutionized server-side JavaScript development. In this comprehensive guide, we will explore how to build robust web applications using Node.js and Express framework. Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
                summary: 'Learn how to build web applications with Node.js and Express framework from scratch.',
                author: regularUser._id,
                category: 'Technology',
                tags: ['nodejs', 'express', 'javascript', 'web-development'],
                status: 'published'
            },
            {
                title: 'The Future of Web Development: Trends to Watch',
                content: 'The web development landscape is constantly evolving, with new technologies and methodologies emerging regularly. As we look ahead, several key trends are shaping the future of how we build and interact with web applications. JAMstack architecture, Progressive Web Apps, Serverless Computing, and AI integration are some of the key trends.',
                summary: 'Explore the latest trends shaping the future of web development, from JAMstack to AI integration.',
                author: adminUser._id,
                category: 'Technology',
                tags: ['web-development', 'future-tech', 'jamstack', 'pwa', 'ai'],
                status: 'published'
            },
            {
                title: 'Building Better User Interfaces with Modern CSS',
                content: 'Modern CSS has evolved tremendously, offering powerful tools and techniques for creating beautiful, responsive, and performant user interfaces. CSS Grid and Flexbox have revolutionized layouts, while CSS Custom Properties make styling more maintainable. Modern animations and container queries are pushing the boundaries of what we can achieve.',
                summary: 'Discover modern CSS techniques for building beautiful and responsive user interfaces.',
                author: regularUser._id,
                category: 'Technology',
                tags: ['css', 'frontend', 'ui-design', 'responsive-design'],
                status: 'published'
            },
            {
                title: 'Healthy Work-Life Balance for Developers',
                content: 'As software developers, we often find ourselves deeply immersed in code, sometimes losing track of time and neglecting other important aspects of life. Maintaining a healthy work-life balance is crucial for long-term success and well-being. This includes setting clear boundaries, practicing time management, taking care of physical health, and pursuing interests outside of coding.',
                summary: 'Essential tips for maintaining a healthy work-life balance as a software developer.',
                author: adminUser._id,
                category: 'Lifestyle',
                tags: ['work-life-balance', 'developer-life', 'wellness', 'productivity'],
                status: 'published'
            },
            {
                title: 'Draft: Understanding Database Design Patterns',
                content: 'This is a draft article about database design patterns. It covers normalization, denormalization, and various design approaches for different use cases. Content is still being developed and will be expanded with detailed examples and best practices.',
                summary: 'A comprehensive guide to database design patterns and best practices.',
                author: regularUser._id,
                category: 'Technology',
                tags: ['database', 'design-patterns', 'sql'],
                status: 'draft'
            }
        ];

        for (const articleData of articles) {
            const article = new Article(articleData);
            await article.save();
            
            // Add article to user's articles array
            await User.findByIdAndUpdate(articleData.author, {
                $push: { articles: article._id }
            });
        }
        
        console.log('Created sample articles');
        console.log('\n=== Seed Data Created Successfully ===');
        console.log('Admin User:');
        console.log('  Email: admin@blog.com');
        console.log('  Password: admin123');
        console.log('\nRegular User:');
        console.log('  Email: john@example.com');
        console.log('  Password: password123');
        console.log('\nYou can now test the application with these accounts!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

seedDatabase();