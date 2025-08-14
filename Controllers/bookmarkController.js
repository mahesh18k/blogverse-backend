import Bookmark from '../Models/bookmarkModel.js';
import Blog from '../Models/blogModel.js';

// Get all bookmarks for a user
export const getUserBookmarks = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const bookmarks = await Bookmark
            .find({ user_id: userId })
            .sort({ bookmarked_at: -1 }) // Most recent first
            .exec();

        // Return the cached blog data from bookmarks
        const bookmarkData = bookmarks.map(bookmark => ({
            _id: bookmark.blog_id,
            ...bookmark.blog_data,
            bookmarked_at: bookmark.bookmarked_at
        }));

        res.status(200).json({
            success: true,
            bookmarks: bookmarkData,
            count: bookmarks.length
        });

    } catch (error) {
        console.error('Error fetching user bookmarks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookmarks' 
        });
    }
};

// Add a bookmark
export const addBookmark = async (req, res) => {
    try {
        const { userId } = req.params;
        const { blogId } = req.body;

        if (!userId || !blogId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Blog ID are required' 
            });
        }

        // Check if bookmark already exists
        const existingBookmark = await Bookmark.findOne({
            user_id: userId,
            blog_id: blogId
        });

        if (existingBookmark) {
            return res.status(400).json({ 
                success: false, 
                message: 'Blog is already bookmarked' 
            });
        }

        // Fetch the blog data to cache in bookmark
        const blog = await Blog.findById(blogId).populate('author', 'first_name last_name');
        
        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: 'Blog not found' 
            });
        }

        // Create the bookmark with cached blog data
        const bookmark = new Bookmark({
            user_id: userId,
            blog_id: blogId,
            blog_data: {
                title: blog.title,
                author: {
                    first_name: blog.author?.first_name || 'Unknown',
                    last_name: blog.author?.last_name || 'Author'
                },
                date_uploaded: blog.date_uploaded,
                topic_tags: blog.topic_tags || [],
                thumbnail: blog.thumbnail,
                upvotes: blog.upvotes || 0,
                downvotes: blog.downvotes || 0,
                views: blog.views || 0
            }
        });

        await bookmark.save();

        res.status(201).json({
            success: true,
            message: 'Blog bookmarked successfully',
            bookmark: {
                _id: blog._id,
                ...bookmark.blog_data,
                bookmarked_at: bookmark.bookmarked_at
            }
        });

    } catch (error) {
        console.error('Error adding bookmark:', error);
        
        // Handle duplicate key error (in case of race condition)
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Blog is already bookmarked' 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Failed to add bookmark' 
        });
    }
};

// Remove a bookmark
export const removeBookmark = async (req, res) => {
    try {
        const { userId } = req.params;
        const { blogId } = req.body;

        if (!userId || !blogId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Blog ID are required' 
            });
        }

        const deletedBookmark = await Bookmark.findOneAndDelete({
            user_id: userId,
            blog_id: blogId
        });

        if (!deletedBookmark) {
            return res.status(404).json({ 
                success: false, 
                message: 'Bookmark not found' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully'
        });

    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove bookmark' 
        });
    }
};

// Check if a blog is bookmarked by user
export const checkBookmarkStatus = async (req, res) => {
    try {
        const { userId, blogId } = req.params;

        if (!userId || !blogId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Blog ID are required' 
            });
        }

        const bookmark = await Bookmark.findOne({
            user_id: userId,
            blog_id: blogId
        });

        res.status(200).json({
            success: true,
            isBookmarked: !!bookmark
        });

    } catch (error) {
        console.error('Error checking bookmark status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to check bookmark status' 
        });
    }
};

// Get bookmark count for a user
export const getBookmarkCount = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const count = await Bookmark.countDocuments({ user_id: userId });

        res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        console.error('Error getting bookmark count:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get bookmark count' 
        });
    }
};

// Clear all bookmarks for a user
export const clearAllBookmarks = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const result = await Bookmark.deleteMany({ user_id: userId });

        res.status(200).json({
            success: true,
            message: `Cleared ${result.deletedCount} bookmarks`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error clearing bookmarks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear bookmarks' 
        });
    }
};
