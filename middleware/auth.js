const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            res.clearCookie('authToken');
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.clearCookie('authToken');
        req.user = null;
        next();
    }
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (!req.user) {
        if (req.accepts('html')) {
            return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
        } else {
            return res.status(401).json({ message: 'Authentication required' });
        }
    }
    next();
};

// Middleware to require specific role
const requireRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            if (req.accepts('html')) {
                return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
            } else {
                return res.status(401).json({ message: 'Authentication required' });
            }
        }

        if (roles.length && !roles.includes(req.user.role)) {
            if (req.accepts('html')) {
                return res.status(403).render('error', { 
                    message: 'Access denied. Insufficient permissions.',
                    error: {}
                });
            } else {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }
        }

        next();
    };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(['admin']);

// Middleware to check if user is logged in (for views)
const checkAuth = (req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAuthenticated = !!req.user;
    res.locals.isAdmin = req.user && req.user.role === 'admin';
    next();
};

// Middleware to redirect authenticated users
const redirectIfAuthenticated = (req, res, next) => {
    if (req.user) {
        const redirectUrl = req.query.redirect || '/articles';
        return res.redirect(redirectUrl);
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAuth,
    requireRole,
    requireAdmin,
    checkAuth,
    redirectIfAuthenticated
};