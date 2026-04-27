import foodPartnerModel from "../models/foodpartner.model.js";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";
import foodModel from "../models/food.model.js";

export const authMiddleware = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if(!authHeader || !authHeader.startsWith(`Bearer `)){
            return res.status(401).json({
                message: "Unauthorized"
        })
        }

        let token = authHeader.split(" ")[1];
        let decoded = jwt.verify(token,config.ACCESS_JWT_SECRET);

        const session = await sessionModel.findById(decoded.sessionId);
        if(!session || session.revoked){
        return res.status(401).json({ message: 'Session is invalid or revoked' })
        }

        const modelMap = {
            user: userModel,
            foodPartner: foodPartnerModel
        };

        const Model = modelMap[session.userType];
        if (!Model) {
            return res.status(401).json({
                message: "Invalid user type"
            });
        }

        const user = await Model.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        
        if (decoded.userType === "user") {
            req.user = user;
        } else {
            req.foodPartner = user;
        }

        req.session = session;
        next();

    } catch(err){
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }

}

export const allowRoles = (...roles) => {
    return(req,res,next) => {
        if(roles.includes("user") && req.user){
            return next();
        }

        if(roles.includes("foodPartner") && req.foodPartner){
            return next();
        }

        return res.status(403).json({
            message: "Access denied"
        });
    };
};

export const isFoodPartner = async (req,res,next) => {
    try{
        const { id } = req.params;
        
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                message: "Food not found"
            });
        }

        if(food.foodPartner.toString() !== req.foodPartner._id.toString()){
            return res.status(403).json({
                message: "You are not allowed to modify this food"
            });
        }        
        req.food = food;
        
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}