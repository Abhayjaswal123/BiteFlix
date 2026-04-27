import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["veg", "non-veg", "fast-food", "dessert"],
        default: "fast-food"
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const foodModel = mongoose.model('food', foodSchema);
export default foodModel;