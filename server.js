import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { signup, login, getUserName } from './Controllers/authController.js';
import { createTopic } from "./Controllers/topicController.js";
import { getBlogs, getBlogById, getUserBlogsById, createBlog, updateBlog, deleteBlog, upvoteBlog, downvoteBlog } from './Controllers/blogController.js';
import { getProfile } from './Controllers/profileController.js';
import { getUserBookmarks, addBookmark, removeBookmark, checkBookmarkStatus, getBookmarkCount, clearAllBookmarks } from './Controllers/bookmarkController.js';


const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());


dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...', err));



// Auth Routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/username/:userId', getUserName);


// Blog Routes
app.get('/blog', getBlogs);
app.get('/blog/:id', getBlogById);
app.post('/blog', createBlog);
app.put('/blog/:id', updateBlog);
app.delete('/blog/:id', deleteBlog);
app.post('/blog/:id/upvote', upvoteBlog);
app.post('/blog/:id/downvote', downvoteBlog);
app.get('/blog/userblogs/:userId', getUserBlogsById);

// Topic Routes
app.post('/createtopic', createTopic);


// Profile Routes
app.get('/profile/:userId', getProfile);

// Bookmark Routes
app.get('/bookmarks/:userId', getUserBookmarks);
app.post('/bookmarks/:userId', addBookmark);
app.delete('/bookmarks/:userId', removeBookmark);
app.get('/bookmarks/:userId/status/:blogId', checkBookmarkStatus);
app.get('/bookmarks/:userId/count', getBookmarkCount);
app.delete('/bookmarks/:userId/clear', clearAllBookmarks);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});