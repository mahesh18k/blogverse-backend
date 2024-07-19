import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    total_blogs: {
        type: Number,
        default: 0
    },
    total_views: {
        type: Number,
        default: 0
    },
    total_upvotes: {
        type: Number,
        default: 0
    },
    total_downvotes: {
        type: Number,
        default: 0
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}, { collection: 'profile' });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;