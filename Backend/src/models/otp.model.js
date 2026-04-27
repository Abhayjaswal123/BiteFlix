import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "entityType"
    },
    entityType: {
        type: String,
        required: true,
        enum: ["user", "foodPartner"]
    },
    otpHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const otpModel = mongoose.model('otp', otpSchema);
export default otpModel;