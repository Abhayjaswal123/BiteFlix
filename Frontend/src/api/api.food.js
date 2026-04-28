import api from "./api.axios";

export const allFoods = async (search = "", category = "") => {
    const query = [];

    if (search) query.push(`search=${encodeURIComponent(search)}`);
    if (category) query.push(`category=${encodeURIComponent(category)}`);

    const queryString = query.length ? `?${query.join("&")}` : "";
    const res = await api.get(`/api/food${queryString}`);
    return res.data;
}

export const getSingleFood = async(id) => {
    const res = await api.get(`/api/food/${id}`);
    return res.data;
}
export const createFood = (data) =>
    api.post("/api/food/create", data, {
            headers: {
        "Content-Type": "multipart/form-data"
    }
    });

export const updateFood = async(id, data) => {
    const res = await api.put(`/api/food/${id}`, data);
    return res.data;
}

export const deleteFood = async(id) => {
    const res = await api.delete(`/api/food/${id}`);
    return res.data;
}