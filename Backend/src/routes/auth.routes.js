import express from 'express';
import { loginUser, registerUser, verifyEmail, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner, refreshToken, resendOtp } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

//user auth APIs
authRouter.post('/user/register', registerUser);
authRouter.post('/user/login', loginUser);
authRouter.post('/user/logout', logoutUser);

//foodPartner auth APIs
authRouter.post('/food-partner/register', registerFoodPartner);
authRouter.post('/food-partner/login', loginFoodPartner);
authRouter.post('/food-partner/logout', logoutFoodPartner);

//refresh token API
authRouter.post('/refresh-token', refreshToken);
authRouter.get('/me', authMiddleware, (req, res) => {
    const account = req.user || req.foodPartner;
    if (!account) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const { password, ...userData } = account.toObject();
    const userType = req.user ? "user" : "foodPartner";
    res.status(200).json({ user: { ...userData, userType } });
})
//verify email
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/resend-otp", resendOtp);

export default authRouter;