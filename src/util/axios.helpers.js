import axios from "axios";
import { Mutex } from "async-mutex";

// Local import
import { API_URL } from "/src/config";
import { getUser, setUser, clearUser } from "/src/domain/userRepository";
//------------------------------------------

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
                                refreshToken: getUser().refreshToken,
                            }
                        );
                        setUser(response.data);
                    } catch (e) {
                        clearUser();
                        window.location.href = "/account/login";
                    }
                }

                if (config?.headers) {
                    config.headers["authorization"] = `Bearer ${
                        getUser()?.accessToken
                    }`;
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
