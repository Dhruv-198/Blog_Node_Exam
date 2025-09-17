const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        minlength: [1, 'Comment must not be empty'],
        maxlength: [1000, 'Comment must be less than 1000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must have an author']
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'Comment must be associated with an article']
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps
commentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    if (this.isModified('content') && !this.isNew) {
        this.isEdited = true;
        this.editedAt = new Date();
    }
    
    next();
});

// Index for performance
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
    return this.replies ? this.replies.length : 0;
});

// Ensure virtual fields are serialized
commentSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Comment', commentSchema);