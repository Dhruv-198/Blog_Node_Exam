const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateToken, checkAuth, requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(checkAuth);

// Article list routes
router.get('/', articleController.getAllArticles);

// My articles route (Admin only)
router.get('/my', requireAdmin, articleController.getUserArticles);

// New article form (Admin only)
router.get('/new', requireAdmin, (req, res) => {
    res.render('articleForm', {
        error: null,
        formData: {
            title: '',
            content: '',
            summary: '',
            category: '',
            tags: '',
            status: 'draft',
            featuredImage: ''
        },
        isEdit: false,
        article: null
    });
});

// Create article (Admin only)
router.post('/new', requireAdmin, upload.single('articleImage'), articleController.createArticle);

// Edit article form (Admin only)
router.get('/:id/edit', requireAdmin, async (req, res) => {
    try {
        const Article = require('../models/Article');
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).render('error', {
                message: 'Article not found',
                error: {}
            });
        }

        // Only admin can edit any article
        if (req.user.role !== 'admin') {
            return res.status(403).render('error', {
                message: 'Access denied. Admin privileges required.',
                error: {}
            });
        }

        res.render('articleForm', {
            error: null,
            formData: {
                title: article.title,
                content: article.content,
                summary: article.summary,
                category: article.category,
                tags: article.tags.join(', '),
                status: article.status,
                featuredImage: article.featuredImage
            },
            isEdit: true,
            article
        });
    } catch (error) {
        console.error('Edit article form error:', error);
        res.status(500).render('error', {
            message: 'Failed to load article for editing',
            error: {}
        });
    }
});

// Update article (Admin only)
router.post('/:id/edit', requireAdmin, upload.single('articleImage'), articleController.updateArticle);

// Delete article (Admin only)
router.post('/:id/delete', requireAdmin, articleController.deleteArticle);

// View single article
router.get('/:id', articleController.getArticle);

module.exports = router;