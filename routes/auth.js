const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, checkAuth, redirectIfAuthenticated, requireAuth } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(checkAuth);

// Login routes
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('login', { 
        error: null,
        formData: {}
    });
});

router.post('/login', redirectIfAuthenticated, authController.login);

// Register routes
router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('register', { 
        error: null,
        formData: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            bio: '',
            role: ''
        }
    });
});

router.post('/register', redirectIfAuthenticated, authController.register);

// Logout route
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

// Profile routes
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('articles', 'title status createdAt');
        
        res.render('profile', { 
            user,
            error: null
        });
    } catch (error) {
        console.error('Profile page error:', error);
        res.status(500).render('error', {
            message: 'Failed to load profile',
            error: {}
        });
    }
});

router.post('/profile', requireAuth, authController.updateProfile);

// API routes
router.get('/api/user', requireAuth, authController.getCurrentUser);

module.exports = router;