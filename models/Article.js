const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [200, 'Title must be less than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Article content is required'],
        minlength: [10, 'Content must be at least 10 characters long']
    },
    summary: {
        type: String,
        maxlength: [500, 'Summary must be less than 500 characters'],
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Article must have an author']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education', 'Entertainment', 'Sports', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [50, 'Tag must be less than 50 characters']
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    featuredImage: {
        type: String,
        default: ''
    },
    readTime: {
        type: Number,
        default: 1 // minutes
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    }
});

// Calculate read time based on content length
articleSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / wordsPerMinute) || 1;
    }
    
    // Auto-generate summary if not provided
    if (!this.summary && this.content) {
        this.summary = this.content.substring(0, 200) + (this.content.length > 200 ? '...' : '');
    }
    
    // Set published date when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    this.updatedAt = new Date();
    next();
});

// Index for search and performance
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ author: 1, status: 1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ publishedAt: -1 });

// Virtual for like count
articleSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
articleSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Ensure virtual fields are serialized
articleSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Article', articleSchema);