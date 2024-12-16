import axios from "axios";
import { Mutex } from "async-mutex";

// Local import
import { API_URL, MAIN_SITE } from '@/config';

//------------------------------------------

export const axiosPublic = axios.create({
    baseURL: API_URL,
    withCredentials: true
});
export const axiosPrivate = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

const mutex = new Mutex();

axiosPrivate.interceptors.request.use(
    async (config) => {
        await mutex.waitForUnlock();
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
            await mutex.waitForUnlock();
            const release = await mutex.acquire();
            try {
                originalRequest._retry = true;
                await axiosPublic.post(
                    "/accounts/refresh-token",
                    {}
                );
            } catch (refreshError) {
                console.error(refreshError)
                window.location.href = `${MAIN_SITE}/account/login?returnUrl=${window.location.href}`;
                return Promise.reject(refreshError);
            } finally {
                release();
            }

            return axiosPrivate(originalRequest); // Retry the original request with the new access token.
        }
        return Promise.reject(error);
    }
);
