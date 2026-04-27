import api from './api.axios';

export const addToCart = async (foodId) => {
    const res = await api.post("/cart", { foodId });
    return res.data;
}

export const getCartItems = async () => {
    const res = await api.get("/cart");
    return res.data;
}

export const removeFromCart = async (foodId) => {
    const res = await api.delete(`/cart/${foodId}`);
    return res.data;
}

export const updateQuantity =async (data) => {
    const res = await api.patch("/cart",data);
    return res.data;
}