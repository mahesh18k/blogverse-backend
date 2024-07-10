import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { signup, login } from './Controllers/authController.js';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, upvoteBlog, downvoteBlog } from './Controllers/blogController.js';


const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());


dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...', err));



// Define user routes
app.post('/signup', signup);
app.post('/login', login);


// Define blog routes
app.get('/blog', getBlogs);
app.get('/blog/:id', getBlogById);
app.post('/blog', createBlog);
app.put('/blog/:id', updateBlog);
app.delete('/blog/:id', deleteBlog);
app.post('/blog/:id/upvote', upvoteBlog);
app.post('/blog/:id/downvote', downvoteBlog);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});