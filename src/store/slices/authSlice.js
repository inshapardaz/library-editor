import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

// local Imports
import { axiosPublic, axiosPrivate } from '@/utils/axios.helpers';
// ----------------------------------------------------------

const initialState = {
    user: null,
    status: "idle", // idle || loading || succeeded || failed
    error: null,
    forgetPasswordStatus: "idle", // idle || loading || succeeded || failed
    forgetPasswordError: null,
    resetPasswordStatus: "idle", // idle || loading || succeeded || failed
    resetPasswordError: null,
    loadUserStatus: "idle",
    loadUserError: null,
    tokenStatus: "idle",
    tokenError: null,
};

export const logout = createAsyncThunk(
    "auth/logout",
    async (user) => {
        try {
            const response = await axiosPublic.post("/accounts/revoke-token", {
                token: user?.accessToken
            });
            return response.data;
        } catch (e) {
            console.error(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const loadUser = createAsyncThunk(
    "auth/user",
    async () => {
        try {
            const response = await axiosPrivate.get("/accounts/user");
            return response.data;
        } catch (e) {
            return Promise.reject(e);
        }
    }
);


export const init = createAsyncThunk("auth/init", async (_, { dispatch }) => {
    if (Cookies.get('refreshToken')) {
        dispatch(loadUser())
    }
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers(builder) {
        builder
            .addCase(logout.pending, (state) => {
                state.logoutStatus = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.logoutStatus = "succeeded";
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.logoutStatus = "failed";
                state.logoutUser = action.error.message;
            })
            .addCase(loadUser.pending, (state) => {
                state.loadUserStatus = "loading";
                state.loadUserError = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loadUserStatus = "succeeded";
                state.loadUserError = null;
                if (action.payload) {
                    state.user = action.payload;
                }
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loadUserStatus = "failed";
                state.loadUserError = action.error.message;
            });
    },
});

export const isLoggedIn = (state) => state?.auth?.user != null;
export const getLogoutStatus = (state) => state.auth.logoutStatus;
export const getLogoutError = (state) => state.auth.logoutError;
export const getUserStatus = (state) => state?.auth?.loadUserStatus;
export const getUserError = (state) => state?.auth?.loadUserError;
