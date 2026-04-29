import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import otpModel from '../models/otp.model.js'
import sessionModel from '../models/session.model.js'
import foodPartnerModel from "../models/foodpartner.model.js";
import { refreshTokenFunction, accessTokenFunction, hash } from '../utils/genrate.token.js'
import config from "../config/config.js";
import { sendEmail } from "../services/email.service.js";
import { generateOtp, getOtpHtml } from '../utils/genrate.otp.js'
 
const refreshCookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
    httpOnly: false,
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
            password: hashedPassword
        })

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = hash(otp);

        await otpModel.create({
            entityId: user._id,
            entityType: "user",
            otpHash
        })

        await sendEmail(
            user.email,
            "OTP Verification",
            `Your OTP is ${otp}`,
            html
        );

        return res.status(201).json({
            message: "OTP sent to email",
            otpSent: true,
            email: user.email,
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
                isVerified: user.isVerified,
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
            return res.status(404).json({
                message: "session not found"
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
            restaurantName
        });

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = hash(otp);

        await otpModel.create({
            entityId: foodPartner._id,
            entityType: "foodPartner",
            otpHash
        })

        await sendEmail(
            foodPartner.email,
            "OTP Verification",
            `Your OTP is ${otp}`,
            html
        );

        return res.status(201).json({
            message: "OTP sent to email",
            otpSent: true,
            email: foodPartner.email
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
                isVerified: foodPartner.isVerified,
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

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        if (!["user", "foodPartner"].includes(type)) {
            return res.status(400).json({
                message: "Invalid type"
            });
        }

        const Model = type === "user" ? userModel : foodPartnerModel;

        const account = await Model.findOne({ email });

        if (!account) {
            return res.status(404).json({
                message: `${type} not found`
            });
        }
        const otpDoc = await otpModel.findOne({
            entityId: account._id,
            entityType: type,
        });

        if (!otpDoc) {
            return res.status(400).json({
                message: "OTP expired or not found"
            });
        }
        const hashedOtp = hash(otp);

        if (hashedOtp !== otpDoc.otpHash) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        account.isVerified = true;
        await account.save();
        await otpDoc.deleteOne();

        const refreshToken = refreshTokenFunction(account, type);
        const refreshTokenHash = hash(refreshToken);

        const session = await sessionModel.create({
            user: account._id,
            refreshTokenHash,
            userType: type,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = accessTokenFunction(account, session);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        const name = account.name;

        return res.status(201).json({
            message: "user verified successfully",
            user: {
                id: account._id,
                name,
                email: account.email,
                userType: type,
                isVerified: account.isVerified
            },
            accessToken
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email, type } = req.body;
        if (!["user", "foodPartner"].includes(type)) {
            return res.status(400).json({
                message: "Invalid type"
            });
        }

        const Model = type === "user" ? userModel : foodPartnerModel;

        const account = await Model.findOne({ email });

        if (!account) {
            return res.status(404).json({
                message: `${type} not found`
            });
        }

        const existingOtp = await otpModel.findOne({
            entityId: account._id,
            entityType: type,
        });

        if (existingOtp && (Date.now() - existingOtp.createdAt.getTime()) < 2 * 60 * 1000) {
            return res.status(429).json({
                message: "Please wait 2 minutes before resending OTP"
            });
        }

        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = hash(otp);

        if (existingOtp) {
            existingOtp.otpHash = otpHash;
            existingOtp.createdAt = new Date();
            await existingOtp.save();
        } else {
            await otpModel.create({
                entityId: account._id,
                entityType: type,
                otpHash
            });
        }

        await sendEmail(
            account.email,
            "OTP Verification",
            `Your OTP is ${otp}`,
            html
        );

        return res.status(200).json({
            message: "OTP resent to email",
            otpSent: true
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}