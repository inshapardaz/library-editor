import axios from "axios";
import { Mutex } from "async-mutex";

// Local import
import { API_URL } from "/src/config";
import { getUser, setUser, clearUser } from "/src/domain/userRepository";
//------------------------------------------

axios.defaults.withCredentials = true

export const axiosPublic = axios.create({
    baseURL: API_URL,
});
export const axiosPrivate = axios.create({
    baseURL: API_URL,
});

const mutex = new Mutex();

axiosPrivate.interceptors.request.use(
    async (config) => {
        await mutex.waitForUnlock();
        const release = await mutex.acquire();

        try {
            const user = getUser();
            let currentDate = new Date();
            if (user?.accessToken) {
                if (new Date(user.accessTokenExpiry) < currentDate.getTime()) {
                    try {
                        const response = await axiosPublic.post(
                            "/accounts/refresh-token",
                            {
                                refreshToken: user.refreshToken,
                            }
                        );
                        setUser(response.data);
                    } catch (e) {
                        clearUser();
                        window.location.href = "/account/login";
                    }
                }
            }
        } finally {
            release();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosPrivate.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axiosPublic.post(
                    "/accounts/refresh-token",
                    {
                        refreshToken: getUser().refreshToken,
                    }
                );
                setUser(response.data);
                return axiosPrivate(originalRequest); // Retry the original request with the new access token.
            } catch (refreshError) {
                clearUser();
                window.location.href = "/account/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
