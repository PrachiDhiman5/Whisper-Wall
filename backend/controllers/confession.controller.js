import Confession from "../models/confession.model.js";

// Create a new confession
export const createConfession = async (req, res, next) => {
    try {
        const { text, secretCode, category, isDraft } = req.body;

        if (!text || !secretCode) {
            return res.status(400).json({ success: false, message: "Text and Secret Code are required" });
        }

        const confession = await Confession.create({
            text,
            secretCode,
            category: category || "other",
            isDraft: isDraft || false,
            userId: req.user._id,
            reactions: { like: 0, love: 0, laugh: 0 }
        });

        res.status(201).json({ success: true, message: "Whisper shared", confession });
    } catch (error) {
        console.error("Error creating confession:", error);
        next(error);
    }
};

// Get all public confessions
export const getAllConfessions = async (req, res, next) => {
    try {
        const confessions = await Confession.find({ isDraft: false })
            .populate('userId', 'anonymousId')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, confessions });
    } catch (error) {
        next(error);
    }
};

// Get my confessions (including drafts)
export const getMyConfessions = async (req, res, next) => {
    try {
        const confessions = await Confession.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, confessions });
    } catch (error) {
        next(error);
    }
};

// Add reaction to a confession
export const addReaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reactionType } = req.body;

        if (!['like', 'love', 'laugh'].includes(reactionType)) {
            return res.status(400).json({ success: false, message: "Invalid reaction type" });
        }

        const updateField = `reactions.${reactionType}`;
        const confession = await Confession.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: 1 } },
            { new: true }
        );

        if (!confession) {
            return res.status(404).json({ success: false, message: "Confession not found" });
        }

        res.status(200).json({ success: true, reactions: confession.reactions });
    } catch (error) {
        next(error);
    }
};

// Delete a confession (requires secret code and ownership)
export const deleteConfession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { secretCode } = req.body;

        const confession = await Confession.findById(id);

        if (!confession) {
            return res.status(404).json({ success: false, message: "Confession not found" });
        }

        // Verify ownership (Security boost)
        if (confession.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this whisper" });
        }

        console.log(`[Delete] Comparing: DB(${confession.secretCode}) vs Received(${secretCode})`);

        if (confession.secretCode.trim() !== secretCode.trim()) {
            return res.status(403).json({ success: false, message: "Incorrect secret code" });
        }

        await Confession.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Whisper deleted" });
    } catch (error) {
        next(error);
    }
};

// Get user stats
export const getUserStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const posts = await Confession.find({ userId });

        const stats = {
            totalPosts: posts.length,
            drafts: posts.filter(p => p.isDraft).length,
            totalLove: posts.reduce((acc, p) => acc + p.reactions.love, 0),
            totalLaugh: posts.reduce((acc, p) => acc + (p.reactions.laugh || 0), 0),
            totalLikes: posts.reduce((acc, p) => acc + p.reactions.like, 0),
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        next(error);
    }
};

// Update a confession (requires secret code and ownership)
export const updateConfession = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { text, category, secretCode, isDraft } = req.body;

        const confession = await Confession.findById(id);

        if (!confession) {
            return res.status(404).json({ success: false, message: "Confession not found" });
        }

        // Verify ownership
        if (confession.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this whisper" });
        }

        // Verify secret code
        console.log(`[Update] Comparing: DB(${confession.secretCode}) vs Received(${secretCode})`);

        if (confession.secretCode.trim() !== secretCode?.trim()) {
            return res.status(403).json({ success: false, message: "Incorrect secret code" });
        }

        // Update fields
        if (text) confession.text = text;
        if (category) confession.category = category;
        if (typeof isDraft !== 'undefined') confession.isDraft = isDraft;

        await confession.save();

        res.status(200).json({ success: true, message: "Whisper updated", confession });
    } catch (error) {
        console.error("Error updating confession:", error);
        next(error);
    }
};
