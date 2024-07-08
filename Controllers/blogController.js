import Blog from "../Models/blogModel.js";
// import Content from "../Models/contentModel.js";


// Controller to get all blogs
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'first_name last_name').populate('content_id');
        res.status(200).json(blogs);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching blogs');
    }
};

// Controller to get a blog by ID
export const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id).populate('author', 'first_name last_name').populate('content_id');
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.status(200).json(blog);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching blog');
    }
};