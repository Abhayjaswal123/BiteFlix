import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phoneNumber:{
        type: String,
        required: true,
        minLength: 10,
        maxLength: 10
    },
    restaurantName: {
        type: String,
        required: true
    }
})

const foodPartnerModel = mongoose.model('foodpartner', foodPartnerSchema);
export default foodPartnerModel;