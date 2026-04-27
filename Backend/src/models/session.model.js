import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "user is required"]
    },
    refreshTokenHash: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ["user", "foodPartner"],
        required: true
    },
    userAgent: {
        type: String,
        required: [true, "userAgent is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date,
        expires: 1 * 24 * 60 * 60
    }
});

const sessionModel = mongoose.model('session', sessionSchema);
export default sessionModel;