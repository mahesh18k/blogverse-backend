import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
}, { collection: 'contents' });

const Content = mongoose.model('Content', contentSchema);

export default Content;