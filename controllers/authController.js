const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Set token cookie
const setTokenCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('authToken', token, cookieOptions);
};

// Register controller
const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, bio, role } = req.body;

        // Validate role selection
        if (!role || !['user', 'admin'].includes(role)) {
            if (req.accepts('html')) {
                return res.status(400).render('register', {
                    error: 'Please select a valid account type',
                    formData: req.body
                });
            } else {
                return res.status(400).json({ message: 'Please select a valid account type' });
            }
        }

        // Check admin limit if trying to register as admin
        if (role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount >= 3) {
                if (req.accepts('html')) {
                    return res.status(400).render('register', {
                        error: 'Maximum number of administrators (3) has been reached. Please register as a regular user.',
                        formData: { ...req.body, role: 'user' }
                    });
                } else {
                    return res.status(400).json({ 
                        message: 'Maximum number of administrators (3) has been reached' 
                    });
                }
            }
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (req.accepts('html')) {
                return res.status(400).render('register', {
                    error: 'User with this email or username already exists',
                    formData: req.body
                });
            } else {
                return res.status(400).json({ 
                    message: 'User with this email or username already exists' 
                });
            }
        }

        // Create new user with selected role
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            bio: bio || '',
            role: role // Use the selected role
        });

        await user.save();

        // Generate token and set cookie
        const token = generateToken(user._id, user.role);
        setTokenCookie(res, token);

        if (req.accepts('html')) {
            // Redirect based on role
            const redirectUrl = user.role === 'admin' ? '/articles/my' : '/articles';
            res.redirect(redirectUrl);
        } else {
            res.status(201).json({
                message: `${user.role === 'admin' ? 'Administrator' : 'User'} registered successfully`,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        if (req.accepts('html')) {
            res.status(400).render('register', {
                error: error.message || 'Registration failed',
                formData: req.body
            });
        } else {
            res.status(400).json({ 
                message: error.message || 'Registration failed' 
            });
        }
    }
};

// Login controller
const login = async (req, res) => {
    try {
        const { email, password, expectedRole } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            if (req.accepts('html')) {
                return res.status(400).render('login', {
                    error: 'Invalid email or password',
                    formData: req.body
                });
            } else {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            if (req.accepts('html')) {
                return res.status(400).render('login', {
                    error: 'Invalid email or password',
                    formData: req.body
                });
            } else {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
        }

        // Check role if specified
        if (expectedRole && expectedRole !== user.role) {
            const roleNames = { admin: 'Administrator', user: 'Regular User' };
            if (req.accepts('html')) {
                return res.status(400).render('login', {
                    error: `This account is registered as ${roleNames[user.role]}, not ${roleNames[expectedRole]}`,
                    formData: req.body
                });
            } else {
                return res.status(400).json({ 
                    message: `Account role mismatch. Expected: ${expectedRole}, Actual: ${user.role}` 
                });
            }
        }

        // Generate token and set cookie
        const token = generateToken(user._id, user.role);
        setTokenCookie(res, token);

        if (req.accepts('html')) {
            // Redirect based on role
            let redirectUrl = req.query.redirect || '/articles';
            if (!req.query.redirect) {
                redirectUrl = user.role === 'admin' ? '/articles/my' : '/articles';
            }
            res.redirect(redirectUrl);
        } else {
            res.json({
                message: `Login successful as ${user.role === 'admin' ? 'Administrator' : 'User'}`,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName
                }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        
        if (req.accepts('html')) {
            res.status(500).render('login', {
                error: 'Login failed. Please try again.',
                formData: req.body
            });
        } else {
            res.status(500).json({ message: 'Login failed' });
        }
    }
};

// Logout controller
const logout = (req, res) => {
    res.clearCookie('authToken');
    
    if (req.accepts('html')) {
        res.redirect('/auth/login');
    } else {
        res.json({ message: 'Logout successful' });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('articles', 'title status createdAt');

        res.json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Failed to get user information' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, bio },
            { new: true, runValidators: true }
        ).select('-password');

        if (req.accepts('html')) {
            res.redirect('/users/profile');
        } else {
            res.json({
                message: 'Profile updated successfully',
                user
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        
        if (req.accepts('html')) {
            res.status(400).render('profile', {
                error: error.message || 'Profile update failed',
                user: req.user
            });
        } else {
            res.status(400).json({ 
                message: error.message || 'Profile update failed' 
            });
        }
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile
};