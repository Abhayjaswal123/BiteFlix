import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import sessionModel from '../models/session.model.js'
import foodPartnerModel from "../models/foodpartner.model.js";
import { refreshTokenFunction, accessTokenFunction, hash } from '../utils/genrate.token.js'
import config from "../config/config.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
};

export const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const isUserExisted = await userModel.findOne({ email: normalizedEmail });

        if (isUserExisted) {
            return res.status(400).json({
                message: "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: true
        })

        const refreshToken = refreshTokenFunction(user, "user");
        const refreshTokenHash = hash(refreshToken);

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            userType: "user",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = accessTokenFunction(user, session);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: true,
                userType: "user"
            },
            accessToken
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const refreshToken = refreshTokenFunction(user, "user");
        const refreshTokenHash = hash(refreshToken);

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            userType: "user",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = accessTokenFunction(user, session);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        return res.status(200).json({
            message: "user logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: true,
                userType: "user"
            },
            accessToken
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logoutUser = async (req, res) => {

    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const refreshTokenHash = hash(token);
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        })
        if (!session) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        session.revoked = true;
        session.revokedAt = new Date();
        await session.save();

        res.clearCookie('refreshToken', clearCookieOptions)
        return res.status(200).json({
            message: "logout successfully"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const registerFoodPartner = async (req, res) => {

    try {
        const { name, email, password, phoneNumber, restaurantName } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const isAccountAlreadyExixts = await foodPartnerModel.findOne({
            email: normalizedEmail
        })

        if (isAccountAlreadyExixts) {
            return res.status(409).json({
                message: "Food partner account already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const foodPartner = await foodPartnerModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phoneNumber,
            restaurantName,
            isVerified: true
        });

        const refreshToken = refreshTokenFunction(foodPartner, "foodPartner");
        const refreshTokenHash = hash(refreshToken);

        const session = await sessionModel.create({
            user: foodPartner._id,
            refreshTokenHash,
            userType: "foodPartner",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = accessTokenFunction(foodPartner, session);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        return res.status(201).json({
            message: "Food partner registered successfully",
            user: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                isVerified: true,
                restaurantName: foodPartner.restaurantName,
                phoneNumber: foodPartner.phoneNumber,
                userType: "foodPartner"
            },
            accessToken
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const loginFoodPartner = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const foodPartner = await foodPartnerModel.findOne({ email: normalizedEmail });
        if (!foodPartner) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, foodPartner.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const refreshToken = refreshTokenFunction(foodPartner, "foodPartner");
        const refreshTokenHash = hash(refreshToken);

        const session = await sessionModel.create({
            user: foodPartner._id,
            refreshTokenHash,
            userType: "foodPartner",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = accessTokenFunction(foodPartner, session);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        return res.status(200).json({
            message: "foodPartner logged in successfully",
            user: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                isVerified: true,
                restaurantName: foodPartner.restaurantName,
                phoneNumber: foodPartner.phoneNumber,
                userType: "foodPartner"
            },
            accessToken
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logoutFoodPartner = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const refreshTokenHash = hash(token);
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        })
        if (!session) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        session.revoked = true;
        session.revokedAt = new Date();
        await session.save();

        res.clearCookie('refreshToken', clearCookieOptions)
        return res.status(200).json({
            message: "foodPartner logout successfully"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const refreshTokenHash = hash(token);
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid session"
            });
        }

        const modelMap = {
            user: userModel,
            foodPartner: foodPartnerModel
        };

        const Model = modelMap[session.userType];

        if (!Model) {
            return res.status(400).json({
                message: "Invalid user type"
            });
        }

        const user = await Model.findById(session.user);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const newRefreshToken = refreshTokenFunction(user, session.userType);
        const newRefreshTokenHash = hash(newRefreshToken);

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

        const accessToken = accessTokenFunction(user, session);

        return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken
        });


    } catch {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}