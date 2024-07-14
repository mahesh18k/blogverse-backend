import Blog from "../Models/blogModel.js";
import Content from "../Models/contentModel.js";


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
        blog.view_count += 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching blog');
    }
};



// Controller to create a new blog
export const createBlog = async (req, res) => {
    const { thumbnail, title, topic_tags, author, content, images } = req.body;

    try {
        const newContent = new Content({ content });
        const savedContent = await newContent.save();

        const newBlog = new Blog({
            thumbnail,
            title,
            topic_tags,
            author,
            content_id: savedContent._id,
            images
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({ message: 'Blog created successfully', blogId: savedBlog._id });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating blog');
    }
};



// Controller to update a blog
export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { thumbnail, title, topic_tags, content, images } = req.body;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        if (content) {
            const existingContent = await Content.findById(blog.content_id);
            existingContent.content = content;
            await existingContent.save();
        }

        blog.thumbnail = thumbnail || blog.thumbnail;
        blog.title = title || blog.title;
        blog.topic_tags = topic_tags || blog.topic_tags;
        blog.images = images || blog.images;

        const updatedBlog = await blog.save();
        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating blog');
    }
};



// Controller to delete a blog
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        await Content.findByIdAndDelete(blog.content_id);
        await blog.delete();

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error deleting blog');
    }
};


// Controller to upvote a blog
export const upvoteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        blog.upvotes += 1;
        await blog.save();

        res.status(200).json({ message: 'Blog upvoted successfully', upvotes: blog.upvotes });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error upvoting blog');
    }
};


// Controller to downvote a blog
export const downvoteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        blog.downvotes += 1;
        await blog.save();

        res.status(200).json({ message: 'Blog downvoted successfully', downvotes: blog.downvotes });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error downvoting blog');
    }
};