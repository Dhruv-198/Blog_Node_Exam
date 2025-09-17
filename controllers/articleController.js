const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const path = require('path');
const fs = require('fs');

// Get all articles (with pagination and filtering)
const getAllArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category, search, author } = req.query;

        // Build filter
        let filter = { status: 'published' };
        
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        if (author) {
            filter.author = author;
        }
        
        if (search) {
            filter.$text = { $search: search };
        }

        // Get articles with pagination
        const articles = await Article.find(filter)
            .populate('author', 'username firstName lastName')
            .populate('comments', 'content author createdAt')
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalArticles = await Article.countDocuments(filter);
        const totalPages = Math.ceil(totalArticles / limit);

        // Get categories for filter
        const categories = await Article.distinct('category');

        if (req.accepts('html')) {
            res.render('articleList', {
                articles,
                currentPage: page,
                totalPages,
                totalArticles,
                categories,
                currentCategory: category || 'all',
                searchQuery: search || '',
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            });
        } else {
            res.json({
                articles,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalArticles,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        }
    } catch (error) {
        console.error('Get articles error:', error);
        if (req.accepts('html')) {
            res.status(500).render('error', {
                message: 'Failed to load articles',
                error: {}
            });
        } else {
            res.status(500).json({ message: 'Failed to load articles' });
        }
    }
};

// Get user's articles
const getUserArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status } = req.query;

        let filter = { author: req.user._id };
        
        if (status && status !== 'all') {
            filter.status = status;
        }

        const articles = await Article.find(filter)
            .populate('author', 'username firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalArticles = await Article.countDocuments(filter);
        const totalPages = Math.ceil(totalArticles / limit);

        if (req.accepts('html')) {
            res.render('myArticles', {
                articles,
                currentPage: page,
                totalPages,
                totalArticles,
                currentStatus: status || 'all',
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            });
        } else {
            res.json({
                articles,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalArticles,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        }
    } catch (error) {
        console.error('Get user articles error:', error);
        if (req.accepts('html')) {
            res.status(500).render('error', {
                message: 'Failed to load your articles',
                error: {}
            });
        } else {
            res.status(500).json({ message: 'Failed to load user articles' });
        }
    }
};

// Get single article
const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username firstName lastName bio')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username firstName lastName'
                },
                options: { sort: { createdAt: -1 } }
            });

        if (!article) {
            if (req.accepts('html')) {
                return res.status(404).render('error', {
                    message: 'Article not found',
                    error: {}
                });
            } else {
                return res.status(404).json({ message: 'Article not found' });
            }
        }

        // Check if user can view this article
        if (article.status !== 'published' && 
            (!req.user || (req.user._id.toString() !== article.author._id.toString() && req.user.role !== 'admin'))) {
            if (req.accepts('html')) {
                return res.status(403).render('error', {
                    message: 'Access denied',
                    error: {}
                });
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        // Increment views for published articles
        if (article.status === 'published') {
            await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        }

        if (req.accepts('html')) {
            res.render('articleItem', { article });
        } else {
            res.json({ article });
        }
    } catch (error) {
        console.error('Get article error:', error);
        if (req.accepts('html')) {
            res.status(500).render('error', {
                message: 'Failed to load article',
                error: {}
            });
        } else {
            res.status(500).json({ message: 'Failed to load article' });
        }
    }
};

