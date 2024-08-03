import Blog from "../Models/blogModel.js";


export const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const blogs = await Blog.find({ author: userId }).populate('author', 'first_name last_name');

        const profile = {
            total_blogs: [],
            total_views: 0,
            total_upvotes: 0,
            total_downvotes: 0
        };

        blogs.forEach(blog => {
            profile.total_blogs.push(blog);
            profile.total_views += blog.views;
            profile.total_upvotes += blog.upvotes;
            profile.total_downvotes += blog.downvotes;
        });

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};