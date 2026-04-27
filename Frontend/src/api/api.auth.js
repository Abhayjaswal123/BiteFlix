import api from "./api.axios";

export const registerUser = async(data) => {
    const res = await api.post("/auth/user/register", data);
    return res.data;
}

export const loginUser = async(data) => {
    const res = await api.post("/auth/user/login", data);
    return res.data;
}

export const logoutUser = async() => {
    const res =await api.post("/auth/user/logout");
    return res.data;
}

export const registerFoodPartner = async(data) => {
    const res = await api.post("/auth/food-partner/register", data);
    return res.data;
}

export const loginFoodPartner = async(data) => {
    const res = await api.post("/auth/food-partner/login", data);
    return res.data;
}

export const logoutFoodPartner = async() => {
    const res = await api.post("/auth/food-partner/logout");
    return res.data;
}

export const verifyOtp = async (data) => {
    const res = await api.post("/auth/verify-email", data);
    return res.data;
}

export const resendOtp = async (data) => {
    const res = await api.post("/auth/resend-otp", data);
    return res.data;
}