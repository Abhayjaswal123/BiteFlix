import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const userModel = mongoose.model('user', userSchema);
export default userModel;