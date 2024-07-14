import Topic from '../Models/topicModel.js';

export const createTopic = async (req, res) => {
    const { tag, image_url } = req.body;

    try {
        const newTopic = new Topic({
            tag,
            image_url
        });

        const savedTopic = await newTopic.save();
        res.status(201).json(savedTopic);
    } catch (err) {
        res.status(500).json({ error: 'Error creating topic' });
    }
};