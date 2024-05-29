import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// local Imports
import { API_URL } from "env";
import { getUser, setUser, clearUser } from "/src/domain/userRepository";
// ----------------------------------------------------------
const axiosPublic = axios.create({
    baseURL: API_URL,
});

const initialState = {
    user: getUser(),
    status: "idle", // idle || loading || succeeded || failed
    error: null,
    forgetPasswordStatus: "idle", // idle || loading || succeeded || failed
    forgetPasswordError: null,
    resetPasswordStatus: "idle", // idle || loading || succeeded || failed
    resetPasswordError: null,
    changePasswordStatus: "idle", // idle || loading || succeeded || failed
    changePasswordError: null,
    tokenStatus: "idle",
    tokenError: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }) => {
        try {
            const response = await axiosPublic.post("/accounts/authenticate", {
                email,
                password,
            });
            return response.data;
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const forgetPassword = createAsyncThunk(
    "auth/forget-password",
    async ({ email }) => {
        try {
            const response = await axiosPublic.post(
                "/accounts/forgot-password",
                {
                    email,
                }
            );
            return response.data;
        } catch (e) {
            console.error(e);
            return Promise.reject(e.message);
        }
    }
);

export const registerPassword = createAsyncThunk(
    "auth/register",
    async ({ code, name, password, acceptTerms }) => {
        try {
            const response = await axiosPublic.post(
                `/accounts/register/${code}`,
                {
                    name,
                    password,
                    acceptTerms,
                }
            );
            return response.data;
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const verifyCode = createAsyncThunk(
    "auth/verify-code",
    async ({ code }) => {
        try {
            const response = await axiosPublic.get(
                `/accounts/invitation/${code}`
            );
            return response.data;
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/reset-password",
    async ({ code, password, confirmPassword }) => {
        try {
            const response = await axiosPublic.post(
                "/accounts/reset-password",
                {
                    token: code,
                    password,
                    confirmPassword,
                }
            );
            return response.data;
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e.message);
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/change-password",
    async ({ oldPassword, password }) => {
        try {
            // TODO : Fix the private axios access circular dependency issue
            const response = await axiosPublic.post(
                "/accounts/change-password",
                {
                    password,
                    oldPassword,
                }
            );
            return response.data;
        } catch (e) {
            console.log(e.message);
            return Promise.reject(e.message);
        }
    }
);

// eslint-disable-next-line no-unused-vars
export const init = createAsyncThunk("auth/init", async (_, { getState }) => {
    const user = getUser();

    let currentDate = new Date();
    if (user?.refreshToken) {
        if (
            user?.accessToken &&
            new Date(user.accessTokenExpiry) < currentDate.getTime()
        ) {
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
    return user;
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            clearUser();
        },
        reset: (state) => {
            state.error = null;
            state.status = "idle";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                // TODO: Perform transformation like link replacement
                if (action.payload) {
                    state.user = action.payload;
                    setUser(action.payload);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(init.pending, (state) => {
                state.tokenStatus = "loading";
            })
            .addCase(init.fulfilled, (state, action) => {
                state.tokenStatus = "succeeded";
                if (action.payload) {
                    state.user = action.payload;
                    setUser(action.payload);
                }
            })
            .addCase(init.rejected, (state, action) => {
                state.tokenStatus = "failed";
                state.tokenError = action.error.message;
            })
            .addCase(forgetPassword.pending, (state) => {
                state.forgetPasswordStatus = "loading";
            })
            .addCase(forgetPassword.fulfilled, (state) => {
                state.forgetPasswordStatus = "succeeded";
            })
            .addCase(forgetPassword.rejected, (state, action) => {
                state.forgetPasswordStatus = "failed";
                state.forgetPasswordError = action.error.message;
            })
            .addCase(registerPassword.pending, (state) => {
                state.tokenStatus = "loading";
            })
            .addCase(registerPassword.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(registerPassword.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(verifyCode.pending, (state) => {
                state.tokenStatus = "loading";
            })
            .addCase(verifyCode.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(changePassword.pending, (state) => {
                state.changPasswordStatus = "loading";
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changPasswordStatus = "succeeded";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changPasswordStatus = "failed";
                state.changPasswordError = action.error.message;
            })
            .addCase(resetPassword.pending, (state) => {
                state.resetPasswordStatus = "loading";
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPasswordStatus = "succeeded";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPasswordStatus = "failed";
                state.resetPasswordError = action.error.message;
            });
    },
});

export const loggedInUser = (state) => state.auth.user;
export const isLoggedIn = (state) => state.auth.user != null;
export const getLoginStatus = (state) => state.auth.status;
export const getLoginError = (state) => state.auth.error;
export const getTokenStatus = (state) => state.auth.tokenStatus;
export const getTokenError = (state) => state.auth.tokenError;
export const getForgetPasswordStatus = (state) =>
    state.auth.forgetPasswordStatus;
export const getForgetPasswordError = (state) => state.auth.forgetPasswordError;
export const getResetPasswordStatus = (state) => state.auth.resetPasswordStatus;
export const getResetPasswordError = (state) => state.auth.resetPasswordError;
export const getChangePasswordStatus = (state) =>
    state.auth.changPasswordStatus;
export const getChangePasswordError = (state) => state.auth.changPasswordError;

export const { logout, reset } = authSlice.actions;
