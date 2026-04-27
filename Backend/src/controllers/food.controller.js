import foodModel from '../models/food.model.js'
import { uploadFile } from '../services/storage.service.js';
import { v4 as uuid } from 'uuid'

export const createFood = async (req, res) => {
    try {

        console.log("FILES:", req.files);
        console.log("BODY:", req.body);
        const videoFile = req.files?.video?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile || !thumbnailFile) {
            return res.status(400).json({
                message: "Video and thumbnail are required"
            });
        }
        const { name, description, price, category } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                message: "Name and price are required"
            });
        }
        const videoExt = videoFile.originalname.split('.').pop();
        const thumbExt = thumbnailFile.originalname.split('.').pop();

        const videoFileName = `${uuid()}.${videoExt}`;
        const thumbFileName = `${uuid()}.${thumbExt}`;

        const videoUpload = await uploadFile(videoFile.buffer, videoFileName);

        const thumbUpload = await uploadFile(thumbnailFile.buffer, thumbFileName);

        const foodItem = await foodModel.create({
            name,
            description,
            price,
            category,
            video: videoUpload.url,
            thumbnail: thumbUpload.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "food created successfully",
            foodItem
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export const getFoodItems = async (req, res) => {
    try {
        const { search = "", category = "" } = req.query;

        let query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        const foodItems = await foodModel.find(query)
            .sort({ createdAt: -1 })
            .populate("foodPartner", "restaurantName name")

        res.status(200).json({
            message: "Food items fetched successfully",
            count: foodItems.length,
            foodItems
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export const updateFood = async (req, res) => {
    try {
        const food = req.food;
        const { name, description, price, category } = req.body;

        if (name) food.name = name;
        if (description) food.description = description;
        if (price) food.price = price;
        if (category) food.category = category;

        await food.save();

        return res.status(200).json({
            message: "Food updated successfully",
            food
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const deleteFood = async (req, res) => {
    try {
        const food = req.food;
        await foodModel.findByIdAndDelete(food._id);

        return res.status(200).json({
            message: "Food deleted successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const getSingleFood = async (req, res) => {
    try {
        const { id } = req.params;

        const food = await foodModel
            .findById(id)

        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        res.status(200).json({
            message: "Food fetched successfully",
            food
        });

    } catch (err) {
        return res.status(500).json({
            message: "Invalid ID or Server Error"
        });
    }
};