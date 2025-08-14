import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // For faster queries
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
        index: true // For faster queries
    },
    bookmarked_at: {
        type: Date,
        default: Date.now,
        index: true // For sorting by date
    },
    // Cache blog data to avoid extra lookups and handle deleted blogs
    blog_data: {
        title: {
            type: String,
            required: true
        },
        author: {
            first_name: String,
            last_name: String
        },
        date_uploaded: Date,
        topic_tags: [String],
        thumbnail: String,
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        }
    }
}, { 
    collection: 'bookmarks',
    timestamps: true
});

// Compound index to ensure a user can't bookmark the same blog twice
bookmarkSchema.index({ user_id: 1, blog_id: 1 }, { unique: true });

// Index for efficient user bookmark queries
bookmarkSchema.index({ user_id: 1, bookmarked_at: -1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
