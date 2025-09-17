const express = require('express');
const router = express.Router();
const { authenticateToken, checkAuth, requireAuth, requireAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(checkAuth);

// User profile routes
router.get('/profile', requireAuth, (req, res) => {
    res.redirect('/auth/profile');
});

// Admin routes
router.get('/admin', requireAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const Article = require('../models/Article');
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        const articles = await Article.find()
            .populate('author', 'username firstName lastName')
            .sort({ createdAt: -1 });
        
        const stats = {
            totalUsers: await User.countDocuments(),
            totalArticles: await Article.countDocuments(),
            publishedArticles: await Article.countDocuments({ status: 'published' }),
            draftArticles: await Article.countDocuments({ status: 'draft' })
        };

        res.render('admin', {
            users,
            articles,
            stats
        });
    } catch (error) {
        console.error('Admin page error:', error);
        res.status(500).render('error', {
            message: 'Failed to load admin dashboard',
            error: {}
        });
    }
});

// View user details
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const User = require('../models/User');
        const Article = require('../models/Article');
        
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('articles', 'title status createdAt');
        
        if (!user) {
            return res.status(404).render('error', {
                message: 'User not found',
                error: {}
            });
        }

        // Check permission (users can only view their own profile, admins can view any)
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).render('error', {
                message: 'Access denied',
                error: {}
            });
        }

        const userArticles = await Article.find({ author: user._id, status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(10);

        res.render('userProfile', {
            profileUser: user,
            userArticles,
            isOwnProfile: req.user._id.toString() === user._id.toString()
        });
    } catch (error) {
        console.error('User profile error:', error);
        res.status(500).render('error', {
            message: 'Failed to load user profile',
            error: {}
        });
    }
});

module.exports = router;