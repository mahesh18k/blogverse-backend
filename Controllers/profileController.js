import Profile from "../Models/profileModel.js";
import Blog from "../Models/blogModel.js";

// Create a new profile for a user
export const createProfile = async (req, res) => {
    try {
        const { user_id } = req.body;
        const newProfile = new Profile({ user_id });
        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get profile by user ID
export const getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user_id: req.params.userId }).populate('blogs');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update profile stats (views, upvotes, downvotes)
export const updateProfileStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const { views, upvotes, downvotes, blogId } = req.body;

        const profile = await Profile.findOne({ user_id: userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (views !== undefined) profile.total_views += views;
        if (upvotes !== undefined) profile.total_upvotes += upvotes;
        if (downvotes !== undefined) profile.total_downvotes += downvotes;
        if (blogId) profile.blogs.push(blogId);

        await profile.save();
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a profile
export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOneAndDelete({ user_id: userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};