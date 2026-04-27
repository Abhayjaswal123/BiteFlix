import api from "./api.axios";

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
}

export const clearAccessToken = () => {
    accessToken = null;
}

api.interceptors.request.use(
    (req) => {
        if (accessToken) {
            req.headers.Authorization = `Bearer ${accessToken}`
        }
        return req;
    },
    (err) => Promise.reject(err)
)

api.interceptors.response.use(
    (res) => res,
    async (error) => {

        const originalRequest = error.config;

        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (
            originalRequest.url?.includes('/auth/refresh-token') ||
            originalRequest.url?.includes('/auth/logout')
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const res = await api.post("/auth/refresh-token");
            const newAccessToken = res.data.accessToken
            setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest);
        } catch (err) {
            clearAccessToken();
            return Promise.reject(err);
        }
    }
)