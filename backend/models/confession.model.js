import mongoose from 'mongoose';

const confessionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        secretCode: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['funny', 'happy', 'crush', 'angry', 'sad', 'secret', 'other'],
            default: 'other',
            lowercase: true,
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        reactions: {
            like: { type: Number, default: 0 },
            love: { type: Number, default: 0 },
            laugh: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

const Confession = mongoose.model("Confession", confessionSchema);

export default Confession;