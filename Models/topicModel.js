// models/topicModel.js
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true,
    },
    image_url: {
        type: String,
        required: true,
    }
}, { collection: 'topics' });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;