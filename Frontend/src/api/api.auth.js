import api from "./api.axios";

export const registerUser = async(data) => {
    const res = await api.post("/api/auth/user/register", data);
    return res.data;
}

export const loginUser = async(data) => {
    const res = await api.post("/api/auth/user/login", data);
    return res.data;
}

export const logoutUser = async() => {
    const res =await api.post("/api/auth/user/logout");
    return res.data;
}

export const registerFoodPartner = async(data) => {
    const res = await api.post("/api/auth/food-partner/register", data);
    return res.data;
}

export const loginFoodPartner = async(data) => {
    const res = await api.post("/api/auth/food-partner/login", data);
    return res.data;
}

export const logoutFoodPartner = async() => {
    const res = await api.post("/api/auth/food-partner/logout");
    return res.data;
}

export const verifyOtp = async (data) => {
    const res = await api.post("/api/auth/verify-email", data);
    return res.data;
}

export const resendOtp = async (data) => {
    const res = await api.post("/api/auth/resend-otp", data);
    return res.data;
}