import axios from "axios";
import { Mutex } from 'async-mutex';

import { store } from "../store";
import { refreshToken } from '../features/auth/authSlice'

export const axiosPublic = axios.create({ baseURL: process.env.REACT_APP_API_URL });
export const axiosPrivate = axios.create({ baseURL: process.env.REACT_APP_API_URL });

const mutex = new Mutex();

axiosPrivate.interceptors.request.use(
  async (config) => {
    await mutex.waitForUnlock()
    const release = await mutex.acquire()

      try {
        const user = store?.getState()?.auth?.user;
        let currentDate = new Date();
        if (user?.accessToken) {
          if (new Date(user.accessTokenExpiry) < currentDate.getTime()) {
            await store.dispatch(refreshToken());
          }

          if (config?.headers) {
            config.headers["authorization"] = `Bearer ${store?.getState()?.auth?.user?.accessToken
              }`;
          }
        }
      }
      finally {
        release()
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: process.env.REACT_APP_API_URL }) =>
    async ({ url, method, data, params }) => {
      try {
        const result = await axiosPrivate({ url: baseUrl + url, method, data, params })
        return result
      } catch (axiosError) {
        let err = axiosError
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        }
      }
    }