// Create article
const createArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, status } = req.body;
        
        const articleData = {
            title,
            content,
            summary,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            status: status || 'draft',
            author: req.user._id
        };
        
        // Handle image upload
        if (req.file) {
            articleData.featuredImage = '/uploads/articles/' + req.file.filename;
        }
        
        const article = new Article(articleData);
        await article.save();

        // Add article to user's articles array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { articles: article._id }
        });

        if (req.accepts('html')) {
            res.redirect(`/articles/${article._id}`);
        } else {
            res.status(201).json({
                message: 'Article created successfully',
                article
            });
        }
    } catch (error) {
        console.error('Create article error:', error);
        
        // Clean up uploaded file if there's an error
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'public', 'uploads', 'articles', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        if (req.accepts('html')) {
            // Ensure formData has all required properties with fallbacks
            const formData = {
                title: req.body.title || '',
                content: req.body.content || '',
                summary: req.body.summary || '',
                category: req.body.category || '',
                tags: req.body.tags || '',
                status: req.body.status || 'draft',
                featuredImage: req.body.featuredImage || ''
            };
            
            res.status(400).render('articleForm', {
                error: error.message || 'Failed to create article',
                formData: formData,
                isEdit: false,
                article: null
            });
        } else {
            res.status(400).json({ 
                message: error.message || 'Failed to create article' 
            });
        }
    }
};

// Update article
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            if (req.accepts('html')) {
                return res.status(404).render('error', {
                    message: 'Article not found',
                    error: {}
                });
            } else {
                return res.status(404).json({ message: 'Article not found' });
            }
        }

        // Only admin can update articles
        if (req.user.role !== 'admin') {
            if (req.accepts('html')) {
                return res.status(403).render('error', {
                    message: 'Access denied. Admin privileges required.',
                    error: {}
                });
            } else {
                return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
            }
        }

        const { title, content, summary, category, tags, status } = req.body;
        
        // Store old image for cleanup if needed
        const oldImage = article.featuredImage;
        
        article.title = title;
        article.content = content;
        article.summary = summary;
        article.category = category;
        article.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        article.status = status || article.status;
        
        // Handle image upload
        if (req.file) {
            article.featuredImage = '/uploads/articles/' + req.file.filename;
            
            // Clean up old image if it exists
            if (oldImage && oldImage.startsWith('/uploads/')) {
                const oldFilePath = path.join(__dirname, '..', 'public', oldImage);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
        }

        await article.save();

        if (req.accepts('html')) {
            res.redirect(`/articles/${article._id}`);
        } else {
            res.json({
                message: 'Article updated successfully',
                article
            });
        }
    } catch (error) {
        console.error('Update article error:', error);
        
        // Clean up uploaded file if there's an error
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'public', 'uploads', 'articles', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        
        if (req.accepts('html')) {
            // Ensure formData has all required properties with fallbacks
            const formData = {
                title: req.body.title || '',
                content: req.body.content || '',
                summary: req.body.summary || '',
                category: req.body.category || '',
                tags: req.body.tags || '',
                status: req.body.status || 'draft',
                featuredImage: req.body.featuredImage || ''
            };
            
            res.status(400).render('articleForm', {
                error: error.message || 'Failed to update article',
                formData: formData,
                isEdit: true,
                article: { _id: req.params.id }
            });
        } else {
            res.status(400).json({
                message: error.message || 'Failed to update article'
            });
        }
    }
};

// Delete article
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            if (req.accepts('html')) {
                return res.status(404).render('error', {
                    message: 'Article not found',
                    error: {}
                });
            } else {
                return res.status(404).json({ message: 'Article not found' });
            }
        }

        // Only admin can delete articles
        if (req.user.role !== 'admin') {
            if (req.accepts('html')) {
                return res.status(403).render('error', {
                    message: 'Access denied. Admin privileges required.',
                    error: {}
                });
            } else {
                return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
            }
        }

        // Delete associated comments
        await Comment.deleteMany({ article: req.params.id });

        // Remove article from user's articles array
        await User.findByIdAndUpdate(article.author, {
            $pull: { articles: article._id }
        });

        // Delete the article
        await Article.findByIdAndDelete(req.params.id);

        if (req.accepts('html')) {
            res.redirect('/articles/my');
        } else {
            res.json({ message: 'Article deleted successfully' });
        }
    } catch (error) {
        console.error('Delete article error:', error);
        if (req.accepts('html')) {
            res.status(500).render('error', {
                message: 'Failed to delete article',
                error: {}
            });
        } else {
            res.status(500).json({ message: 'Failed to delete article' });
        }
    }
};

module.exports = {
    getAllArticles,
    getUserArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
};