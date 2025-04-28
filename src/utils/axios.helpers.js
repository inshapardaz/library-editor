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


let refreshTokenPromise = null; // Shared promise for refresh token requests

axiosPrivate.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            await mutex.waitForUnlock(); // Ensure no other request is modifying the token

            if (!refreshTokenPromise) {
                // If no refresh token request is in progress, create one
                const release = await mutex.acquire();

                refreshTokenPromise = axiosPublic.post("/accounts/refresh-token", {})
                    .then(() => {
                        refreshTokenPromise = null; // Reset the promise after success
                    })
                    .catch(refreshError => {
                        console.error(refreshError);
                        refreshTokenPromise = null; // Reset the promise after failure
                        window.location.href = `${MAIN_SITE}/account/login?returnUrl=${window.location.href}`;
                        return Promise.reject(refreshError);
                    })
                    .finally(() => {
                        release();
                    });
            }

            try {
                await refreshTokenPromise; // Wait for the refresh token request to complete
                originalRequest._retry = true;
                return axiosPrivate(originalRequest); // Retry the original request
            } catch (refreshError) {
                return Promise.reject(refreshError); // Propagate the error if refresh fails
            }
        }

        return Promise.reject(error);
    }
);
